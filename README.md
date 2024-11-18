# Message Board Application

A full-stack web application that allows users to connected with friends by sharing messages and images. Engage with previous messages with replies, thumbs up, and thumbs down! Includes user authentication.

![Screenshot 2024-11-18 at 11 39 30 AM](https://github.com/user-attachments/assets/7df341a8-f86b-4aab-9423-07c84a5f18d4)


## Features

- 👤  User Authentication (Sign up, Login, Logout)
- 📝 Create and delete messages
- 💬 Reply to Messages
- 👍 Like/Dislike messages and replies
- 🗑️ Delete your own messages and replies
- Secure profile access
- MongoDB integration for data persistence

## Technologies Used

- **Frontend**: EJS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Passport.js

- **Other Tools**: 
  - connect-flash (for flash messages)
  - express-session (session management)
  - mongoose (MongoDB object modeling)
  - multer(for image upload)


## Installation

1. Clone the repository
2. Install dependencies
3. Create a `config/database.js` file with your MongoDB connection string
4. Start the server

The application will be running on `http://localhost:1111`

## Usage

1. Register a new account or login with existing account
2. Create messages by typing in the message box and clicking "Share Post"
3. Add Image(optional)
4. Interact with messages:
   - 👍 Like messages
   - 👎 Dislike messages
   - 💬 Reply to messages
   - 🗑️ Delete messages

## API Routes

### Authentication Routes
- `GET /login` - Display login form
- `POST /login` - Process login
- `GET /signup` - Display signup form
- `POST /signup` - Process signup
- `GET /logout` - Logout user

### Message Routes
- `POST /messages` - Create new message
- `PUT /messages` - Update message (likes/dislikes)
- `DELETE /messages` - Delete message

### Replies
- `POST /reply` - Create a new reply
- `PUT /replyVote` - Update replies (likes/dislikes)
- `DELETE /deleteReply` - Delete a reply

