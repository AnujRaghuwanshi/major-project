const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const Faculty = require('./faculty');

const Project = sequelize.define(
    'Project',
    {
        _id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        _orgId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        _facultyId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        projectTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        projectDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        projectType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        domainArea: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        isOngoing: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        principalInvestigator: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        coInvestigators: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        githubLink: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }
);

Project.belongsTo(Faculty, { foreignKey: '_facultyId', as: 'faculty' });

module.exports = Project;

