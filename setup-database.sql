-- ================================================
-- File Management System - Database Setup
-- ================================================

-- Step 1: Create Database
CREATE DATABASE IF NOT EXISTS fms_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Step 2: Use the database
USE fms_db;

-- Step 3: Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    company_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 4: Create Companies Table (if needed)
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    address TEXT,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 5: Add Foreign Key to Users Table
ALTER TABLE users 
ADD CONSTRAINT fk_user_company 
FOREIGN KEY (company_id) REFERENCES companies(id) 
ON DELETE SET NULL;

-- Step 6: Insert Default Admin User
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (username, email, password, role, company_id) 
VALUES (
    'Admin User', 
    'admin@fms.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'admin', 
    NULL
) ON DUPLICATE KEY UPDATE username=username;

-- Step 7: Insert Test User
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (username, email, password, role, company_id) 
VALUES (
    'Test User', 
    'user@fms.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'user', 
    NULL
) ON DUPLICATE KEY UPDATE username=username;

-- Step 8: Verify Setup
SELECT 'Database setup completed successfully!' AS status;
SELECT COUNT(*) as user_count FROM users;
SELECT * FROM users;

-- Show tables
SHOW TABLES;
