# Message Board Application

A full-stack web application that allows users to post messages, interact with them through likes/dislikes, and includes user authentication.

## Features

- User Authentication (Sign up, Login, Logout)
- Create and delete messages
- Like/Dislike/Sort functionality for messages
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

## Installation

1. Clone the repository
2. Install dependencies
3. Create a `config/database.js` file with your MongoDB connection string
4. Start the server

The application will be running on `http://localhost:8080`

## Usage

1. Create an account or login
2. Post messages on your profile page
3. Interact with messages:
   - 👍 Like messages
   - 👎 Dislike messages
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

