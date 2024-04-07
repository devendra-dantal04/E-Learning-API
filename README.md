Postman Documentation URL (still working on it) : https://documenter.getpostman.com/view/23535950/2sA35Mxy9h 

**Backend E-Learning API**

This well-structured backend API empowers you to build a robust e-learning platform. It leverages powerful technologies for scalability, security, and efficient data management:

- **Node.js:** The versatile JavaScript runtime environment for building scalable and performant server-side applications.
- **Express.js:** A minimalist and flexible web framework for Node.js, streamlining API development and enabling you to create well-structured, maintainable APIs.
- **Neon Serverless for PostgreSQL:** Provides a seamless serverless data access layer, simplifying your interaction with the PostgreSQL database for streamlined development and improved cloud resource utilization. ([Neon Serverless](https://neon.tech/) - free tier)
- **JWT Authentication:** Employs JSON Web Tokens (JWT) to secure user authentication and authorization. JWTs offer a secure and stateless approach to manage user access within your e-learning platform.
- **Cloudinary:** Leverages this cloud-based image and video management service to efficiently store and manage profile pictures, ensuring scalability and reliability. ([Cloudinary](https://cloudinary.com/) - free tier plan)
- **Winston Module:** A versatile logging library, offering comprehensive logging capabilities to enhance application debugging, performance monitoring, and overall observability.
- **Resend:** Used for efficient email communication. ([Resend](https://resend.com/) - free tier plan)

**Getting Started**

To embark on your e-learning API development journey, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/devendra-dantal04/E-Learning-API
   cd E-Learning-API
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Rename `.env.example` to `.env` and populate it with the necessary environment variables according to the provided instructions or documentation. Pay close attention to variables related to email communication (if applicable).

4. **Start the Server:**

   ```bash
   npm start
   ```

5. **Admin User Credentials:**

   - Email: `admin@example.com`
   - Password: `adminpassword` (Please note that using a strong, unique password for production environments is highly recommended.)

6. **Sample Course IDs:**

   - Course 1: `1`
   - Course 2: `3` (These are just examples; actual course IDs will vary in your implementation.)

**API Endpoints (Formatted in Markdown)**

**User Routes:**

| Method | Endpoint                                                    | Description                                                     |
| ------ | ----------------------------------------------------------- | --------------------------------------------------------------- |
| POST   | `/api/v1/users/login`                                       | User login endpoint for authentication.                         |
| POST   | `/api/v1/users/register`                                    | User registration endpoint for creating new user accounts.      |
| POST   | `/api/v1/users/refresh-token`                               | Endpoint to refresh an access token using the refresh token.    |
| POST   | `/api/v1/users/reset-password`                              | Endpoint to initiate password reset.                            |
| POST   | `/api/v1/users/reset-password/:resetToken` (Path Parameter) | Endpoint to update the password after a password reset request. |
| POST   | `/api/v1/users/update`                                      | Endpoint to update user account details (excluding password).   |
| POST   | `/api/v1/users/update-password`                             | Endpoint to update the user's password.                         |
| GET    | `/api/v1/users/:userId` (Path Parameter)                    | Retrieves the current user's details.                           |
| PATCH  | `/api/v1/users/profile-picture`                             | Endpoint to update the user's profile picture.                  |
| POST   | `/api/v1/users/logout`                                      | Endpoint for user logout.                                       |

**Courses Routes:**

| Method                          | Endpoint                               | Description                |
| ------------------------------- | -------------------------------------- | -------------------------- |
| GET                             | `/api/v1/courses/`                     | Fetch available courses.   |
| **Secured Routes (Admin Only)** |
| POST                            | `/api/v1/courses/add`                  | Add new course details.    |
| DELETE                          | `/api/v1/courses/:id` (Path Parameter) | Delete the course details. |
| PUT                             | `/api/v1/courses/:id` (Path Parameter) | Update the course details. |

**Enrollment Routes:**

| Method | Endpoint                          | Description                                          |
| ------ | --------------------------------- | ---------------------------------------------------- |
| POST   | `/api/v1/courses/:id/enroll`      | Enroll the user in the course with the specified ID. |
| GET    | `/api/v1/courses/enrolled-course` | Get all the courses the current user is enrolled in. |

**Contributing**

The project welcomes contributions! Feel free to submit pull requests or open issues on GitHub to enhance the e-learning API with new features, bug fixes, or suggestions.

**License**

This project is licensed under the MIT License, offering you flexibility and open-source collaboration opportunities.

By following these guidelines and leveraging the provided API endpoints, you can effectively build an engaging and secure e-learning platform.

## References

- [Neon Serverless](https://neon.tech/) - free tier
- [Cloudinary](https://cloudinary.com/) - free tier plan
- [Resend](https://resend.com/) - free tier plan
