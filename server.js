const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// API to get all live classes
app.get("/classes", async (req, res) => {
  try {
    const snapshot = await db.collection("classes").get();
    let classes = [];
    snapshot.forEach(doc => classes.push({ id: doc.id, ...doc.data() }));
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to add a live class
app.post("/classes", async (req, res) => {
  try {
    const { title, date, link } = req.body;
    await db.collection("classes").add({ title, date, link });
    res.json({ message: "Class added!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));