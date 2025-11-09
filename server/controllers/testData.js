const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const University = require('../models/university');
const Subject = require('../models/subject');
const Faculty = require('../models/faculty');
const Admin = require('../models/admin');

const createTestData = async (req, res) => {
    try {
        console.log('Creating test data...\n');

        // 1. Create University/Organization
        const _orgId = crypto.randomBytes(6).toString('hex');
        const university = await University.create({
            _id: _orgId,
            name: 'Test University',
            location: 'Test City, Test State',
            website: 'https://testuniversity.edu'
        });

        // 2. Create Subject
        const _subId = crypto.randomBytes(8).toString('hex');
        const subject = await Subject.create({
            _id: _subId,
            _orgId: _orgId,
            name: 'Computer Science',
            code: 'CS101',
            description: 'Introduction to Computer Science'
        });

        // 3. Create Admin (optional, for completeness)
        const adminId = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash('admin123', 8);
        const admin = await Admin.create({
            _id: adminId,
            _orgId: _orgId,
            fullName: 'Test Admin',
            email: `admin_${Date.now()}@testuniversity.edu`,
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            isDeleted: false
        });

        // 4. Create Faculty
        const facultyId = crypto.randomBytes(8).toString('hex');
        const facultyPassword = await bcrypt.hash('faculty123', 8);
        const faculty = await Faculty.create({
            _id: facultyId,
            _orgId: _orgId,
            _subId: _subId,
            facultyId: 'FAC001',
            fullName: 'Dr. Test Faculty',
            email: `faculty_${Date.now()}@testuniversity.edu`,
            password: facultyPassword,
            role: 'professor',
            experience: '10',
            scholarAccount: 'https://scholar.google.com/citations?user=test123',
            isActive: true,
            isDeleted: false
        });

        res.status(201).json({
            success: 'Test data created successfully',
            data: {
                organization: {
                    _orgId: _orgId,
                    name: university.name,
                    location: university.location,
                    website: university.website
                },
                subject: {
                    _subId: _subId,
                    name: subject.name,
                    code: subject.code
                },
                admin: {
                    _id: adminId,
                    email: admin.email,
                    fullName: admin.fullName
                },
                faculty: {
                    _id: facultyId,
                    _facultyId: facultyId, // Use this as _facultyId in requests
                    email: faculty.email,
                    fullName: faculty.fullName
                },
                // Ready to use IDs
                ids: {
                    _orgId: _orgId,
                    _facultyId: facultyId,
                    _subId: _subId
                }
            },
            message: 'Use the IDs in the "ids" object for your publication/project requests'
        });
    } catch (error) {
        console.error('Error creating test data:', error);
        res.status(500).json({ 
            error: 'Error creating test data: ' + error.message 
        });
    }
};

module.exports = { createTestData };

