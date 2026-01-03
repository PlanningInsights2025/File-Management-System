const db = require('../config/database');
const bcrypt = require('bcryptjs');

// If database is not available, use memory storage
if (!db) {
  module.exports = require('./User.memory');
  return;
}

class User {
  static async create(userData) {
    const { username, email, password, role = 'user', company_id } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const query = `
      INSERT INTO users (username, email, password, role, company_id, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const [result] = await db.execute(query, [username, email, hashedPassword, role, company_id]);
    return result.insertId;
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, username, email, role, company_id, created_at FROM users WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async updatePassword(userId, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const query = 'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?';
    await db.execute(query, [hashedPassword, userId]);
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getAll() {
    const query = 'SELECT id, username, email, role, company_id, created_at FROM users';
    const [rows] = await db.execute(query);
    return rows;
  }

  static async update(id, userData) {
    const { username, email, role, company_id } = userData;
    const query = `
      UPDATE users 
      SET username = ?, email = ?, role = ?, company_id = ?, updated_at = NOW() 
      WHERE id = ?
    `;
    await db.execute(query, [username, email, role, company_id, id]);
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    await db.execute(query, [id]);
  }
}

module.exports = User;
