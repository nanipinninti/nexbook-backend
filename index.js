const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const pool = require("./db"); // PostgreSQL connection
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*'  // This allows all domains
}));
app.use(bodyParser.json());
const JWT_SECRET = "your_jwt_secret"; // Replace with a strong secret in production

// SIGNUP API
app.post("/signup", async (req, res) => {
  const { name, email, number, password } = req.body;    
  if (!name || !email || !number || !password) {
    return res.status(400).json({error: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const userExists = await pool.query("SELECT * FROM \"Users\" WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    await pool.query(
      "INSERT INTO \"Users\" (name, email, number, password) VALUES ($1, $2, $3, $4)",
      [name, email, number, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// LOGIN API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Check if the user exists
    const user = await pool.query("SELECT * FROM \"Users\" WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Validate the password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ email: user.rows[0].email }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start Server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
