// Temporary in-memory user storage (for testing without database)
const bcrypt = require('bcryptjs');

// In-memory user storage
const users = [];
let userIdCounter = 1;

// Add default admin user
const defaultAdminPassword = bcrypt.hashSync('admin123', 10);
users.push({
  id: userIdCounter++,
  username: 'Admin User',
  email: 'admin@fms.com',
  password: defaultAdminPassword,
  role: 'admin',
  company_id: null,
  created_at: new Date(),
  updated_at: new Date()
});

class UserMemory {
  static async create(userData) {
    const { username, email, password, role = 'user', company_id } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = {
      id: userIdCounter++,
      username,
      email,
      password: hashedPassword,
      role,
      company_id: company_id || null,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    users.push(newUser);
    return newUser.id;
  }

  static async findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static async findById(id) {
    const user = users.find(user => user.id === id);
    if (!user) return null;
    
    // Return without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async updatePassword(userId, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const user = users.find(u => u.id === userId);
    if (user) {
      user.password = hashedPassword;
      user.updated_at = new Date();
    }
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getAll() {
    return users.map(({ password, ...user }) => user);
  }

  static async update(id, userData) {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...userData,
        updated_at: new Date()
      };
    }
  }

  static async delete(id) {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
    }
  }
}

module.exports = UserMemory;
