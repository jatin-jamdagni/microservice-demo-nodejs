const express = require("express");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.use(express.json());

const SECRET_KEY = "meri_secret_key";
const db = new sqlite3.Database(":memory:");

// Create Authors table
db.serialize(() => {
  db.run(
    "CREATE TABLE authors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)"
  );
});

// Middleware to check if the request is authenticated
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Get all authors (requires authentication)
app.get("/authors", authenticateToken, (req, res) => {
  db.all("SELECT * FROM authors", [], (err, rows) => {
    if (err) {
      return res.status(500).send("Error fetching authors");
    }
    res.json(rows);
  });
});

// Add an author (requires authentication)
app.post("/authors", authenticateToken, (req, res) => {
  const { name } = req.body;
  db.run("INSERT INTO authors (name) VALUES (?)", [name], function (err) {
    if (err) {
      return res.status(500).send("Error adding author");
    }
    res.status(201).json({ id: this.lastID, name });
  });
});

app.listen(3003, () => {
  console.log("Author service running on port 3003");
});
