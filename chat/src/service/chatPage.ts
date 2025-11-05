import { Request, Response } from "express";
import blobServiceClient from "../connector/blob.js";
import { connectMaster } from "../connector/connect.js";
import streamToBuffer from "../connector/streamToBuffer.js";

interface UserType {
  id: number;
  username: string;
  displayName: string;
  avatar: string | null;
}

interface ChatType {
  id: number;
  name: string;
  isGroup: boolean;
  members: number[];
}

interface MessageType {
  id: number;
  chatId: number;
  senderId: number;
  text: string | null;
  time: string;
  mediaType: "none" | "image" | "pdf";
  fileName: string | null;
  blobName: string | null;
  blobUrl: string | null;
  file?: string | null; // base64
}

const fetchChatData = async (req: Request, res: Response) => {
  try {
    const db = await connectMaster();
    const { session } = req.body;

    if (!session) {
      return res.status(400).json({ status: "error", message: "Session missing" });
    }

    // 🧠 1️⃣ Identify the logged-in user
    const [sessionUser]: any = await db.query(
      `SELECT username FROM session WHERE session = ?`,
      [session]
    );
    if (!sessionUser.length) {
      return res.status(401).json({ status: "error", message: "Invalid session" });
    }

    const username = sessionUser[0].username;

    const [userInfo]: any = await db.query(
      `SELECT id, username, display_name AS displayName, avatar_emoji AS avatar FROM users WHERE username = ?`,
      [username]
    );
    const currentUser: UserType = userInfo[0];

    // 👥 2️⃣ Fetch all users (for frontend to resolve names/avatars)
    const [users]: any = await db.query(`
      SELECT id, username, display_name AS displayName, avatar_emoji AS avatar
      FROM users;
    `);

    // 💬 3️⃣ Get all chats this user participates in
    const [groupChats]: any = await db.query(
      `SELECT DISTINCT g.chat_id AS chatId
       FROM group_members g
       WHERE g.user_id = ?`,
      [currentUser.id]
    );

    // One-to-one chats: the user appears in chat names (Sai & Hussain, etc.)
    // or by inference of existing messages
    // ✅ One-to-one chats where this user is either sender or recipient
const [directChats]: any = await db.query(
  `SELECT DISTINCT m.chat_id AS chatId
   FROM messages m
   JOIN chats c ON m.chat_id = c.id
   WHERE m.sender_id = ?
      OR m.chat_id IN (
        SELECT DISTINCT chat_id
        FROM messages
        WHERE sender_id = ?
      )`,
  [currentUser.id, currentUser.id]
);


    const allChatIds = [
      ...new Set([
        ...groupChats.map((g: any) => g.chatId),
        ...directChats.map((d: any) => d.chatId),
      ]),
    ];

    if (allChatIds.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No chats yet",
        data: {
          currentUser,
          users,
          chats: [],
          messages: [],
        },
      });
    }

    // 📦 4️⃣ Fetch chat info
    const [chats]: any = await db.query(
      `SELECT id, name, is_group AS isGroup, created_at FROM chats WHERE id IN (?)`,
      [allChatIds]
    );

    // 👥 5️⃣ Group members
    const [groupMembers]: any = await db.query(`
      SELECT chat_id AS chatId, user_id AS userId FROM group_members;
    `);

    // 📨 6️⃣ Fetch all messages from those chats
    const [messages]: any = await db.query(
      `SELECT 
        id, chat_id AS chatId, sender_id AS senderId, content,
        media_type AS mediaType, file_name AS fileName, blob_name AS blobName, blob_url AS blobUrl,
        TIME_FORMAT(created_at, '%H:%i') AS time
      FROM messages
      WHERE chat_id IN (?)
      ORDER BY created_at ASC;`,
      [allChatIds]
    );

    // 🧩 7️⃣ Organize members
    const chatMembers: Record<number, number[]> = {};
    for (const m of groupMembers) {
      if (!chatMembers[m.chatId]) chatMembers[m.chatId] = [];
      chatMembers[m.chatId].push(m.userId);
    }

    // ☁️ 8️⃣ Azure blob container
    const containerClient = blobServiceClient.getContainerClient("uploads");

    // 🗂️ 9️⃣ Process media
    const processedMessages: MessageType[] = [];
    for (const msg of messages) {
      let fileBase64: string | null = null;

      if (msg.mediaType !== "none" && msg.blobName) {
        try {
          const blobClient = containerClient.getBlobClient(msg.blobName);
          if (await blobClient.exists()) {
            const downloadResp = await blobClient.download();
            const buffer = await streamToBuffer(downloadResp.readableStreamBody);
            fileBase64 = buffer.toString("base64");
          }
        } catch (e) {
          console.warn("⚠️ Blob fetch failed for:", msg.blobName);
        }
      }

      processedMessages.push({
        id: msg.id,
        chatId: msg.chatId,
        senderId: msg.senderId,
        text: msg.content,
        time: msg.time,
        mediaType: msg.mediaType,
        fileName: msg.fileName,
        blobName: msg.blobName,
        blobUrl: msg.blobUrl,
        file: fileBase64,
      });
    }

    // ✅ 10️⃣ Format chats
    const formattedChats: ChatType[] = chats.map((chat: any) => ({
      id: chat.id,
      name: chat.name,
      isGroup: !!chat.isGroup,
      members: chatMembers[chat.id] || [],
    }));

    console.log("✅ Chat data fetched for user:", currentUser.username);

    // ✅ Final response
    res.status(200).json({
      status: "success",
      message: "User chat data fetched successfully",
      data: {
        currentUser,
        users,
        chats: formattedChats,
        messages: processedMessages,
      },
    });
  } catch (err) {
    console.error("❌ Error in fetchChatData:", err);
    res.status(500).json({
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export default fetchChatData;
