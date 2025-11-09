const crypto = require('crypto');
const Publication = require('../models/publication');
const Faculty = require('../models/faculty');

// Create a new publication
const addPublication = async (req, res) => {
    const _id = crypto.randomBytes(8).toString('hex');
    const _orgId = req.body._orgId;
    const _facultyId = req.body._id || req.body._facultyId;

    const {
        publicationTitle,
        publicationType,
        journalName,
        publicationDate,
        doi,
        coAuthors,
        indexed,
        authorRole,
        publicationPdf,
        indexingProof,
        abstract,
    } = req.body;

    try {
        // if (_facultyId) {
        //     const faculty = await Faculty.findOne({ where: { _id: _facultyId, isDeleted: false } });
        //     if (!faculty) {
        //         return res.status(400).json({
        //             error: 'Faculty not found. Please provide a valid _facultyId. Use GET /users/faculty to get valid faculty IDs.'
        //         });
        //     }
        // }

        const newPublication = await Publication.create({
            _id,
            _orgId,
            _facultyId,
            publicationTitle,
            publicationType,
            journalName,
            publicationDate,
            doi,
            coAuthors,
            indexed,
            authorRole,
            publicationPdf,
            indexingProof,
            abstract,
            isDeleted: false,
        });
        res.status(201).json({ success: 'Publication created successfully', data: newPublication });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                error: 'Invalid _facultyId or _orgId. The faculty or organization does not exist in the database. Use GET /users/faculty to get valid faculty IDs.'
            });
        }
        res.status(400).json({ error: 'Error creating publication: ' + error.message });
    }
};

const fetchPublications = async (req, res) => {
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

        const publications = await Publication.findAll({
            where: whereClause,
            include: {
                model: Faculty,
                attributes: ['fullName', 'email', 'facultyId'],
                as: 'faculty',
            },
            order: [['publicationDate', 'DESC']],
        });
        res.status(200).json(publications);
    } catch (error) {
        console.error('Error fetching publications:', error);
        res.status(500).json({ error: 'Error fetching publications: ' + error.message });
    }
};

const getPublicationById = async (req, res) => {
    const { id } = req.params;

    try {
        const publication = await Publication.findOne({
            where: { _id: id, isDeleted: false },
            include: {
                model: Faculty,
                attributes: ['fullName', 'email', 'facultyId'],
                as: 'faculty',
            },
        });

        if (!publication) {
            return res.status(404).json({ error: 'Publication not found' });
        }

        res.status(200).json(publication);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching publication: ' + error.message });
    }
};

// Update a publication
const updatePublication = async (req, res) => {
    const { id } = req.params;
    const _facultyId = req.body._id || req.body._facultyId;

    try {
        const { _orgId, _facultyId: bodyFacultyId, token, ...updateData } = req.body;

        const whereClause = { _id: id, isDeleted: false };
        if (req.body.userType === 'faculty' && _facultyId) {
            whereClause._facultyId = _facultyId;
        }

        const [updated] = await Publication.update(updateData, {
            where: whereClause,
        });

        if (updated === 0) {
            return res.status(404).json({ error: 'Publication not found' });
        }

        res.status(200).json({ success: 'Publication updated successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error updating publication: ' + error.message });
    }
};

const deletePublication = async (req, res) => {
    const { id } = req.params;
    const _facultyId = req.body._id || req.body._facultyId;

    try {
        const whereClause = { _id: id, isDeleted: false };
        if (req.body.userType === 'faculty' && _facultyId) {
            whereClause._facultyId = _facultyId;
        }

        const [updated] = await Publication.update(
            { isDeleted: true },
            { where: whereClause }
        );

        if (updated === 0) {
            return res.status(404).json({ error: 'Publication not found' });
        }

        res.status(200).json({ success: 'Publication deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting publication: ' + error.message });
    }
};

module.exports = {
    addPublication,
    fetchPublications,
    getPublicationById,
    updatePublication,
    deletePublication,
};

