# EduVerse-Backend-WebApp

## Overview

This repository contains the backend code for the EduVerse web application. EduVerse is a platform that offers user registration, authentication, payment processing, course management, and contact functionality.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Rudraprasad-Mohapatra/EduVerse-Backend-WebApp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file and configure the necessary environment variables. Refer to the provided `.env.example` for guidance.

## Usage

### User Routes

- Register: `POST /register`
- Login: `POST /login`
- Logout: `GET /logout`
- Get Profile: `GET /me`
- Forgot Password: `POST /forgotpassword`
- Reset Password: `POST /reset/:resetToken`
- Change Password: `POST /change-password`
- Update User: `PUT /update`

### Payment Routes

- Razorpay API Key: `GET /razorpay-key`
- Subscribe: `POST /subscribe`
- Fetch Subscription by ID: `GET /subscriptions/:sub_id`
- Verify Subscription: `POST /verify`
- Unsubscribe: `POST /unsubscribe`
- All Payments (Admin): `GET /` (requires Admin role)

### Course Routes

- Get All Courses: `GET /`
- Create Course: `POST /` (requires Admin role)
- Get Lectures by Course ID: `GET /:id`
- Update Course: `PUT /:id` (requires Admin role)
- Remove Course: `DELETE /:id` (requires Admin role)
- Add Lecture to Course: `POST /:id` (requires Admin role)
- Delete Lecture from Course: `DELETE /:id/lectures/:lectureIndex` (requires Admin role)

### Contact Route

- Contact: `POST /`

## Technologies Used

- **Node.js**: JavaScript runtime for server-side development.
- **Express**: Web application framework for Node.js.
- **MongoDB (via Mongoose)**: NoSQL database for data storage.
- **Bcrypt.js**: Library for hashing and salting passwords.
- **Cloudinary**: Cloud-based image and video management.
- **Cookie-parser**: Middleware for handling HTTP cookies.
- **Cors**: Middleware for enabling Cross-Origin Resource Sharing.
- **Dotenv**: Module for loading environment variables.
- **Jsonwebtoken**: Implementation of JSON Web Tokens for user authentication.
- **Multer**: Middleware for handling file uploads.
- **Nodemailer**: Module for sending emails.
- **Razorpay**: Payment gateway for handling online transactions.
- **Morgan (devDependency)**: HTTP request logger middleware.
- **Nodemon (devDependency)**: Utility for automatic server restarts during development.

## Conclusion

Thank you for exploring EduVerse-Backend-WebApp! This project represents my exploration into building a robust backend for a web application, incorporating features such as user authentication, payment processing, and course management. As a backend project, it showcases my skills in using technologies like Node.js, Express, MongoDB, and various npm packages.

I welcome any feedback, suggestions, or contributions. Feel free to connect with me if you have questions or if you'd like to collaborate on enhancing this project.

Happy coding!
