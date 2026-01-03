-- Users table for authentication
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
    INDEX idx_role (role),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, role, company_id) VALUES
('Admin User', 'admin@fms.com', '$2a$10$rQXZ9VN8YXZ9VN8YXZ9VNu7QXZ9VN8YXZ9VN8YXZ9VN8YXZ9VN8Y', 'admin', NULL),
('Test User', 'user@fms.com', '$2a$10$rQXZ9VN8YXZ9VN8YXZ9VNu7QXZ9VN8YXZ9VN8YXZ9VN8YXZ9VN8Y', 'user', NULL);

-- Note: Default password for both users is 'admin123'
-- You should change these passwords after first login
