import { Request, Response } from "express";
import { connectMaster } from "../connector/connect.js";

async function fetchChatData(req: Request, res: Response) {
  try {
    const connection = await connectMaster();

    // Fetch all users
    const [userRows] = await connection.query(
      `SELECT id, name, avatar, online FROM users`
    );

    // Fetch all chat groups or individual chats
    const [chatRows] = await connection.query(
      `SELECT id, name, avatar, online, isGroup, members, lastMessage, time, unread FROM chats`
    );

    // Fetch messages for each chat
    const [messageRows] = await connection.query(
      `SELECT id, chatId, sender, text, time, read, self, media, fileName, imageUrl, isBot FROM messages`
    );

    // Build AI Assistant (static)
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

    // Convert messages into grouped format { chatId: [...] }
    const messages: Record<string | number, any[]> = {};

    (messageRows as any[]).forEach((msg) => {
      if (!messages[msg.chatId]) messages[msg.chatId] = [];
      messages[msg.chatId].push(msg);
    });

    // Add default AI bot chat
    messages["ai-bot"] = [
      {
        id: 1,
        sender: "AI Assistant",
        text: "Hello! I'm your AI assistant. How can I assist you today?",
        time: "09:00",
        read: true,
        self: false,
        isBot: true,
      },
    ];

    // Final structure
    res.status(200).json({
      status: "success",
      data: {
        chats: [aiBot, ...(chatRows as any[])],
        messages,
        allUsers: userRows,
      },
    });
  } catch (err: unknown) {
    let message = "An error occurred while fetching chat data";
    if (err instanceof Error) message = err.message;
    res.status(200).json({ status: "error", message });
  }
}

export default fetchChatData;
