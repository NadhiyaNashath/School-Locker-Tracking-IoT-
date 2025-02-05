const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/lockerLogs", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Check if MongoDB is connected
const db = mongoose.connection;

db.on("connected", () => {
    console.log("MongoDB connected successfully!");
});

db.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

db.on("disconnected", () => {
    console.log("MongoDB disconnected.");
});


const LogSchema = new mongoose.Schema({
    action: String,
    timestamp: String
});

const Log = mongoose.model("Log", LogSchema);

app.post("/api/logs", async (req, res) => {
    const { action, timestamp } = req.body;
    const newLog = new Log({ action, timestamp });
    await newLog.save();
    res.json({ message: "Log saved!" });
});

app.get("/api/logs", async (req, res) => {
    const logs = await Log.find();
    res.json(logs);
});

app.listen(5000, () => console.log("Server running on port 5000"));
