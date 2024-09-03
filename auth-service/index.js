const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.use(express.json());

const SECRET_KEY = "meri_secret_key";
const db = new sqlite3.Database(":memory:");

// Create Users table
db.serialize(() => {
  db.run("CREATE TABLE users (username TEXT PRIMARY KEY, password TEXT)");
});

// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    function (err) {
      if (err) {
        return res.status(500).send("User registration failed");
      }
      res.status(201).send("User registered");
    }
  );
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err || !user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send("Invalid credentials");
      }
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
      res.json({ token });
    }
  );
});

app.listen(3001, () => {
  console.log("Auth service running on port 3001");
});
