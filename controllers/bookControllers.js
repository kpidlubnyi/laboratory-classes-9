const Book = require('../models/Book');
const Author = require('../models/Author');

const getBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate('author', 'firstName lastName')
      .sort({ title: 1 });
    
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ 
      message: 'Błąd podczas pobierania książek', 
      error: error.message 
    });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, year, author } = req.body;

    if (!title || !year || !author) {
      return res.status(400).json({ 
        message: 'title, year i author są wymagane' 
      });
    }

    const authorExists = await Author.findById(author);
    if (!authorExists) {
      return res.status(400).json({ 
        message: 'Podany autor nie istnieje' 
      });
    }

    const newBook = new Book({ title, year, author });
    const savedBook = await newBook.save();
    
    const bookWithAuthor = await Book.findById(savedBook._id)
      .populate('author', 'firstName lastName');

    res.status(201).json(bookWithAuthor);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Błąd walidacji danych', 
        error: error.message 
      });
    }
    res.status(500).json({ 
      message: 'Błąd podczas tworzenia książki', 
      error: error.message 
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ 
        message: 'Książka nie została znaleziona' 
      });
    }

    res.status(204).send();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Nieprawidłowe ID książki' 
      });
    }
    res.status(500).json({ 
      message: 'Błąd podczas usuwania książki', 
      error: error.message 
    });
  }
};

module.exports = {
  getBooks,
  createBook,
  deleteBook
};