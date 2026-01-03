-- Company Management Table
-- Add this to your existing database schema

CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    companyName VARCHAR(255) NOT NULL UNIQUE,
    companyCode VARCHAR(50) UNIQUE,
    contactPerson VARCHAR(255) NOT NULL,
    designation VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alternatePhone VARCHAR(20),
    website VARCHAR(255),
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    zipCode VARCHAR(20),
    industry VARCHAR(100),
    companySize VARCHAR(50),
    notes TEXT,
    isActive BOOLEAN DEFAULT TRUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_companyName (companyName),
    INDEX idx_email (email),
    INDEX idx_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key to files table if it doesn't exist
-- ALTER TABLE files ADD COLUMN companyId INT;
-- ALTER TABLE files ADD CONSTRAINT fk_files_company 
--     FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE RESTRICT;

-- Sample data for testing
INSERT INTO companies (companyName, companyCode, contactPerson, designation, email, phone, address, city, state, zipCode, industry, companySize, notes, isActive) VALUES
('ABC Corporation', 'ABC-001', 'John Smith', 'General Manager', 'john.smith@abccorp.com', '+1 (555) 123-4567', '123 Business Street', 'New York', 'NY', '10001', 'Technology', '201-500', 'Premium client since 2020', TRUE),
('XYZ Enterprises', 'XYZ-002', 'Sarah Johnson', 'Operations Director', 'sarah.j@xyzent.com', '+1 (555) 234-5678', '456 Commerce Avenue', 'Los Angeles', 'CA', '90001', 'Finance', '51-200', '', TRUE),
('Global Solutions Ltd', 'GS-003', 'Michael Chen', 'CEO', 'mchen@globalsolutions.com', '+1 (555) 345-6789', '789 Innovation Drive', 'San Francisco', 'CA', '94102', 'Manufacturing', '500+', 'International operations', TRUE),
('Tech Innovators Inc', 'TI-004', 'Emily Davis', 'Project Manager', 'edavis@techinnovators.com', '+1 (555) 456-7890', '321 Tech Park', 'Austin', 'TX', '73301', 'Technology', '11-50', 'Startup company', TRUE),
('Finance Masters LLC', 'FM-005', 'Robert Wilson', 'CFO', 'rwilson@financemasters.com', '+1 (555) 567-8901', '555 Wall Street', 'Chicago', 'IL', '60601', 'Finance', '201-500', 'Legacy client', TRUE);
