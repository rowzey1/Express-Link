// config/database.js
require("dotenv").config(); // Load environment variables

const dbConnectionStr = process.env.DB_STRING; // Get DB string from .env
const dbName = process.env.DB_NAME;           // Get DB name from .env

module.exports = { dbConnectionStr, dbName };
