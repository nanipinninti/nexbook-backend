const express = require("express");
const pool = require('../../db')
const app = express.Router()

// API to insert multiple hotel details
app.post("/add-hotels", async (req, res) => {
  const hotelList = req.body;

  if (!Array.isArray(hotelList) || hotelList.length === 0) {
    return res.status(400).json({ error: "Request body should be a non-empty array of hotel objects." });
  }

  try {
    // Start a transaction
    await pool.query("BEGIN");

    // Loop through the list of hotels and insert them into the database
    for (const hotel of hotelList) {
      const { name, price, city, address, description, image_url, capacity } = hotel;

      // Insert query
      await pool.query(
        `INSERT INTO HotelDetails (name, price, city, address, description, image_url, capacity) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [name, price, city, address, description, image_url, capacity]
      );
    }

    // Commit the transaction
    await pool.query("COMMIT");
    res.status(201).json({ message: "Hotels added successfully!" });
  } catch (error) {
    // Rollback in case of error
    await pool.query("ROLLBACK");
    console.error(error.message);
    res.status(500).json({ error: "An error occurred while adding hotels." });
  }
});




// API to add IDs to the Birthday table
app.post('/addToBirthday', async (req, res) => {
  const { hotel_ids } = req.body; // Array of hotel_ids to be added to Birthday table
  if (!Array.isArray(hotel_ids)) {
    return res.status(400).json({ error: 'hotel_ids must be an array' });
  }

  try {
    const query = `
      INSERT INTO birthday (hotel_id)
      SELECT unnest($1::int[])`;
    const result = await pool.query(query, [hotel_ids]);
    res.status(200).json({ message: 'Successfully added to Birthday table', rowsAffected: result.rowCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add to Birthday table' });
  }
});

// API to add IDs to the PrivateTheater table
app.post('/addToPrivateTheater', async (req, res) => {
  const { hotel_ids } = req.body; // Array of hotel_ids to be added to PrivateTheater table
  if (!Array.isArray(hotel_ids)) {
    return res.status(400).json({ error: 'hotel_ids must be an array' });
  }

  try {
    const query = `
      INSERT INTO PrivateTheater (hotel_id)
      SELECT unnest($1::int[])`;
    const result = await pool.query(query, [hotel_ids]);
    res.status(200).json({ message: 'Successfully added to PrivateTheater table', rowsAffected: result.rowCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add to PrivateTheater table' });
  }
});

// API to add IDs to the CorporateParty table
app.post('/addToCorporateParty', async (req, res) => {
  const { hotel_ids } = req.body; // Array of hotel_ids to be added to CorporateParty table
  if (!Array.isArray(hotel_ids)) {
    return res.status(400).json({ error: 'hotel_ids must be an array' });
  }

  try {
    const query = `
      INSERT INTO CorporateParty (hotel_id)
      SELECT unnest($1::int[])`;
    const result = await pool.query(query, [hotel_ids]);
    res.status(200).json({ message: 'Successfully added to CorporateParty table', rowsAffected: result.rowCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add to CorporateParty table' });
  }
});


app.get("/birthday-hotels", async (req, res) => {
    try {
        const query = `
            SELECT 
                b.bday_hall_id,
                h.id AS hotel_id,
                h.name,
                h.price,
                h.city,
                h.address,
                h.description,
                h.image_url,
                h.capacity
            FROM 
                birthday b
            JOIN 
                HotelDetails h ON b.hotel_id = h.id;
        `;

        const result = await pool.query(query);

        res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error("Error fetching birthday hotels:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch birthday hotels.",
        });
    }
});

// API to fetch hotel details from the CorporateParty table
app.get("/corporate-hotels", async (req, res) => {
    try {
        const query = `
            SELECT 
                c.corporate_party_id,
                h.id AS hotel_id,
                h.name,
                h.price,
                h.city,
                h.address,
                h.description,
                h.image_url,
                h.capacity
            FROM 
                CorporateParty c
            JOIN 
                HotelDetails h ON c.hotel_id = h.id;
        `;

        const result = await pool.query(query);

        res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error("Error fetching corporate party hotels:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch corporate party hotels.",
        });
    }
});

// API to fetch hotel details from the PrivateTheater table
app.get("/private-theater-hotels", async (req, res) => {
    try {
        const query = `
            SELECT 
                p.private_theater_id,
                h.id AS hotel_id,
                h.name,
                h.price,
                h.city,
                h.address,
                h.description,
                h.image_url,
                h.capacity
            FROM 
                PrivateTheater p
            JOIN 
                HotelDetails h ON p.hotel_id = h.id;
        `;

        const result = await pool.query(query);

        res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error("Error fetching private theater hotels:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch private theater hotels.",
        });
    }
});

module.exports = app;