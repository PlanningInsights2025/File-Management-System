# Company Management Module

## Overview
The Company Management module is a comprehensive feature of the FMS (File Management System) that allows administrators to manage company information, contacts, and related files.

## Features

### Frontend Features
- **Company Listing**: View all companies in a sortable, searchable DataTable
- **Add Company**: Create new companies with comprehensive details
- **Edit Company**: Update existing company information
- **View Company**: View detailed company information
- **Delete Company**: Remove companies (with validation for associated files)
- **Statistics Dashboard**: Real-time statistics showing:
  - Total companies
  - Active companies
  - Total files across all companies
  - Recently added companies (last 30 days)

### Backend Features
- RESTful API endpoints for CRUD operations
- Authentication and role-based access control
- Validation for required fields
- Automatic company code generation
- Search functionality
- Statistics calculation
- Foreign key constraints to prevent orphaned data

## Files Created

### Frontend Files
1. **`frontend/pages/companies.html`** - Main company management page
   - Responsive layout with sidebar navigation
   - DataTable for company listing
   - Modal forms for add/edit/view operations
   - Statistics dashboard

2. **`frontend/assets/js/company.js`** - JavaScript functionality
   - CRUD operations
   - Form validation
   - DataTable initialization
   - Statistics calculation

### Backend Files
1. **`backend/src/controllers/company.controller.js`** - Business logic
   - getAllCompanies
   - getCompanyById
   - createCompany
   - updateCompany
   - deleteCompany
   - getCompanyStatistics
   - searchCompanies

2. **`backend/src/routes/company.routes.js`** - API routes
   - GET /api/companies - Get all companies
   - GET /api/companies/statistics - Get statistics
   - GET /api/companies/search - Search companies
   - GET /api/companies/:id - Get company by ID
   - POST /api/companies - Create new company (Admin only)
   - PUT /api/companies/:id - Update company (Admin only)
   - DELETE /api/companies/:id - Delete company (Admin only)

3. **`backend/src/models/Company.js`** - Database model
   - Sequelize ORM model definition
   - Validation rules
   - Instance and class methods
   - Database hooks

4. **`backend/src/routes/api.routes.js`** - Central API router
5. **`backend/src/app.js`** - Express application setup

### Database Files
1. **`database/companies_table.sql`** - Database schema
   - Table creation script
   - Sample data
   - Indexes for performance

## Database Schema

