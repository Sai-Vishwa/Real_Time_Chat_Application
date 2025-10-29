import { connectMaster } from "../connector/connection.js";

async function seedDB() {
  const client = await connectMaster();

  // Drop existing tables (optional)
  // await client.query(`DROP TABLE IF EXISTS files, group_members, \`groups\`, messages, users;`);

  // Create tables
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('student', 'teacher') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS \`groups\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS group_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      group_id INT,
      user_id INT,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES \`groups\`(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender_id INT,
      receiver_id INT,
      group_id INT,
      content TEXT,
      type VARCHAR(20) DEFAULT 'text',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id),
      FOREIGN KEY (group_id) REFERENCES \`groups\`(id)
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS files (
      id INT AUTO_INCREMENT PRIMARY KEY,
      message_id INT,
      file_path TEXT NOT NULL,
      file_name VARCHAR(255) NOT NULL,
      file_size INT,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
    );
  `);

  // Insert users
  await client.query(`
    INSERT INTO users (name, email, password, role) VALUES
    ('Alice', 'alice@student.com', 'hashed_password1', 'student'),
    ('Bob', 'bob@student.com', 'hashed_password2', 'student'),
    ('Dr. Smith', 'smith@teacher.com', 'hashed_password3', 'teacher'),
    ('AI Assistant', 'ai@assistant.com', 'dummy', 'teacher');
  `);

  // Insert groups
  await client.query(`
    INSERT INTO \`groups\` (name, created_by) VALUES
    ('Math Club', 3),
    ('Physics Group', 3);
  `);

  // Insert group members
  await client.query(`
    INSERT INTO group_members (group_id, user_id) VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 1),
    (2, 3);
  `);

  // Insert messages
  await client.query(`
    INSERT INTO messages (sender_id, receiver_id, content, type) VALUES
    (1, 2, 'Hey Bob!', 'text'),
    (2, 1, 'Hey Alice, how are you?', 'text'),
    (3, 1, 'Welcome to Math Club!', 'text'),
    (4, 1, 'Hello! I am your AI Assistant.', 'text');
  `);

  // Insert file metadata
  await client.query(`
    INSERT INTO files (message_id, file_path, file_name, file_size) VALUES
    (1, '/uploads/2025/01/alice_math.png', 'alice_math.png', 2048);
  `);

  console.log("✅ Database seeded successfully!");
}

seedDB().catch(console.error);
