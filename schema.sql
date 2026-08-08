CREATE DATABASE IF NOT EXISTS mayden_dashboard;
USE mayden_dashboard;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dashboard_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entry_date DATE NOT NULL,
    policies INT DEFAULT 0,
    corporates INT DEFAULT 0,
    active_members INT DEFAULT 0,
    inactive_members INT DEFAULT 0,
    total_members INT DEFAULT 0,
    total_lives INT DEFAULT 0,
    insurers INT DEFAULT 0,
    payers INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);