# 📝 Blog REST API

> 🚀 My first backend project — a fully functional Blog API built from scratch as the beginning of my backend development journey.

A production-ready RESTful API for a complete blog application featuring authentication, authorization, CRUD operations, pagination, search, likes, comments, and more — built with modern backend technologies.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web framework for building REST APIs |
| **MongoDB** | NoSQL database for storing data |
| **Mongoose** | ODM for MongoDB schema modeling |
| **JWT** | Access & refresh token authentication |
| **bcryptjs** | Password hashing |
| **express-validator** | Input validation & sanitization |
| **express-rate-limit** | API rate limiting |
| **cookie-parser** | HTTP-only cookie handling |
| **morgan** | HTTP request logger |
| **cors** | Cross-Origin Resource Sharing |
| **dotenv** | Environment variable management |

---

## ✨ Features

- 🔐 **JWT Authentication** — Access token + Refresh token strategy
- 🔒 **Role-Based Authorization** — Public, User, and Admin roles
- 👤 **User Management** — Register, login, profile, admin controls
- 📝 **Blog Posts** — Full CRUD with slug auto-generation and soft delete
- 🗂️ **Categories** — Admin-managed with auto-generated slugs
- 💬 **Comments** — Add, edit, delete comments on posts
- ❤️ **Likes** — Toggle like/unlike on posts
- 🔍 **Search & Filter** — Search posts by keyword, filter by category/status
- 📄 **Pagination** — All list endpoints support page & limit
- ✅ **Input Validation** — Every request body validated before hitting the DB
- 🛡️ **Rate Limiting** — 100 requests per 15 minutes per IP
- 🍪 **HTTP-only Cookies** — Refresh token stored securely
- 🗑️ **Soft Delete** — Posts marked deleted, not removed from DB
- 🔁 **Refresh Token Rotation** — Auto-issue new tokens on refresh
- 💥 **Global Error Handling** — Centralized error middleware for clean responses

---

## 📁 Folder Structure

```
blog-api/
│
├── src/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   │
│   ├── controllers/
│   │   ├── authController.js        # register, login, logout, refresh, changePassword
│   │   ├── userController.js        # getMyProfile, updateProfile, admin actions
│   │   ├── postController.js        # CRUD, search, pagination, likes
│   │   ├── categoryController.js    # CRUD categories
│   │   └── commentController.js     # add, get, update, delete comments
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js        # protect (JWT guard) + authorize (role guard)
│   │   ├── errorMiddleware.js       # 404 handler + global error handler
│   │   └── validationMiddleware.js  # express-validator rules
│   │
│   ├── models/
│   │   ├── User.js                  # User schema with bcrypt pre-save hook
│   │   ├── Post.js                  # Post schema with slug, soft delete, likes
│   │   ├── Category.js              # Category schema with auto slug
│   │   └── Comment.js               # Comment schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js            # /api/v1/auth
│   │   ├── userRoutes.js            # /api/v1/users
│   │   ├── postRoutes.js            # /api/v1/posts
│   │   ├── categoryRoutes.js        # /api/v1/categories
│   │   └── commentRoutes.js         # /api/v1/comments
│   │
│   ├── utils/
│   │   ├── tokenUtils.js            # JWT generate, verify, cookie setter
│   │   └── apiUtils.js              # successResponse, errorResponse, getPagination
│   │
│   └── server.js                    # App entry point
│
├── .env.example                     # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Postman (for testing)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/blog-api.git
cd blog-api
```

**2. Install dependencies**
```bash
npm install
```

**3. Setup environment variables**
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/blog-api
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

**4. Run the server**
```bash
# Development
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## 🔐 Authentication Flow

This API uses a **dual-token strategy**:

```
Register / Login
      ↓
Access Token (15 min)  →  Sent in Authorization header for every request
Refresh Token (7 days) →  Stored in HTTP-only cookie
      ↓
Access token expires?
      ↓
POST /auth/refresh-token  →  Issues new access token automatically
```

**How to send the access token:**
```
Authorization: Bearer <your_access_token>
```

---

## 🔒 Role-Based Access

| Role | Permissions |
|---|---|
| **Public** | Read posts, categories, comments |
| **User** | All public + create posts, comment, like/unlike |
| **Admin** | All user permissions + manage users, categories, delete any content |

---

## 📡 API Reference

**Base URL:** `http://localhost:5000/api/v1`

