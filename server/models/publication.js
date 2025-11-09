const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const Faculty = require('./faculty');

const Publication = sequelize.define(
    'Publication',
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
        publicationTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        publicationType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        journalName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        publicationDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        doi: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        coAuthors: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        indexed: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        authorRole: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        publicationPdf: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        indexingProof: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        abstract: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }
);

Publication.belongsTo(Faculty, { foreignKey: '_facultyId', as: 'faculty' });

module.exports = Publication;

