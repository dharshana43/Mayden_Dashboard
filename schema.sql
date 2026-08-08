-- Run this file first in MySQL to create the database and tables

CREATE DATABASE IF NOT EXISTS mayden_dashboard;
USE mayden_dashboard;

-- Table 1: users
-- Stores login/signup data. Password is stored as a HASH, never plain text.
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: dashboard_data
-- Each row belongs to ONE user (user_id column).
-- This is what makes "each user sees only their own data" work --
-- when we fetch data, we always filter WHERE user_id = <logged in user>.
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

-- Sample data insert example (run manually after a user signs up, replace user_id):
-- INSERT INTO dashboard_data (user_id, entry_date, policies, corporates, active_members, inactive_members, total_members, total_lives, insurers, payers)
-- VALUES (1, '2025-10-27', 52, 34, 61751, 1200, 62951, 182172, 10, 9);
