const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/quizApp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema for scores
const scoreSchema = new mongoose.Schema({
    difficulty: String,
    score: Number,
});

const Score = mongoose.model('Score', scoreSchema);

// Middleware
app.use(bodyParser.json());

// Endpoint to save scores
app.post('/saveScore', async (req, res) => {
    const { difficulty, score } = req.body;

    try {
        // Save score to the database
        const newScore = new Score({ difficulty, score });
        await newScore.save();
        res.status(201).json({ message: 'Score saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
