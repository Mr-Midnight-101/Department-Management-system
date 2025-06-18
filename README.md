# 🏢 Department Management System

A full-stack web application for managing departments, built using the MERN stack (MongoDB, Express.js, React, Node.js). The system follows the MVC (Model-View-Controller) design pattern and communicates via RESTful APIs. It provides secure login, CRUD operations, data visualization, and a modern UI using Material UI.

---

## 🚀 Features

- 🧾 Manage department records with full CRUD
- 🔐 Teacher login with JWT-based authentication
- 🧠 MVC pattern structure with RESTful API
- 📊 Visual charts using Nivo Charts
- 📁 File uploads using Multer
- 🔒 Password hashing with Bcrypt
- 📅 Smart date handling via Day.js
- 🎨 Frontend styled with Material UI (MUI)
- 🌐 Cross-Origin Resource Sharing (CORS) handled
- 🍪 Cookie-based authentication using cookie-parser
- 🔧 Secure environment handling with dotenv
- 🔄 Auto-reloading server with Nodemon

---

## 🧰 Tech Stack

### Frontend:
- React.js
- Axios
- MUI (Material-UI)
- Day.js
- Nivo Chart

### Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- Multer
- JWT
- Bcrypt
- Cookie-parser
- CORS
- Dotenv
- Nodemon

---

## 📁 Folder Structure
/client # React frontend
/server
├── config # DB connection, environment setup
├── controllers # Route logic
├── models # Mongoose schemas
├── routes # Express routes
├── middleware # Auth & error middleware
├── uploads # Uploaded files (via Multer)
├── utils # Helper functions
├── .env
└── server.js

yaml
Copy code

---

## 🔐 Authentication Flow

- Register/Login with teacher credentials
- JWT tokens issued & stored in cookies
- Protected routes using middleware
- Passwords hashed using Bcrypt

---

## 📦 Installation & Running Locally

### Prerequisites:
- Node.js
- MongoDB
- Git

### Steps:

```bash
# Clone repo
git clone https://github.com/yourusername/department-management-system.git
cd department-management-system

# Setup backend
cd server
npm install
touch .env  # Add your Mongo URI, JWT_SECRET, etc.
npm run dev

# Setup frontend
cd ../client
npm install
npm start
🖼️ Screenshots
(Add screenshots of dashboard, department forms, charts, etc.)

🧪 Future Improvements
Add multi-role support (e.g., Admin, Department Head)

Add department-wise analytics dashboard

Deploy to cloud (Render, Vercel, etc.)

Write unit & integration tests

Add dark mode toggle

👨‍💻 Developer
Montu Bathre
Final Semester MCA Student
Tech Stack: MERN, Java, Python, SQL, Figma, GitHub
LinkedIn | GitHub

📄 License
This project is open-source and available under the MIT License.

yaml
Copy code

---

Would you like me to:
- Create a deploy-ready version (e.g., for GitHub)?
- Help generate preview images/screenshots?
- Write the `.env` template?
- Auto-generate badges (like build, license, etc.)?

Let me know what else you need.
