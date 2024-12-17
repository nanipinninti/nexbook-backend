const { Pool } = require("pg");
require("dotenv").config(); // Load environment variables

// PostgreSQL connection setup
const pool = new Pool({
  user: "postgres", // Default username
  host: "localhost", // Default host
  database: "NexBook", // Your database name
  // password: "aparna2306", // Your password
  password : "Nani@123",
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
