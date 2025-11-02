import { connectMaster } from "../connector/connection.js";

async function seedDB() {
  const client = await connectMaster();

  // Drop existing tables (optional)
  // await client.query(`DROP TABLE IF EXISTS files, group_members, \`groups\`, messages, chats, users;`);

  // Create users (with avatar blob info)
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('student', 'teacher') NOT NULL,
      avatar_emoji VARCHAR(8) DEFAULT NULL, 
      avatar_url VARCHAR(512) DEFAULT NULL,
      avatar_blob_name VARCHAR(255) DEFAULT NULL,
      avatar_container VARCHAR(255) DEFAULT NULL,
      online TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Chats table (threads & groups)
  await client.query(`
    CREATE TABLE IF NOT EXISTS chats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      is_group TINYINT(1) DEFAULT 0,
      avatar_emoji VARCHAR(8) DEFAULT NULL,
      avatar_url VARCHAR(512) DEFAULT NULL,
      members INT DEFAULT 0,
      last_message TEXT DEFAULT NULL,
      last_message_time VARCHAR(50) DEFAULT NULL,
      unread INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Group members
  await client.query(`
    CREATE TABLE IF NOT EXISTS group_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      group_id INT,
      user_id INT,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES chats(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Messages (supports media blob references)
  await client.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      chat_id INT,
      sender_id INT,
      content TEXT,
      media_type VARCHAR(50) DEFAULT NULL,       -- 'image', 'file', etc
      media_file_name VARCHAR(255) DEFAULT NULL,
      media_blob_url TEXT DEFAULT NULL,
      media_blob_name VARCHAR(255) DEFAULT NULL,
      media_container VARCHAR(255) DEFAULT NULL,
      media_content_type VARCHAR(100) DEFAULT NULL,
      media_size INT DEFAULT NULL,
      is_bot TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // files table (optionally store separate file metadata; referenced by messages)
  await client.query(`
    CREATE TABLE IF NOT EXISTS files (
      id INT AUTO_INCREMENT PRIMARY KEY,
      message_id INT,
      blob_url TEXT NOT NULL,
      blob_name VARCHAR(255) NOT NULL,
      container VARCHAR(255) NOT NULL,
      content_type VARCHAR(100) DEFAULT NULL,
      size INT DEFAULT NULL,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
    );
  `);

  // Insert sample users (some with emoji avatars, some without)
  await client.query(`
    INSERT INTO users (name, email, password, role, avatar_emoji, avatar_url, avatar_blob_name, avatar_container, online)
    VALUES
      ('Alex Kim', 'alex@sample.com', 'hashed_pwd1', 'student', '🧑‍🎨', NULL, NULL, NULL, 1),
      ('Sarah Chen', 'sarah@sample.com', 'hashed_pwd2', 'student', '👩‍💼', NULL, NULL, NULL, 1),
      ('Michael Ross', 'michael@sample.com', 'hashed_pwd3', 'teacher', '👨‍🔬', NULL, NULL, NULL, 0),
      ('Emma Wilson', 'emma@sample.com', 'hashed_pwd4', 'student', '👩‍🎨', NULL, NULL, NULL, 1),
      ('James Lee', 'james@sample.com', 'hashed_pwd5', 'student', '👨‍💻', NULL, NULL, NULL, 0),
      ('AI Assistant', 'ai@assistant.com', 'dummy', 'teacher', '🤖', NULL, NULL, NULL, 1);
  `);

  // Insert chats (ids chosen to match frontend example: 1..5)
  await client.query(`
    INSERT INTO chats (id, name, is_group, avatar_emoji, members, last_message, last_message_time, unread)
    VALUES
      (1, 'Design Team', 1, '🎨', 12, 'New mockups are ready!', '2m', 3),
      (2, 'Sarah Chen', 0, '👩‍💼', 0, 'Thanks for the update', '5m', 0),
      (3, 'Dev Squad', 1, '💻', 8, 'Deployment successful', '1h', 0),
      (4, 'Michael Ross', 0, '👨‍🔬', 0, 'See you tomorrow', '3h', 0),
      (5, 'Marketing Hub', 1, '📱', 15, 'Campaign starts Monday', '5h', 1);
  `);

  // Add group members for group chats (Design Team = 1, Dev Squad = 3, Marketing Hub = 5)
  await client.query(`
    INSERT INTO group_members (group_id, user_id)
    VALUES
      (1, 1), (1, 2), (1, 3), (1, 4),
      (3, 1), (3, 3),
      (5, 2), (5, 4), (5, 1);
  `);

  // Insert messages including an image message which points to a blob URL
  // We'll simulate image stored in Azure with a sample blob URL (replace with real URL when uploading)
  const sampleImageUrl = 'https://studentmentorprotegesys.blob.core.windows.net/uploads/design-mockup.png';

  await client.query(`
    INSERT INTO messages (chat_id, sender_id, content, media_type, media_file_name, media_blob_url, media_blob_name, media_container, media_content_type, media_size, is_bot)
    VALUES
      (1, 1, 'Check out the new design concept', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
      (1, NULL, 'Looks amazing! Love the color palette', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1), -- treat as 'You' (self) or bot if needed
      (1, 2, 'Agreed! The gradient is perfect', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
      (1, 1, 'design-mockup.png', 'image', 'design-mockup.png', '${sampleImageUrl}', 'design-mockup.png', 'uploads', 'image/png', 20480, 0),
      (2, 2, 'Thanks for the update', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
      (3, 3, 'Deployment successful', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
      (4, 4, 'See you tomorrow', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
      (5, 5, 'Campaign starts Monday', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
      (NULL, 6, 'Hello! I\\'m your AI assistant. I can help you with questions...', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1);
  `);

  // Create separate files row for the uploaded image (optional but useful)
  await client.query(`
    INSERT INTO files (message_id, blob_url, blob_name, container, content_type, size)
    VALUES
      ( (SELECT id FROM messages WHERE media_blob_name = 'design-mockup.png' LIMIT 1), '${sampleImageUrl}', 'design-mockup.png', 'uploads', 'image/png', 20480 );
  `);

  console.log("✅ Database seeded successfully!");
  return
}

seedDB().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});



// (async () => {
//   const pool = await connectMaster();
// const [rows] : any = await pool.query("SELECT NOW() AS `current_time`;");
// console.log("🕒 Current Time:", rows[0].current_time);


// })();
