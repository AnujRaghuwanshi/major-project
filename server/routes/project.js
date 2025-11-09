const {
    addProject,
    fetchProjects,
    getProjectById,
    updateProject,
    deleteProject,
} = require('../controllers/project');
const express = require('express');
const router = express.Router();

// Create a new project (must come before /:id route)
router.post('/add', addProject);

// Update a project (must come before /:id route)
router.post('/update/:id', updateProject);

// Delete a project (soft delete) (must come before /:id route)
router.post('/delete/:id', deleteProject);

// Fetch all projects - GET (with query params) or POST (with body)
router.get('/', fetchProjects);
router.post('/', fetchProjects);

// Fetch a single project by ID - GET or POST
router.get('/:id', getProjectById);
router.post('/:id', getProjectById);

module.exports = router;

