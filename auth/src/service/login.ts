import { Request, Response } from "express";
import { randomBytes } from "crypto";
import { connectMaster } from "../connector/connection.js";

interface LoginRequest {
  username: string;
  password: string;
}

const generateSession = (): string => {
  return randomBytes(32).toString("hex");
};

async function login(req: Request & { body: LoginRequest }, res: Response) {
  try {
    const uname = req.body.username;
    const password = req.body.password;

    const db = await connectMaster();

    // 🔍 Fetch user details based on new seed schema
    const [rows] = await db.query(
      `SELECT id, username, password, display_name, avatar_emoji, role 
       FROM users WHERE username = ?`,
      [uname]
    );

    const users = rows as any[];

    if (users.length === 0) {
      return res.status(200).json({
        status: "error",
        message: "Invalid username or password",
      });
    }

    const user = users[0];

    // 🔐 Password check
    if (user.password !== password) {
      return res.status(200).json({
        status: "error",
        message: "Invalid username or password",
      });
    }

    // 🔁 Remove old sessions for safety (important for chat apps)
    await db.query(`DELETE FROM session WHERE username = ?`, [uname]);

    // 🔑 Create new session
    const session = generateSession();
    await db.query(
      `INSERT INTO session (session, username) VALUES (?, ?)`,
      [session, uname]
    );

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      session,
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        avatar_emoji: user.avatar_emoji,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.log("Login failed:", err);

    return res.status(200).json({
      status: "error",
      message: err?.message || "Login failed due to server error",
    });
  }
}

export default login;
