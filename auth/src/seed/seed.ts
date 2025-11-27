import { connectMaster } from "../connector/connection.js";

async function seedDB() {
  const db = await connectMaster();

  // 🧨 Drop all tables
  await db.query(`
    DROP TABLE IF EXISTS group_members, session, messages, chats, users;
  `);

  // 👥 Users table (roles added)
  await db.query(`
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      display_name VARCHAR(100) NOT NULL,
      avatar_emoji VARCHAR(10) DEFAULT NULL,
      role ENUM('student','mentor','ai_agent') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 💬 Chats table
  await db.query(`
    CREATE TABLE chats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150),
      is_group TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 👥 Group Members
  await db.query(`
    CREATE TABLE group_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      chat_id INT NOT NULL,
      user_id INT NOT NULL,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 📨 Messages (blob info kept)
  await db.query(`
    CREATE TABLE messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      chat_id INT NOT NULL,
      sender_id INT NOT NULL,
      content TEXT DEFAULT NULL,
      media_type ENUM('none', 'image', 'pdf') DEFAULT 'none',
      file_name VARCHAR(255) DEFAULT NULL,
      blob_name VARCHAR(255) DEFAULT NULL,
      blob_url TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 🔐 Sessions
  await db.query(`
    CREATE TABLE session (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session VARCHAR(100) NOT NULL,
      username VARCHAR(100) NOT NULL,
      FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
    );
  `);

  // 👥 Seed Users (students + mentors + AI agent)
  await db.query(`
    INSERT INTO users (username, password, display_name, avatar_emoji, role)
    VALUES
      ('mentor_sai', 'pass123', 'Mentor Sai', '🧠', 'mentor'),
      ('mentor_hussain', 'pass123', 'Mentor Hussain', '📘', 'mentor'),
      ('stud_bala', 'pass123', 'Student Bala', '🎯', 'student'),
      ('stud_prasanth', 'pass123', 'Student Prasanth', '🚀', 'student'),
      ('stud_ruben', 'pass123', 'Student Ruben', '🌸', 'student'),
      ('ai_helper', 'pass123', 'AI Study Bot', '🤖', 'ai_agent');
  `);

  // 💬 Chats
  await db.query(`
    INSERT INTO chats (name, is_group)
    VALUES
      ('Computer Science Group', 1),      -- Group mentorship
      ('Chemistry Group', 1),  -- Another mentor group
      ('Bala ↔ AI Bot', 0),         -- 1-to-1 AI doubt clearing
      ('Ruben ↔ Mentor Sai', 0);     -- Student ↔ Mentor DM
  `);

  // 👥 Group Members (mentor + protégés)
  await db.query(`
    INSERT INTO group_members (chat_id, user_id)
    VALUES
      (1, 1),  -- Mentor Sai
      (1, 3),  -- Bala
      (1, 4),  -- Aakash
      (1, 5),  -- Devi

      (2, 2),  -- Mentor Hussain
      (2, 4),  -- Aakash
      (2, 3);  -- Bala
  `);

  // 🌐 Sample Blob URLs
const imgBlob = "https://studentmentorprotegesys.blob.core.windows.net/uploads/seed-assignment.png";
const pdfBlob = "https://studentmentorprotegesys.blob.core.windows.net/uploads/seed-notes.pdf";


  // 💌 Messages
  await db.query(`
    INSERT INTO messages (chat_id, sender_id, content, media_type, file_name, blob_name, blob_url)
    VALUES
      (1, 1, 'Welcome students! Lets start strong 💪 with tech', 'none', NULL, NULL, NULL),
      (1, 3, 'Sir, I uploaded my assignment image.', 'image', 'assignment.png', 'assignment-101.png', '${imgBlob}'),

      (3, 3, 'AI Bot, explain recursion?', 'none', NULL, NULL, NULL),
      (3, 6, 'Sure! Recursion means a function calling itself 🔁', 'none', NULL, NULL, NULL),

      (4, 5, 'Sir I need help with cloud notes.', 'pdf', 'unit2.pdf', 'notes-202.pdf', '${pdfBlob}'),
      (4, 1, 'Kindly refer azure docs', 'none', NULL, NULL, NULL);
  `);

  console.log("✅ Student-Mentor-Protégé chat system seeded successfully!");
  process.exit(0);
}

seedDB().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
