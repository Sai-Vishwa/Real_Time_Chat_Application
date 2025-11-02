import { Request, Response } from "express";
import { connectMaster } from "../connector/connect.js";

interface ChatType {
  id: number;
  name: string;
  isGroup: boolean;
  avatar: string;
  members: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface MessageType {
  id: number;
  chatId: number | null;
  sender: string;
  text: string;
  time: string;
  isBot: boolean;
  self: boolean;
  media: string | null;
  fileName: string | null;
  imageUrl: string | null;
}

interface UserType {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
}

async function fetchChatData(req: Request, res: Response) {
  try {
    const connectionMaster = await connectMaster();

    // 1️⃣ Fetch chats
    const [chatRows] : any = await connectionMaster.query(
      `
      SELECT 
        id, name, 
        CASE WHEN is_group = 1 THEN TRUE ELSE FALSE END AS isGroup,
        avatar_emoji AS avatar,
        members, last_message AS lastMessage,
        last_message_time AS time, unread
      FROM chats;
      `
    );

    const chats: ChatType[] = chatRows as ChatType[];

    // 2️⃣ Fetch messages grouped by chat_id
    const [messageRows] :  any = await connectionMaster.query(
      `
      SELECT 
        m.id, m.chat_id AS chatId, 
        u.name AS sender, 
        m.content AS text,
        TIME_FORMAT(m.created_at, '%H:%i') AS time,
        CASE WHEN m.is_bot = 1 THEN TRUE ELSE FALSE END AS isBot,
        CASE WHEN m.sender_id IS NULL THEN TRUE ELSE FALSE END AS self,
        m.media_type AS media,
        m.media_file_name AS fileName,
        m.media_blob_url AS imageUrl
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u.id;
      `
    );

    const messages: MessageType[] = messageRows as MessageType[];

    // 3️⃣ Group messages by chatId
    const groupedMessages: Record<string | number, MessageType[]> = {};
    messages.forEach((msg) => {
      const key = msg.chatId ?? "ai-bot";
      if (!groupedMessages[key]) groupedMessages[key] = [];
      groupedMessages[key].push(msg);
    });

    // 4️⃣ Fetch all users
    const [userRows] : any = await connectionMaster.query(
      `SELECT id, name, avatar_emoji AS avatar, online FROM users;`
    );

    const allUsers: UserType[] = userRows as UserType[];

    // 5️⃣ Add AI bot manually
    const aiBot = {
      id: "ai-bot",
      name: "AI Assistant",
      avatar: "🤖",
      online: true,
      isBot: true,
      lastMessage: "How can I help you today?",
      time: "now",
      unread: 0,
    };

    // 6️⃣ Final response
    res.status(200).json({
      status: "success",
      message: "Chat data fetched successfully",
      data: {
        aiBot,
        chats,
        messages: groupedMessages,
        allUsers,
      },
    });
    return;
  } catch (err: unknown) {
    let message = "An error occurred while fetching chat data";
    if (err instanceof Error) {
      message = err.message;
      console.error("Error in fetchChatData function:", message);
    }

    res.status(200).json({
      status: "error",
      message: message,
      data: {
        aiBot: null,
        chats: [],
        messages: {},
        allUsers: [],
      },
    });
    return;
  }
}

export default fetchChatData;
