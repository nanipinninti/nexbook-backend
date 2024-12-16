const { Pool } = require("pg");
require("dotenv").config(); // Load environment variables

// PostgreSQL connection setup
const pool = new Pool({
  user: "postgres", // Default username
  host: "localhost", // Default host
  database: "NexBook", // Your database name
  password: "Nani@123", // Your password
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
