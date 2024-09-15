const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/userData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Define a schema and model for the data
const UserDataSchema = new mongoose.Schema({
  gender: String,
  weight: Number,
});

const UserData = mongoose.model('UserData', UserDataSchema);

// Route to handle POST requests
app.post('/basic-info-backend', async (req, res) => {
  const { gender, weight } = req.body;
  
  // Simple validation
  if (!gender || !weight) {
    return res.status(400).json({ error: 'Please provide all fields' });
  }

  // Save to MongoDB
  try {
    const newUser = new UserData({ gender, weight });
    await newUser.save();
    res.status(201).json({ message: 'Data saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
