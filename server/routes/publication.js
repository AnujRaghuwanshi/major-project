const {
    addPublication,
    fetchPublications,
    getPublicationById,
    updatePublication,
    deletePublication,
} = require('../controllers/publication');
const express = require('express');
const router = express.Router();

router.post('/add', addPublication);
router.post('/update/:id', updatePublication);
router.post('/delete/:id', deletePublication);

// Fetch all publications - GET (with query params) or POST (with body)
router.get('/', fetchPublications);
router.post('/', fetchPublications);

// Fetch a single publication by ID - GET or POST
router.get('/:id', getPublicationById);
router.post('/:id', getPublicationById);

module.exports = router;

