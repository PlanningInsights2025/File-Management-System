const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// All routes require authentication
router.use(auth);

// GET routes
router.get('/', companyController.getAllCompanies);
router.get('/statistics', companyController.getCompanyStatistics);
router.get('/search', companyController.searchCompanies);
router.get('/:id', companyController.getCompanyById);

// POST routes (Admin only)
router.post('/', checkRole(['admin']), companyController.createCompany);

// PUT routes (Admin only)
router.put('/:id', checkRole(['admin']), companyController.updateCompany);

// DELETE routes (Admin only)
router.delete('/:id', checkRole(['admin']), companyController.deleteCompany);

module.exports = router;
