const Company = require('../models/Company');

// Get all companies
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        res.json({
            success: true,
            count: companies.length,
            data: companies
        });
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching companies',
            error: error.message
        });
    }
};

// Get company by ID
exports.getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findByPk(id, {
            include: [{
                model: require('../models/File'),
                as: 'files'
            }]
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        res.json({
            success: true,
            data: company
        });
    } catch (error) {
        console.error('Error fetching company:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching company',
            error: error.message
        });
    }
};

// Create new company
exports.createCompany = async (req, res) => {
    try {
        const {
            companyName,
            companyCode,
            contactPerson,
            designation,
            email,
            phone,
            alternatePhone,
            website,
            address,
            city,
            state,
            zipCode,
            industry,
            companySize,
            notes,
            isActive
        } = req.body;

        // Validate required fields
        if (!companyName || !contactPerson || !email || !phone || !address) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: companyName, contactPerson, email, phone, address'
            });
        }

        // Check if company with same name already exists
        const existingCompany = await Company.findOne({
            where: { companyName }
        });

        if (existingCompany) {
            return res.status(400).json({
                success: false,
                message: 'Company with this name already exists'
            });
        }

        // Create company
        const company = await Company.create({
            companyName,
            companyCode,
            contactPerson,
            designation,
            email,
            phone,
            alternatePhone,
            website,
            address,
            city,
            state,
            zipCode,
            industry,
            companySize,
            notes,
            isActive: isActive !== undefined ? isActive : true
        });

        res.status(201).json({
            success: true,
            message: 'Company created successfully',
            data: company
        });
    } catch (error) {
        console.error('Error creating company:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating company',
            error: error.message
        });
    }
};

// Update company
exports.updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            companyName,
            companyCode,
            contactPerson,
            designation,
            email,
            phone,
            alternatePhone,
            website,
            address,
            city,
            state,
            zipCode,
            industry,
            companySize,
            notes,
            isActive
        } = req.body;

        const company = await Company.findByPk(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        // Update company
        await company.update({
            companyName: companyName || company.companyName,
            companyCode: companyCode !== undefined ? companyCode : company.companyCode,
            contactPerson: contactPerson || company.contactPerson,
            designation: designation !== undefined ? designation : company.designation,
            email: email || company.email,
            phone: phone || company.phone,
            alternatePhone: alternatePhone !== undefined ? alternatePhone : company.alternatePhone,
            website: website !== undefined ? website : company.website,
            address: address || company.address,
            city: city !== undefined ? city : company.city,
            state: state !== undefined ? state : company.state,
            zipCode: zipCode !== undefined ? zipCode : company.zipCode,
            industry: industry !== undefined ? industry : company.industry,
            companySize: companySize !== undefined ? companySize : company.companySize,
            notes: notes !== undefined ? notes : company.notes,
            isActive: isActive !== undefined ? isActive : company.isActive
        });

        res.json({
            success: true,
            message: 'Company updated successfully',
            data: company
        });
    } catch (error) {
        console.error('Error updating company:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating company',
            error: error.message
        });
    }
};

// Delete company
exports.deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findByPk(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        // Check if company has associated files
        const File = require('../models/File');
        const fileCount = await File.count({
            where: { companyId: id }
        });

        if (fileCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete company. It has ${fileCount} associated file(s). Please reassign or delete the files first.`
            });
        }

        await company.destroy();

        res.json({
            success: true,
            message: 'Company deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting company:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting company',
            error: error.message
        });
    }
};

// Get company statistics
exports.getCompanyStatistics = async (req, res) => {
    try {
        const totalCompanies = await Company.count();
        const activeCompanies = await Company.count({
            where: { isActive: true }
        });
        const inactiveCompanies = await Company.count({
            where: { isActive: false }
        });

        // Get companies added in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentCompanies = await Company.count({
            where: {
                createdAt: {
                    [require('sequelize').Op.gte]: thirtyDaysAgo
                }
            }
        });

        // Get total files count
        const File = require('../models/File');
        const totalFiles = await File.count();

        res.json({
            success: true,
            data: {
                totalCompanies,
                activeCompanies,
                inactiveCompanies,
                recentCompanies,
                totalFiles
            }
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};

// Search companies
exports.searchCompanies = async (req, res) => {
    try {
        const { query, isActive } = req.query;
        const { Op } = require('sequelize');

        const whereClause = {};

        if (query) {
            whereClause[Op.or] = [
                { companyName: { [Op.like]: `%${query}%` } },
                { companyCode: { [Op.like]: `%${query}%` } },
                { contactPerson: { [Op.like]: `%${query}%` } },
                { email: { [Op.like]: `%${query}%` } }
            ];
        }

        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
        }

        const companies = await Company.findAll({
            where: whereClause,
            order: [['companyName', 'ASC']]
        });

        res.json({
            success: true,
            count: companies.length,
            data: companies
        });
    } catch (error) {
        console.error('Error searching companies:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching companies',
            error: error.message
        });
    }
};
