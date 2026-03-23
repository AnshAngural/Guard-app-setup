# 🛡️ Guard Setup App

A full-stack security guard management web application with role-based access control. Built with Node.js, Express, MongoDB, and EJS — featuring separate Admin and User dashboards, session-based authentication, and complete CRUD operations.

🔗 **Live Demo:** [guard-app-setup.onrender.com](https://guard-app-setup.onrender.com)

---

## 📸 Screenshots

> <img width="1920" height="1022" alt="Screenshot (4)" src="https://github.com/user-attachments/assets/bbee9dc4-9caa-4edb-8116-3f906a937fd2" />
<img width="1920" height="1032" alt="Screenshot (5)" src="https://github.com/user-attachments/assets/cd7aa81b-19a0-4c6f-9f11-a8339e482120" />
<img width="1920" height="1029" alt="Screenshot (6)" src="https://github.com/user-attachments/assets/16a05e1a-ce7f-4743-98e9-25a19796252c" />

---

## ✨ Features

- 🔐 **Session-based Authentication** — Secure login and logout for all users
- 👑 **Admin Dashboard** — Full control to manage guards, users, and assignments
- 👤 **User Panel** — Role-restricted access for regular users
- 🛡️ **Role-based Authorization** — Admin and User roles with separate permissions
- 📋 **Guard Management** — Full CRUD operations for guard records
- 📱 **Responsive Design** — Clean, mobile-friendly UI with Bootstrap
- ✅ **Protected Routes** — Unauthorized users are redirected automatically
- 🚀 **Deployed** — Live on Render

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Frontend | EJS, HTML5, CSS3, Bootstrap |
| Database | MongoDB, Mongoose |
| Authentication | Express-Session |
| Authorization | Role-based Middleware |
| Deployment | Render |

---

## 👥 User Roles

### Admin
- View, add, edit and delete all guard records
- Manage all users in the system
- Access to full admin dashboard
- Assign guards to locations

### User
- View assigned guard information
- Access restricted to their own data
- Cannot access admin panel

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Clone the repository
git clone https://github.com/AnshAngural/guard-app-setup.git

# Navigate into the project
cd guard-app-setup

# Install dependencies
npm install

# Create a .env file in the root directory
touch .env
```

### Environment Variables

Add the following to your `.env` file:

```env
MONGO_URL=your_mongodb_connection_string
SECRET=your_session_secret
```

### Run the App

```bash
node app.js
```

Visit `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
guard-app-setup/
├── models/
│   ├── guard.js
│   └── user.js
├── routes/
│   ├── admin.js
│   ├── guard.js
│   └── user.js
├── views/
│   ├── admin/
│   ├── guards/
│   └── users/
├── middleware/
│   └── auth.js
├── public/
│   └── css/
├── app.js
└── package.json
```

---

## 🔑 Key Concepts Demonstrated

- **Role-based Authorization** — Different access levels for Admin and User
- **Session-based Auth** — Secure login system using express-session
- **Protected Routes** — Middleware that checks roles before granting access
- **MVC Architecture** — Clean separation of Models, Views, and Controllers
- **RESTful Routes** — Proper use of GET, POST, PUT, DELETE routes
- **MongoDB CRUD** — Full create, read, update, delete with Mongoose

---

## 🔒 Security Highlights

- Passwords are hashed before storing in the database
- Session secrets stored in environment variables
- Unauthorized route access redirects to login
- Admin routes protected by role-check middleware

---

## 👨‍💻 Author

**Ansh Angural**
- GitHub: [@AnshAngural](https://github.com/AnshAngural)
- LinkedIn: [Ansh Angural](https://www.linkedin.com/in/ansh-angural-4959b42b2)
- Portfolio: [AnshAngural.github.io](https://AnshAngural.github.io)

---

⭐ If you found this project useful, please give it a star!
