
-- User table to store user details
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255), -- URL to the profile picture
    is_admin BOOLEAN DEFAULT FALSE
    refresh_token VARCHAR(255)
    reset_password_token VARCHAR(255)
);

-- Course table to store course details
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    level VARCHAR(50),
    popularity INTEGER,
    instructor VARCHAR(100),
    price DECIMAL(10, 2), -- DECIMAL data type for storing prices with precision (10 digits) and scale (2 decimal places)
    duration INTERVAL -- INTERVAL data type for storing time intervals
);

-- Enrollment table to represent the many-to-many relationship between users and courses
CREATE TABLE enrollments (
    user_id INTEGER REFERENCES users(id),
    course_id INTEGER REFERENCES courses(id),
    PRIMARY KEY (user_id, course_id)
);