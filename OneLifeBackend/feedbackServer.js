const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5003;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/feedbackDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
    userName: String,
    userFeedback: String,
    rating: Number,
    submittedAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Route to handle feedback submission
app.post('/api/feedback', async (req, res) => {
    try {
        const { userName,  userFeedback, rating } = req.body;
        if (!userName || !userFeedback || !rating) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newFeedback = new Feedback({ userName, userFeedback, rating });
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get all feedback
app.get('/api/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ submittedAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
