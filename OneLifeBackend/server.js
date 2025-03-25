const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// MongoDB connection
const mongoURI = "mongodb://127.0.0.1:27017/doctor_advice";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Schema and Model
const adviceSchema = new mongoose.Schema({
  patient_name: { type: String, required: true },
  disease: { type: String, required: true },
  message: { type: String, required: true },
  doctor_name: { type: String, default: null },  // Added field
  doctor_reply: { type: String, default: null }, // Added field
});

const Advice = mongoose.model("Advice", adviceSchema);

// Get all questions
app.get("/get-questions", async (req, res) => {
  try {
    const questions = await Advice.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Submit new advice
app.post("/submit-advice", async (req, res) => {
  console.log("Received Data:", req.body);
  const { patient_name, disease, message } = req.body;

  if (!patient_name || !disease || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const advice = new Advice({ patient_name, disease, message });
    await advice.save();
    res.status(201).json({ message: "Advice submitted successfully" });
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a doctor's reply
app.post("/add-reply", async (req, res) => {
  const { id, doctor_name, doctor_reply } = req.body;

  if (!id || !doctor_name || !doctor_reply) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const updatedAdvice = await Advice.findByIdAndUpdate(
      id,
      { doctor_name, doctor_reply },
      { new: true, runValidators: true }
    );

    if (!updatedAdvice) {
      return res.status(404).json({ error: "Advice not found" });
    }

    res.status(200).json({ message: "Reply added successfully", updatedAdvice });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
