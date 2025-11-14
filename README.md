# Customer Support Chat Application
https://customersupportchat.netlify.app/

A real-time customer support chat application built with React, Node.js, and Socket.io for the PLP Week 5 Assignment.

## Features

###  Core Features
- Real-time messaging with Socket.io
- Online/offline status indicators
- Typing indicators
- User authentication (username-based)
- Message timestamps and read receipts

###  Advanced Features
- File sharing (images, PDFs, documents)
- Unread message notifications
- Sound alerts for new messages
- Browser notifications
- Multiple user roles (Customer/Support Agent)
- Responsive design for mobile/desktop

###  Additional Features
- Message history persistence
- File type detection and preview
- User presence indicators
- Reconnection handling
- Message delivery status
- System messages for user join/leave

##  Tech Stack

- **Frontend:** React, Vite, Socket.io-client
- **Backend:** Node.js, Express, Socket.io
- **File Upload:** Multer
- **Styling:** Custom CSS with orange theme

##  Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)

### Running Locally

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd customer-support-chat
   ```

2. **Start the Server**
   ```bash
   cd server
   npm install
   npm run dev
   ```
   Server runs on http://localhost:5000

3. **Start the Client**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Client runs on http://localhost:3000

4. **Open your browser** and navigate to http://localhost:3000

## 🎮 How to Use

1. **Join the chat** by entering your username, email, and selecting your role (Customer or Support Agent)
2. **Send messages** in real-time with other users
3. **Upload files** by clicking the paperclip icon (supports images, PDFs, documents)
4. **See typing indicators** when other users are composing messages
5. **View online users** in the sidebar
6. **Receive notifications** for new messages with sound and browser alerts

## 📱 Features Demo

### Real-time Messaging
- Instant message delivery between all connected users
- Message read receipts and delivery status
- Timestamp on all messages

### File Sharing
- Drag and drop or click to upload files
- Image preview for uploaded images
- Document download links for PDFs and other files
- 5MB file size limit

### User Management
- Real-time online/offline status
- User role differentiation (Customers vs Support Agents)
- Join/leave notifications

## Deployment

### Option 1: Local Deployment
Follow the installation steps above to run locally.

### Option 2: Cloud Deployment (Recommended)
- **Backend:** Deploy to Railway, Render, or Heroku
- **Frontend:** Deploy to Vercel, Netlify, or GitHub Pages

## Project Structure

```
customer-support-chat/
├── server/
│   ├── index.js          # Socket.io server
│   ├── package.json      # Server dependencies
│   └── uploads/          # File upload directory
├── client/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   └── App.jsx       # Main App component
│   └── package.json      # Client dependencies
└── README.md
```


##  Environment Variables

For production deployment, set these environment variables:

**Server:**
- `PORT` - Server port (default: 5000)
- `CLIENT_URL` - Frontend URL for CORS

**Client:**
- `VITE_SERVER_URL` - Backend server URL


*Built for PLP Week 5 Assignment - Real-Time Communication with Socket.io*


