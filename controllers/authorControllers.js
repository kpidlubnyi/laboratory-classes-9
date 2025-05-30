
const Author = require('../models/Author');

const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find().sort({ lastName: 1, firstName: 1 });
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ 
      message: 'Błąd podczas pobierania autorów', 
      error: error.message 
    });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ 
        message: 'firstName i lastName są wymagane' 
      });
    }

    const existingAuthor = await Author.findOne({ firstName, lastName });
    if (existingAuthor) {
      return res.status(409).json({ 
        message: 'Autor o takim imieniu i nazwisku już istnieje',
        author: existingAuthor
      });
    }

    const newAuthor = new Author({ firstName, lastName });
    const savedAuthor = await newAuthor.save();

    res.status(201).json(savedAuthor);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Błąd walidacji danych', 
        error: error.message 
      });
    }
    res.status(500).json({ 
      message: 'Błąd podczas tworzenia autora', 
      error: error.message 
    });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ 
        message: 'firstName i lastName są wymagane' 
      });
    }

    const updatedAuthor = await Author.findByIdAndUpdate(
      id,
      { firstName, lastName },
      { new: true, runValidators: true }
    );

    if (!updatedAuthor) {
      return res.status(404).json({ 
        message: 'Autor nie został znaleziony' 
      });
    }

    res.status(200).json(updatedAuthor);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Nieprawidłowe ID autora' 
      });
    }
    res.status(500).json({ 
      message: 'Błąd podczas aktualizacji autora', 
      error: error.message 
    });
  }
};

module.exports = {
  getAuthors,
  createAuthor,
  updateAuthor
};