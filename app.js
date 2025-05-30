const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");

dotenv.config();

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/authors", authorRoutes);

app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 REST API Server is running!",
    version: "1.0.0",
    endpoints: {
      books: {
        "GET /api/books": "Lista wszystkich książek z autorami",
        "POST /api/books": "Dodaj nową książkę (wymaga: title, year, author)", 
        "DELETE /api/books/:id": "Usuń książkę po ID"
      },
      authors: {
        "GET /api/authors": "Lista wszystkich autorów",
        "POST /api/authors": "Dodaj nowego autora (wymaga: firstName, lastName)",
        "PUT /api/authors/:id": "Edytuj autora (wymaga: firstName, lastName)"
      }
    },
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Coś poszło nie tak!" });
});

app.use("*", (req, res) => {
  res.status(404).json({ 
    message: `Endpoint ${req.method} ${req.originalUrl} nie został znaleziony`
  });
});

const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI nie jest zdefiniowane w pliku .env");
    }

    await mongoose.connect(MONGO_URI);
    console.log(" Połączono z MongoDB Atlas");

    app.listen(PORT, () => {
      console.log(`\n Serwer działa na porcie 3001!`);
    });

  } catch (error) {
    console.error("❌ Błąd podczas uruchamiania serwera:", error.message);
    process.exit(1);
  }
};

startServer();