import { Request, Response } from "express";
import { connectMaster } from "../connector/connect.js";

async function saveMessages(req: Request, res: Response) {
  try {
    const connectionMaster = await connectMaster();

    // 1️⃣ Extract data from request body
    const { chatId, senderId, message } = req.body;

    console.log("Request body in saveMessages:", req.body);

    if (!chatId || !senderId || !message || !message.text) {
      res.status(400).json({
        status: "error",
        message: "Missing required fields: chatId, senderId, or message.text",
      });
      return;
    }

    // 2️⃣ Insert message into messages table
    const insertQuery = `
      INSERT INTO messages 
        (chat_id, sender_id, content, media_type, media_file_name, media_blob_url, media_size, is_bot)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const [result]: any = await connectionMaster.query(insertQuery, [
      chatId,
      senderId === "ai-bot" ? null : senderId, // handle bot or null sender
      message.text || null,
      message.media || null,
      message.fileName || null,
      message.imageUrl || null,
      message.fileSize ? parseInt(message.fileSize) : null,
      0, // is_bot = false
    ]);

    const messageId = result.insertId;

    // 3️⃣ Update last message info in chats table
    await connectionMaster.query(
      `
      UPDATE chats 
      SET last_message = ?, last_message_time = ?
      WHERE id = ?;
      `,
      [message.text || message.fileName, message.time, chatId]
    );

    // 4️⃣ Fetch the inserted message back for confirmation
    const [rows]: any = await connectionMaster.query(
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
      LEFT JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?;
      `,
      [messageId]
    );

    const savedMessage = rows[0];

    // 5️⃣ Success response
    res.status(200).json({
      status: "success",
      message: "Message saved successfully",
      data: {
        savedMessage,
      },
    });
    return;
  } catch (err: unknown) {
    let message = "An error occurred while saving message";
    if (err instanceof Error) {
      message = err.message;
      console.error("Error in saveMessages function:", message);
    }

    res.status(200).json({
      status: "error",
      message: message,
      data: {
        savedMessage: null,
      },
    });
    return;
  }
}

export default saveMessages;
