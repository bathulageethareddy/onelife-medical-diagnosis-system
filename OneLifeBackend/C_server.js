const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the app
const app = express();
const PORT = 5001; // Use a separate port for this service

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/onelife';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected for Contact Service'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Define a Schema and Model
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

// API Endpoint to Handle Form Submission
app.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate data
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Save data to the database
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        res.status(201).json({ message: 'Contact information saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save contact information' });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Contact Service is running on http://localhost:${PORT}`);
});
