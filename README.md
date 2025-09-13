# YouTube Backend API

A full-featured YouTube clone backend API built with Node.js, Express.js, and MongoDB. This project provides all the essential backend functionality for a video sharing platform similar to YouTube.

## 🚀 Features

- **User Authentication & Authorization**
  - User registration with avatar upload
  - JWT-based authentication (Access & Refresh tokens)
  - Password hashing with bcrypt
  - User profile management

- **Video Management**
  - Video upload and storage
  - Thumbnail generation
  - Video metadata management
  - View count tracking
  - Video duration tracking

- **File Upload & Storage**
  - Multer middleware for file handling
  - Cloudinary integration for cloud storage
  - Support for multiple file types
  - Automatic file cleanup

- **Database & Models**
  - MongoDB with Mongoose ODM
  - User and Video schemas
  - Watch history tracking
  - Pagination support

- **Error Handling & Response Management**
  - Custom API error classes
  - Standardized API responses
  - Async error handling middleware

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Password Hashing**: bcryptjs
- **Environment**: dotenv

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for file storage)
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd youtube_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # Database
   MONGODB_URL=your_mongodb_connection_string
   
   # JWT Secrets
   JWT_ACCESS_SECRET=your_access_token_secret
   JWT_REFRESH_SECRET=your_refresh_token_secret
   
   # JWT Expiry
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_EXPIRY=10d
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Server
   PORT=3000
   ```

4. **Create required directories**
   ```bash
   mkdir -p public/temp
   ```

## 🚀 Running the Application

1. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npx nodemon server.js
   ```

2. **Server will start on** `http://localhost:3000`

## 📚 API Endpoints

### User Routes (`/user`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/register` | Register a new user | `{ userName, email, fullName, password, avatar }` |

### Request/Response Examples

#### User Registration
```bash
POST /user/register
Content-Type: multipart/form-data

{
  "userName": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "password": "password123",
  "avatar": <file>
}
```

**Success Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "userName": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "https://cloudinary_url/avatar.jpg"
  },
  "message": "User registered successfully..",
  "success": true
}
```

## 🗂️ Project Structure

```
youtube_backend/
├── src/
│   ├── config/
│   │   └── cloudinary.js          # Cloudinary configuration
│   ├── controllers/
│   │   └── user.controller.js     # User-related controllers
│   ├── db/
│   │   └── db.js                  # Database connection
│   ├── middlewares/
│   │   └── multer.middleware.js   # File upload middleware
│   ├── models/
│   │   ├── user.model.js          # User schema
│   │   └── video.model.js         # Video schema
│   ├── routes/
│   │   └── user.route.js          # User routes
│   └── utils/
│       ├── apiError.js            # Custom error class
│       ├── apiResponse.js         # Standardized response
│       └── asyncHandler.js        # Async error handler
├── public/
│   └── temp/                      # Temporary file storage
├── server.js                      # Main server file
├── package.json
└── README.md
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation and sanitization
- CORS enabled for cross-origin requests
- Secure file upload handling

## 🚧 Development Status

This is a work-in-progress YouTube clone backend. Current implementation includes:

- ✅ User registration with avatar upload
- ✅ Database models and schemas
- ✅ File upload and cloud storage
- ✅ Error handling and response management
- 🔄 Video upload functionality (in development)
- 🔄 Authentication middleware (in development)
- 🔄 Video streaming endpoints (planned)
- 🔄 Comment system (planned)
- 🔄 Like/Dislike functionality (planned)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Note**: This is a learning project and should not be used in production without proper security audits and additional features.
