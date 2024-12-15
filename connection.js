const { Client } = require('pg');

const NexBook = new Client({
    user: "postgres",
    host: "localhost",
    database: "NexBook",
    password: "Nani@123",
    port: 5432,
});

NexBook.connect((err) => {
    if (err) {
        console.error("Connection error:", err.stack);
    } else {
        console.log("Connected to the database");
    }
});

// // Perform a query
// NexBook.query('SELECT * FROM "Login"', (err, res) => {
//     if (err) {
//         console.error('Query error', err.stack);
//     } else {
//         console.log(res.rows); // Display the rows returned by the query
//     }
//     NexBook.end();
// });

module.exports = NexBook;