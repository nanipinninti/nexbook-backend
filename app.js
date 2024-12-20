const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const pool = require("./db"); // PostgreSQL connection
const cors = require('cors');


const app = express();
app.use(cors({
  origin: '*'  
}));
app.use(bodyParser.json());

const users = require('./routes/Login/index')
app.use('/users',users)

const functionHalls = require('./routes/Functionhalls/index')
app.use('/function-halls',functionHalls)

// Start Server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});