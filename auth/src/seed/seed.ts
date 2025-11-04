import { connectMaster } from "../connector/connection.js";

async function seedDB() {
  const db = await connectMaster();

  // 🧨 Drop all tables first
  await db.query(`
    DROP TABLE IF EXISTS group_members, session , files, messages, chats, users;
  `);

  // 👥 Users table
  await db.query(`
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      display_name VARCHAR(100) NOT NULL,
      avatar_emoji VARCHAR(10) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 💬 Chats (1-to-1 or group)
  await db.query(`
    CREATE TABLE chats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150),
      is_group TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 👥 Group Members (only used when is_group = 1)
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

  // 📨 Messages (text, image, pdf)
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

    await db.query(`
    CREATE TABLE session (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session VARCHAR(100) NOT NULL,
      username VARCHAR(100) NOT NULL,
      FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
    )
  `);

  // 👤 Users
  await db.query(`
    INSERT INTO users (username, password, display_name, avatar_emoji)
    VALUES
      ('sai', 'sai123', 'Sai Vishwa', '⚡'),
      ('hussain', 'hussain123', 'Hussain', '🧠'),
      ('prasanth', 'prasanth123', 'Prasanth', '🔥'),
      ('bala', 'bala123', 'Bala', '🎯'),
      ('aakash', 'aakash123', 'Aakash', '🚀');
  `);

  // 💭 Chats (Sai’s perspective)
  await db.query(`
    INSERT INTO chats (name, is_group)
    VALUES
      ('Sai & Hussain', 0),
      ('Sai & Prasanth', 0),
      ('Sai & Bala', 0),
      ('Tech Titans', 1);
  `);

  // 👥 Group members for "Tech Titans"
  await db.query(`
    INSERT INTO group_members (chat_id, user_id)
    VALUES
      (4, 1), -- Sai
      (4, 2), -- Hussain
      (4, 3), -- Prasanth
      (4, 4), -- Bala
      (4, 5); -- Aakash
  `);

  // 🌐 Azure blob samples
  const imgBlob = 'https://youraccount.blob.core.windows.net/uploads/design-123.png';
  const pdfBlob = 'https://youraccount.blob.core.windows.net/uploads/specs-456.pdf';

  // 💌 Messages
  await db.query(`
    INSERT INTO messages (chat_id, sender_id, content, media_type, file_name, blob_name, blob_url)
    VALUES
      (1, 1, 'Hey Hussain, check this out!', 'none', NULL, NULL, NULL),
      (1, 2, 'Bro this looks great 🔥', 'image', 'design.png', 'design-123.png', '${imgBlob}'),

      (2, 1, 'Prasanth, here’s the new document', 'pdf', 'specs.pdf', 'specs-456.pdf', '${pdfBlob}'),
      (2, 3, 'Nice, will review it now', 'none', NULL, NULL, NULL),

      (3, 1, 'Bala, backend is running fine?', 'none', NULL, NULL, NULL),
      (3, 4, 'Yes vro, no bugs 😎', 'none', NULL, NULL, NULL),

      (4, 1, 'Team, let’s deploy at 6 PM sharp!', 'none', NULL, NULL, NULL),
      (4, 5, 'Got it', 'none', NULL, NULL, NULL),
      (4, 3, 'All tests passed ✅', 'none', NULL, NULL, NULL),
      (4, 2, 'Perfect coordination!', 'none', NULL, NULL, NULL);
  `);

  console.log("✅ Database seeded successfully with group + media support!");
  process.exit(0);
}

seedDB().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