---

### 🔐 Auth — `/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create a new account |
| POST | `/auth/login` | Public | Login and receive tokens |
| POST | `/auth/logout` | User | Logout and clear tokens |
| POST | `/auth/refresh-token` | Public | Get new access token via cookie |
| PUT | `/auth/change-password` | User | Update your password |

---

### 👤 Users — `/users`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users/me` | User | Get my profile |
| PUT | `/users/me` | User | Update my profile |
| DELETE | `/users/me` | User | Delete my account |
| GET | `/users` | Admin | Get all users |
| DELETE | `/users/:id` | Admin | Delete any user |
| PUT | `/users/:id/role` | Admin | Change user role |

---

### 📝 Posts — `/posts`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/posts` | Public | Get all posts (paginated) |
| GET | `/posts/:id` | Public | Get single post |
| GET | `/posts/author/:authorId` | Public | Get posts by author |
| POST | `/posts` | User | Create a post |
| PUT | `/posts/:id` | Author/Admin | Update a post |
| DELETE | `/posts/:id` | Author/Admin | Soft delete a post |
| POST | `/posts/:id/like` | User | Toggle like/unlike |

**Query Parameters:**
```
GET /posts?page=1&limit=10&status=published&search=javascript&category=<id>
```

---

### 🗂️ Categories — `/categories`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/categories` | Public | Get all categories |
| GET | `/categories/:id` | Public | Get single category |
| POST | `/categories` | Admin | Create a category |
| PUT | `/categories/:id` | Admin | Update a category |
| DELETE | `/categories/:id` | Admin | Delete a category |

---

### 💬 Comments — `/comments`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/comments/:postId` | Public | Get comments for a post |
| POST | `/comments/:postId` | User | Add a comment |
| PUT | `/comments/:commentId` | Author | Update your comment |
| DELETE | `/comments/:commentId` | Author/Admin | Delete a comment |

---

## 🧠 Key Concepts Implemented

| Concept | Where |
|---|---|
| Password hashing with bcrypt | `models/User.js` — pre-save hook |
| JWT access + refresh tokens | `utils/tokenUtils.js` |
| HTTP-only cookie security | `utils/tokenUtils.js` |
| Route protection middleware | `middleware/authMiddleware.js` |
| Role-based authorization | `middleware/authMiddleware.js` |
| Input validation pipeline | `middleware/validationMiddleware.js` |
| Global error handling | `middleware/errorMiddleware.js` |
| Mongoose relationships & populate | `models/Post.js` |
| Virtual fields | `models/Post.js` — likeCount |
| Auto slug generation | `models/Post.js`, `models/Category.js` |
| Soft delete pattern | `models/Post.js` — isDeleted flag |
| Pagination helper | `utils/apiUtils.js` |
| Rate limiting | `server.js` |
| Refresh token rotation | `controllers/authController.js` |

---

## 📬 Sample Request & Response

**POST** `/api/v1/auth/login`

Request:
```json
{
  "email": "huzaifa@gmail.com",
  "password": "123456"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "64abc123...",
      "name": "Huzaifa",
      "email": "huzaifa@gmail.com",
      "role": "user"
    }
  }
}
```

---

## 🗺️ Request Lifecycle

```
Incoming Request
      ↓
server.js       →   Rate Limiter, CORS, Body Parser
      ↓
routes/         →   Match URL to handler
      ↓
authMiddleware  →   Is user logged in? Does user have the right role?
      ↓
validationMiddleware  →  Is the request body valid?
      ↓
controllers/    →   Business logic runs here
      ↓
models/         →   Query sent to MongoDB
      ↓
Response sent back to client
      ↓
(Any error) → errorMiddleware handles it globally
```

---

## 👨‍💻 About This Project

This is my **first ever backend project** — built to learn and solidify the fundamentals of backend development. I built this while studying Node.js, Express, and MongoDB from scratch.

Through this project I learned how real-world APIs are structured, how authentication systems work under the hood, how to protect routes, validate data, handle errors globally, and design clean folder architecture.

This is just the beginning of my backend journey. 🚀

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Made with 💙 by <a href="https://github.com/yourusername">Huzaifa</a></p>
