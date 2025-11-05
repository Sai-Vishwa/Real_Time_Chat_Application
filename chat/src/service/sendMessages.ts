import { Request, Response } from "express";
import multer from "multer";
import blobServiceClient from "../connector/blob.js";
import { connectMaster } from "../connector/connect.js";

const upload = multer({ storage: multer.memoryStorage() });

export const sendMessage = [
  upload.single("file"),

  async (req: Request, res: Response) => {
    try {
      const db = await connectMaster();
      const { session, chatId, senderId, text, mediaType, fileName, time } = req.body;

      if (!session || !chatId || !senderId) {
        return res.status(400).json({
          status: "error",
          message: "Missing required fields (session, chatId, senderId)",
        });
      }

      // 🧠 1️⃣ Validate session
      const [sessionUser]: any = await db.query(
        `SELECT username FROM session WHERE session = ?`,
        [session]
      );

      if (!sessionUser.length) {
        return res.status(401).json({ status: "error", message: "Invalid session" });
      }

      // ☁️ 2️⃣ Prepare blob details
      let blobName: string | null = null;
      let blobUrl: string | null = null;

      if (req.file) {
        const containerClient = blobServiceClient.getContainerClient("uploads");
        blobName = `${Date.now()}-${req.file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(req.file.buffer, {
          blobHTTPHeaders: { blobContentType: req.file.mimetype },
        });

        blobUrl = blockBlobClient.url;
      }

      // 💾 3️⃣ Save message in DB
      await db.query(
        `INSERT INTO messages (chat_id, sender_id, content, media_type, file_name, blob_name, blob_url, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [chatId, senderId, text || null, mediaType || "none", fileName || null, blobName, blobUrl]
      );

      // 🔍 4️⃣ Fetch inserted message (with formatted time)
      const [inserted]: any = await db.query(
        `SELECT id, chat_id AS chatId, sender_id AS senderId, content, media_type AS mediaType, file_name AS fileName,
                blob_name AS blobName, blob_url AS blobUrl,
                TIME_FORMAT(created_at, '%H:%i') AS time
         FROM messages
         WHERE chat_id = ? AND sender_id = ?
         ORDER BY created_at DESC LIMIT 1`,
        [chatId, senderId]
      );

      const message = inserted[0];

      // ✅ 5️⃣ Send response
      res.status(200).json({
        status: "success",
        message: "Message sent successfully",
        data: {
          id: message.id,
          chatId: message.chatId,
          senderId: message.senderId,
          text: message.content,
          time: message.time,
          mediaType: message.mediaType,
          fileName: message.fileName,
          blobName: message.blobName,
          blobUrl: message.blobUrl,
        },
      });
    } catch (err) {
      console.error("❌ Error in sendMessage:", err);
      res.status(500).json({
        status: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },
];
