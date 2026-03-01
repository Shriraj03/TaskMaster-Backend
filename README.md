# 🚀 TaskMaster Backend

TaskMaster is a collaborative task tracking and management backend system built using **Node.js, Express.js, and MongoDB**.  

It supports team-based task management with role-based access control, file attachments, comments, pagination, search, and real-time notifications.

---

## 📌 Features

### 🔐 Authentication
- JWT-based authentication
- Secure password hashing (bcrypt)
- Protected routes
- Role-based access control

### 📝 Task Management
- Create, update, delete tasks
- Assign tasks to team members
- Filter by status
- Search using MongoDB text index
- Pagination support

### 👥 Team Collaboration
- Create teams
- Add/remove members
- Team-level roles (admin/member)
- Assignment validation

### 💬 Comments
- Add comments to tasks
- Fetch task comments
- User population for better response structure

### 📎 Attachments
- Upload files using Multer
- Store file metadata in MongoDB
- Secure task-based file upload

### ⚡ Real-Time Notifications
- Socket.io integration
- Notify users when:
  - Task is assigned
  - Comment is added

### 🛡 Production-Ready Features
- MongoDB indexing
- Rate limiting
- Logging (Morgan)
- Centralized error handling
- Clean project structure

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT
- bcrypt
- Multer
- Socket.io
- express-rate-limit
- Morgan

---


## 📂 Project Structure
