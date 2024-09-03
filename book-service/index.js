const express = require("express");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.use(express.json());

const SECRET_KEY = "meri_secret_key";
const db = new sqlite3.Database(":memory:");

// Create Books table
db.serialize(() => {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, authorId INTEGER)"
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

// Get all books (requires authentication)
app.get("/books", authenticateToken, (req, res) => {
  db.all("SELECT * FROM books", [], (err, rows) => {
    if (err) {
      return res.status(500).send("Error fetching books");
    }
    res.json(rows);
  });
});

// Add a book (requires authentication)
app.post("/books", authenticateToken, (req, res) => {
  const { title, authorId } = req.body;
  db.run(
    "INSERT INTO books (title, authorId) VALUES (?, ?)",
    [title, authorId],
    function (err) {
      if (err) {
        return res.status(500).send("Error adding book");
      }
      res.status(201).json({ id: this.lastID, title, authorId });
    }
  );
});

app.listen(3002, () => {
  console.log("Book service running on port 3002");
});
