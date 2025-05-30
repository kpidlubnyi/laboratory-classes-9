const express = require('express');
const { getAuthors, updateAuthor, createAuthor } = require('../controllers/authorControllers');

const router = express.Router();

router.get('/', getAuthors);

router.post('/', createAuthor);

router.put('/:id', updateAuthor);

module.exports = router;