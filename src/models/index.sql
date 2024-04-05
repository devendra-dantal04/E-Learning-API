-- User table to store user details
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255), -- URL to the profile picture
);

-- Course table to store course details
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    level VARCHAR(50),
    popularity INTEGER -- Popularity can be measured in any appropriate way, e.g., number of enrollments
);

-- Enrollment table to represent the many-to-many relationship between users and courses
CREATE TABLE enrollments (
    user_id INTEGER REFERENCES users(id),
    course_id INTEGER REFERENCES courses(id),
    PRIMARY KEY (user_id, course_id)
);