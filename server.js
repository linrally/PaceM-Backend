// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection URI
// const uri = 'mongodb+srv://ekalaja:admin@pulsecluster0.zzm0e.mongodb.net/?retryWrites=true&w=majority&appName=pulsecluster0';
const uri = 'mongodb://127.0.0.1:27017/pulsedb';
const client = new MongoClient(uri);

// Middleware
app.use(cors());
app.use(bodyParser.json());

(async function connectDB() {
  try {
    await client.connect();
    const database = client.db('pulsedb');
    const userTable = database.collection('Users');

    console.log('MongoDB connected successfully');

    // Route to handle user data submission (Gender & Height)
    app.post('/', async (req, res) => {
      const { gender, height } = req.body;
      
      // Validate data
      if (!gender || !height) {
        return res.status(400).json({ error: 'Please provide both gender and height' });
      }

      try {
        const newUser = { gender, height };
        const result = await userTable.insertOne(newUser);
        res.status(201).json({ message: 'Data saved successfully!', data: result });
      } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data to MongoDB' });
      }
    });

  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
})();

// Root route
app.get('/', (req, res) => {
  res.send('API is working');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