```sql
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    companyName VARCHAR(255) NOT NULL UNIQUE,
    companyCode VARCHAR(50) UNIQUE,
    contactPerson VARCHAR(255) NOT NULL,
    designation VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alternatePhone VARCHAR(20),
    website VARCHAR(255),
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    zipCode VARCHAR(20),
    industry VARCHAR(100),
    companySize VARCHAR(50),
    notes TEXT,
    isActive BOOLEAN DEFAULT TRUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication
All endpoints require authentication token in the header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Get All Companies
```
GET /api/companies
Response: {
  success: true,
  count: 5,
  data: [...]
}
```

#### Get Company by ID
```
GET /api/companies/:id
Response: {
  success: true,
  data: {...}
}
```

#### Create Company (Admin Only)
```
POST /api/companies
Body: {
  companyName: "ABC Corporation",
  contactPerson: "John Doe",
  email: "john@abc.com",
  phone: "+1234567890",
  address: "123 Main St",
  ...
}
Response: {
  success: true,
  message: "Company created successfully",
  data: {...}
}
```

#### Update Company (Admin Only)
```
PUT /api/companies/:id
Body: {
  companyName: "ABC Corp Updated",
  ...
}
Response: {
  success: true,
  message: "Company updated successfully",
  data: {...}
}
```

#### Delete Company (Admin Only)
```
DELETE /api/companies/:id
Response: {
  success: true,
  message: "Company deleted successfully"
}
```

#### Get Statistics
```
GET /api/companies/statistics
Response: {
  success: true,
  data: {
    totalCompanies: 5,
    activeCompanies: 4,
    inactiveCompanies: 1,
    recentCompanies: 2,
    totalFiles: 150
  }
}
```

#### Search Companies
```
GET /api/companies/search?query=ABC&isActive=true
Response: {
  success: true,
  count: 1,
  data: [...]
}
```

## Usage

### Adding a New Company
1. Navigate to Settings → Companies
2. Click "Add New Company" button
3. Fill in the required fields:
   - Company Name *
   - Contact Person *
   - Email *
   - Phone *
   - Address *
4. Fill in optional fields as needed
5. Click "Save Company"

### Editing a Company
1. Find the company in the table
2. Click the edit (yellow) button
3. Update the information
4. Click "Update Company"

### Viewing Company Details
1. Click the view (blue) button
2. Review all company information
3. Click "Close" when done

### Deleting a Company
1. Click the delete (red) button
2. Confirm the deletion
3. Note: Cannot delete companies with associated files

### Integration with Create File
When creating a new file:
1. Select company from dropdown
2. Click the "+" button next to company dropdown to add a new company
3. System redirects to company management page
4. After adding company, return to create file page

## Access Control

- **View Companies**: All authenticated users
- **Add/Edit/Delete Companies**: Admin users only

## Validation Rules

### Required Fields
- Company Name (2-255 characters, unique)
- Contact Person (not empty)
- Email (valid email format)
- Phone (not empty)
- Address (not empty)

### Optional Fields
- Company Code (unique if provided, auto-generated if not)
- Designation
- Alternate Phone
- Website (valid URL if provided)
- City, State, ZIP Code
- Industry
- Company Size
- Notes

## Features Implementation

### Auto-Generated Company Code
If company code is not provided, the system automatically generates one:
```
Format: COMP-XXXX (e.g., COMP-0001, COMP-0002)
```

### Active/Inactive Status
- Companies can be marked as active or inactive
- Inactive companies are retained in the database for historical records
- Statistics differentiate between active and inactive companies

### File Association Protection
- Cannot delete a company that has associated files
- System shows count of associated files before deletion
- Ensures data integrity

## Future Enhancements

1. **Company Logo Upload**: Allow uploading company logos
2. **Document Templates**: Company-specific document templates
3. **Bulk Import**: CSV/Excel import for multiple companies
4. **Export Functionality**: Export company data to CSV/Excel/PDF
5. **Company Analytics**: Detailed analytics per company
6. **Email Notifications**: Automated notifications for company-related events
7. **Multi-language Support**: Internationalization
8. **Advanced Filters**: More filtering options in the table
9. **Company Groups**: Organize companies into groups/categories
10. **Integration with CRM**: Sync with external CRM systems

## Troubleshooting

### Common Issues

1. **Cannot delete company**
   - Check if company has associated files
   - Reassign or delete files first

2. **Duplicate company name error**
   - Company names must be unique
   - Check for existing companies with similar names

3. **Email validation error**
   - Ensure email is in valid format (user@domain.com)

4. **DataTable not loading**
   - Check browser console for JavaScript errors
   - Ensure jQuery and DataTables libraries are loaded

## Security Considerations

1. **Authentication Required**: All endpoints require valid JWT token
2. **Role-Based Access**: Write operations restricted to admins
3. **Input Validation**: Server-side validation for all inputs
4. **SQL Injection Prevention**: Using ORM (Sequelize) with parameterized queries
5. **XSS Prevention**: Input sanitization and output encoding

## Performance Optimization

1. **Database Indexes**: Indexes on frequently queried columns
2. **Pagination**: DataTables handles large datasets efficiently
3. **Lazy Loading**: Load company data on demand
4. **Caching**: Consider implementing caching for frequently accessed data

## Testing

### Manual Testing Checklist
- [ ] Create new company with all fields
- [ ] Create company with only required fields
- [ ] Edit existing company
- [ ] View company details
- [ ] Delete company without files
- [ ] Try to delete company with files (should fail)
- [ ] Search companies by name
- [ ] Filter active/inactive companies
- [ ] Verify statistics accuracy
- [ ] Test form validation
- [ ] Test duplicate company name prevention

## Support

For issues or questions:
1. Check this documentation
2. Review API error messages
3. Check browser console for frontend errors
4. Check server logs for backend errors
5. Contact system administrator

---

**Version**: 1.0.0  
**Last Updated**: January 2, 2026  
**Author**: FMS Development Team
