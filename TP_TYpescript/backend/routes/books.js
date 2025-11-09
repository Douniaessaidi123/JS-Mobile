// routes/books.js
import express from "express";
import Book from "../models/Book.js";

const router = express.Router();

// ➕ Ajouter un livre
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    console.error('Erreur création livre:', err);
 // 🔹 affiche l’erreur
    res.status(400).json({ message: err.message });
  }
});

// 📚 Récupérer tous les livres
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
