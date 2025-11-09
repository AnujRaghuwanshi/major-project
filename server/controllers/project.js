const crypto = require('crypto');
const Project = require('../models/project');
const Faculty = require('../models/faculty');

// Create a new project
const addProject = async (req, res) => {
    const _id = crypto.randomBytes(8).toString('hex');
    // Extract _orgId and _facultyId from JWT token (if present) or request body (for testing)
    const _orgId = req.body._orgId;
    const _facultyId = req.body._id || req.body._facultyId; // User ID from token or request body

    const {
        projectTitle,
        projectDescription,
        projectType,
        domainArea,
        startDate,
        endDate,
        isOngoing,
        principalInvestigator,
        coInvestigators,
        githubLink,
    } = req.body;

    try {
        // Validate that faculty exists
        if (_facultyId) {
            const faculty = await Faculty.findOne({ where: { _id: _facultyId, isDeleted: false } });
            if (!faculty) {
                return res.status(400).json({
                    error: 'Faculty not found. Please provide a valid _facultyId. Use GET /users/faculty to get valid faculty IDs.'
                });
            }
        }

        const newProject = await Project.create({
            _id,
            _orgId,
            _facultyId,
            projectTitle,
            projectDescription,
            projectType,
            domainArea,
            startDate,
            endDate,
            isOngoing: isOngoing || false,
            principalInvestigator,
            coInvestigators,
            githubLink,
            isDeleted: false,
        });
        res.status(201).json({ success: 'Project created successfully', data: newProject });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                error: 'Invalid _facultyId or _orgId. The faculty or organization does not exist in the database. Use GET /users/faculty to get valid faculty IDs.'
            });
        }
        res.status(400).json({ error: 'Error creating project: ' + error.message });
    }
};

const fetchProjects = async (req, res) => {
    // Support both GET (query params) and POST (body)
    const _orgId = req.body?._orgId || req.query?._orgId;
    const _facultyId = req.body?._id || req.body?._facultyId || req.query?._facultyId;
    const userType = req.body?.userType || req.query?.userType;

    try {
        const whereClause = { isDeleted: false };
        if (_orgId) whereClause._orgId = _orgId;
        if (userType === 'faculty' && _facultyId) {
            whereClause._facultyId = _facultyId;
        } else if (_facultyId && !userType) {
            whereClause._facultyId = _facultyId;
        }

        const projects = await Project.findAll({
            where: whereClause,
            include: {
                model: Faculty,
                attributes: ['fullName', 'email', 'facultyId'],
                as: 'faculty',
            },
            order: [['startDate', 'DESC']],
        });
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Error fetching projects: ' + error.message });
    }
};

const getProjectById = async (req, res) => {
    const { id } = req.params;

    try {
        const project = await Project.findOne({
            where: { _id: id, isDeleted: false },
            include: {
                model: Faculty,
                attributes: ['fullName', 'email', 'facultyId'],
                as: 'faculty',
            },
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching project: ' + error.message });
    }
};

// Update a project
const updateProject = async (req, res) => {
    const { id } = req.params;
    const _facultyId = req.body._id || req.body._facultyId;

    try {
        // Remove fields that shouldn't be updated
        const { _orgId, _facultyId: bodyFacultyId, token, ...updateData } = req.body;

        const whereClause = { _id: id, isDeleted: false };
        if (req.body.userType === 'faculty' && _facultyId) {
            whereClause._facultyId = _facultyId;
        }

        const [updated] = await Project.update(updateData, {
            where: whereClause,
        });

        if (updated === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ success: 'Project updated successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error updating project: ' + error.message });
    }
};

// Delete a project (soft delete)
const deleteProject = async (req, res) => {
    const { id } = req.params;
    const _facultyId = req.body._id || req.body._facultyId; // User ID from token or request body

    try {
        const whereClause = { _id: id, isDeleted: false };
        if (req.body.userType === 'faculty' && _facultyId) {
            whereClause._facultyId = _facultyId;
        }

        const [updated] = await Project.update(
            { isDeleted: true },
            { where: whereClause }
        );

        if (updated === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ success: 'Project deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting project: ' + error.message });
    }
};

module.exports = {
    addProject,
    fetchProjects,
    getProjectById,
    updateProject,
    deleteProject,
};

