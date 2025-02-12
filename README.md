# Chatting Web App

## 🚀 Overview
This is a real-time chatting web application built using **React.js**, **Node.js**, **Express.js**, **MongoDB**, and **Socket.io**. The app allows users to create accounts, send messages in real-time, and store chat history.

## 🛠️ Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Real-time Communication:** Socket.io
- **Authentication:** JWT (JSON Web Token)

## 📌 Features
- **User Authentication** (Sign Up / Login)
- **Real-time Messaging** with Socket.io
- **One-on-One & Group Chats**
- **Message History Stored in MongoDB**
- **Online User Status**
- **Typing Indicators**
- **Profile Management**
- **Responsive UI**

## 🏗️ Project Setup

### 🔹 Backend Setup (Node.js + Express.js + MongoDB)
1. Clone the repository:
   ```sh
   git clone https://github.com/Hari-Narayan-Gupta/chatting-web-app.git
   cd chatting-web-app/server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a **.env** file and configure the environment variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/chatting
   JWT_SECRET=your_secret_key
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### 🔹 Frontend Setup (React.js)
1. Navigate to the frontend directory:
   ```sh
   cd ../client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend server:
   ```sh
   npm start
   ```

## 🚀 Running the Application
Once both backend and frontend servers are running, open your browser and go to:
```
http://localhost:3000
```

## 📂 Project Structure
```
chatting-web-app/
│-- server/ (Backend - Node.js, Express.js, MongoDB)
│   │-- models/
│   │-- routes/
│   │-- controllers/
│   │-- server.js
│
│-- client/ (Frontend - React.js)
│   │-- src/
│   │-- components/
│   │-- pages/
│   │-- App.js
│
│-- README.md
```

## 🔌 WebSocket Implementation (Socket.io)
- When a user connects, they are added to the active users list.
- Messages are sent and received in real-time.
- User typing indicators are implemented using Socket.io events.

## 🚀 Future Enhancements
- **Voice & Video Calls Integration**
- **Push Notifications**
- **Chatbot Integration**
- **Message Reactions & Read Receipts**

## 📝 License
This project is **MIT Licensed**.

---

🎉 Happy Coding! If you like this project, consider giving it a ⭐ on [GitHub](https://github.com/Hari-Narayan-Gupta/chatting-web-app).

