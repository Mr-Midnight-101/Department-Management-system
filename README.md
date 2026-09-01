# 🏢 Department Management System

A full-stack web application developed as an **MCA final-year project** for managing department-related academic data and degree submissions.

The application follows an **MVC architecture** on the backend and uses RESTful APIs to communicate between the React frontend and Node.js/Express backend.

> **Project Status:** Academic / Final-Year Project  
> **Current Deployment:** Not publicly deployed

---

## ✨ Features

- 🧾 Create, view, update, and delete department records
- 🔐 Teacher registration and login
- 🔑 JWT-based authentication
- 🍪 Cookie-based authentication
- 🔒 Password hashing using Bcrypt
- 🛡️ Protected routes using authentication middleware
- 📊 Data visualization using Nivo Charts
- 📁 File uploads using Multer
- 📅 Date handling using Day.js
- 🎨 Responsive user interface using Material UI
- 🌐 RESTful API communication
- 🔄 CORS configuration
- ⚙️ Environment variable configuration using dotenv
- 🧩 MVC-based backend structure
- 🔧 Development workflow using Nodemon

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Axios
- Material UI (MUI)
- Day.js
- Nivo Charts

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- JWT
- Bcrypt
- Cookie-parser
- CORS
- Dotenv
- Nodemon

---

## 🏗️ Architecture

The project follows a client-server architecture:

```text
React Frontend
      │
      │ HTTP / REST APIs
      ▼
Node.js + Express.js
      │
      ├── Routes
      ├── Controllers
      ├── Middleware
      └── Models
      │
      ▼
MongoDB
The backend follows the MVC (Model-View-Controller) pattern to separate data models, request handling, and application logic.

🔐 Authentication

The application implements authentication using:

Teacher registration and login
JWT-based authentication
HTTP cookies for token storage
Protected routes
Authentication middleware
Bcrypt password hashing

Authentication flow:

Teacher
   │
   ▼
Login / Register
   │
   ▼
Express API
   │
   ├── Validate credentials
   │
   ├── Verify / hash password
   │
   ▼
JWT Token
   │
   ▼
HTTP Cookie
   │
   ▼
Protected API Routes
📁 Project Structure
Department-Management-system/
│
├── client/
│   ├── src/
│   └── ...
│
├── server/
│   ├── config/
│   │   └── Database and environment configuration
│   │
│   ├── controllers/
│   │   └── Request and application logic
│   │
│   ├── models/
│   │   └── Mongoose schemas
│   │
│   ├── routes/
│   │   └── REST API routes
│   │
│   ├── middleware/
│   │   └── Authentication and error middleware
│   │
│   ├── uploads/
│   │   └── Uploaded files
│   │
│   ├── utils/
│   │   └── Utility functions
│   │
│   ├── .env
│   └── server.js
│
└── README.md
🚀 Getting Started
Prerequisites

Make sure you have the following installed:

Node.js
MongoDB
Git
1. Clone the repository
git clone https://github.com/PrahladBathre/Department-Management-system.git
cd Department-Management-system
2. Install backend dependencies
cd server
npm install
3. Configure environment variables

Create a .env file inside the server directory.

Example:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

Never commit your actual .env file or secret credentials to GitHub.

4. Start the backend
npm run dev
5. Install frontend dependencies

Open another terminal:

cd client
npm install
6. Start the frontend
npm start

The application should then be available locally through the development server.
