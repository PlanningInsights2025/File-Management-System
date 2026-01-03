// Company Management JavaScript

// Sample data for demonstration (replace with API calls)
let companies = [
    {
        id: 1,
        companyName: 'ABC Corporation',
        companyCode: 'ABC-001',
        contactPerson: 'John Smith',
        designation: 'General Manager',
        email: 'john.smith@abccorp.com',
        phone: '+1 (555) 123-4567',
        alternatePhone: '+1 (555) 123-4568',
        website: 'https://www.abccorp.com',
        address: '123 Business Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        industry: 'Technology',
        companySize: '201-500',
        notes: 'Premium client since 2020',
        isActive: true,
        filesCount: 45,
        createdDate: '2024-01-15'
    },
    {
        id: 2,
        companyName: 'XYZ Enterprises',
        companyCode: 'XYZ-002',
        contactPerson: 'Sarah Johnson',
        designation: 'Operations Director',
        email: 'sarah.j@xyzent.com',
        phone: '+1 (555) 234-5678',
        alternatePhone: '',
        website: 'https://www.xyzenterprises.com',
        address: '456 Commerce Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        industry: 'Finance',
        companySize: '51-200',
        notes: '',
        isActive: true,
        filesCount: 28,
        createdDate: '2024-02-20'
    },
    {
        id: 3,
        companyName: 'Global Solutions Ltd',
        companyCode: 'GS-003',
        contactPerson: 'Michael Chen',
        designation: 'CEO',
        email: 'mchen@globalsolutions.com',
        phone: '+1 (555) 345-6789',
        alternatePhone: '+1 (555) 345-6790',
        website: 'https://www.globalsolutions.com',
        address: '789 Innovation Drive',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        industry: 'Manufacturing',
        companySize: '500+',
        notes: 'International operations',
        isActive: true,
        filesCount: 67,
        createdDate: '2023-11-10'
    },
    {
        id: 4,
        companyName: 'Tech Innovators Inc',
        companyCode: 'TI-004',
        contactPerson: 'Emily Davis',
        designation: 'Project Manager',
        email: 'edavis@techinnovators.com',
        phone: '+1 (555) 456-7890',
        alternatePhone: '',
        website: 'https://www.techinnovators.com',
        address: '321 Tech Park',
        city: 'Austin',
        state: 'TX',
        zipCode: '73301',
        industry: 'Technology',
        companySize: '11-50',
        notes: 'Startup company',
        isActive: true,
        filesCount: 12,
        createdDate: '2024-03-05'
    },
    {
        id: 5,
        companyName: 'Finance Masters LLC',
        companyCode: 'FM-005',
        contactPerson: 'Robert Wilson',
        designation: 'CFO',
        email: 'rwilson@financemasters.com',
        phone: '+1 (555) 567-8901',
        alternatePhone: '+1 (555) 567-8902',
        website: 'https://www.financemasters.com',
        address: '555 Wall Street',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        industry: 'Finance',
        companySize: '201-500',
        notes: 'Legacy client',
        isActive: false,
        filesCount: 8,
        createdDate: '2023-08-22'
    }
];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCompanies();
    updateStatistics();
    initializeDataTable();
});

// Load companies into table
function loadCompanies() {
    const tableBody = document.getElementById('companiesTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    companies.forEach(company => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${company.id}</td>
            <td><strong>${company.companyName}</strong><br><small class="text-muted">${company.companyCode || 'N/A'}</small></td>
            <td>${company.contactPerson}<br><small class="text-muted">${company.designation || ''}</small></td>
            <td><a href="mailto:${company.email}">${company.email}</a></td>
            <td>${company.phone}</td>
            <td>${company.city ? company.city + ', ' + company.state : company.address}</td>
            <td><span class="badge bg-info">${company.filesCount}</span></td>
            <td><span class="${company.isActive ? 'status-active' : 'status-inactive'}">${company.isActive ? 'Active' : 'Inactive'}</span></td>
            <td>${formatDate(company.createdDate)}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-info" onclick="viewCompany(${company.id})" title="View Details" type="button">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editCompany(${company.id})" title="Edit" type="button">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCompany(${company.id})" title="Delete" type="button">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Initialize DataTable
function initializeDataTable() {
    if ($.fn.DataTable.isDataTable('#companiesTable')) {
        $('#companiesTable').DataTable().destroy();
    }
    
    // Small delay to ensure DOM is fully updated
    setTimeout(function() {
        $('#companiesTable').DataTable({
        pageLength: 10,
        order: [[0, 'desc']],
        language: {
            search: "Search companies:",
            lengthMenu: "Show _MENU_ companies per page",
            info: "Showing _START_ to _END_ of _TOTAL_ companies",
            emptyTable: "No companies found"
        },
        columnDefs: [
            { orderable: false, targets: [9] } // Disable sorting on Actions column
        ]
        });
    }, 100);
}

// Update statistics
function updateStatistics() {
    const totalCompanies = companies.length;
    const activeCompanies = companies.filter(c => c.isActive).length;
    const totalFiles = companies.reduce((sum, c) => sum + c.filesCount, 0);
    
    // Calculate recently added (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentlyAdded = companies.filter(c => new Date(c.createdDate) >= thirtyDaysAgo).length;

    document.getElementById('totalCompanies').textContent = totalCompanies;
    document.getElementById('activeCompanies').textContent = activeCompanies;
    document.getElementById('totalFiles').textContent = totalFiles;
    document.getElementById('recentlyAdded').textContent = recentlyAdded;
}

// Save new company
function saveCompany() {
    console.log('saveCompany function called');
    
    const form = document.getElementById('addCompanyForm');
    if (!form) {
        console.error('Form not found!');
        return;
    }
    
    if (!form.checkValidity()) {
        console.log('Form validation failed');
        form.reportValidity();
        return;
    }

    try {
        // Generate new ID (highest current ID + 1)
        const maxId = companies.length > 0 ? Math.max(...companies.map(c => c.id)) : 0;
        
        const newCompany = {
            id: maxId + 1,
            companyName: document.getElementById('companyName').value.trim(),
            companyCode: document.getElementById('companyCode').value.trim() || `COMP-${String(maxId + 1).padStart(4, '0')}`,
            contactPerson: document.getElementById('contactPerson').value.trim(),
            designation: document.getElementById('designation').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            alternatePhone: document.getElementById('alternatePhone').value.trim(),
            website: document.getElementById('website').value.trim(),
            address: document.getElementById('address').value.trim(),
            city: document.getElementById('city').value.trim(),
            state: document.getElementById('state').value.trim(),
            zipCode: document.getElementById('zipCode').value.trim(),
            industry: document.getElementById('industry').value,
            companySize: document.getElementById('companySize').value,
            notes: document.getElementById('notes').value.trim(),
            isActive: document.getElementById('isActive').checked,
            filesCount: 0,
            createdDate: new Date().toISOString().split('T')[0]
        };

        // Add to companies array
        companies.push(newCompany);
        console.log('✅ New company added:', newCompany);
        console.log('📊 Total companies now:', companies.length);
        
        // Close modal
        const modalElement = document.getElementById('addCompanyModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
        
        // Remove backdrop manually if it persists
        setTimeout(() => {
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('padding-right');
        }, 300);
        
        // Reset form
        form.reset();
        document.getElementById('isActive').checked = true;
        
        // Destroy existing DataTable before updating
        if ($.fn.DataTable.isDataTable('#companiesTable')) {
            $('#companiesTable').DataTable().destroy();
        }
        
        // Update UI
        console.log('🔄 Updating statistics...');
        updateStatistics();
        
        console.log('🔄 Loading companies table...');
        loadCompanies();
        
        console.log('🔄 Initializing DataTable...');
        initializeDataTable();
        
        // Show success message
        showAlert('success', `✓ Company "${newCompany.companyName}" added successfully!`);
        
        console.log('✅ Company save completed successfully');
    } catch (error) {
        console.error('❌ Error saving company:', error);
        showAlert('danger', 'Error adding company: ' + error.message);
    }
}

// View company details
function viewCompany(id) {
    console.log('Viewing company with ID:', id);
    const company = companies.find(c => c.id === id);
    if (!company) {
        console.error('Company not found with ID:', id);
        showAlert('danger', 'Company not found!');
        return;
    }

    const content = `
        <div class="row">
            <div class="col-md-6">
                <h6 class="text-primary"><i class="fas fa-building"></i> Company Information</h6>
                <table class="table table-sm">
                    <tr><th>Company Name:</th><td>${company.companyName}</td></tr>
                    <tr><th>Company Code:</th><td>${company.companyCode || 'N/A'}</td></tr>
                    <tr><th>Industry:</th><td>${company.industry || 'N/A'}</td></tr>
                    <tr><th>Company Size:</th><td>${company.companySize || 'N/A'}</td></tr>
                    <tr><th>Status:</th><td><span class="${company.isActive ? 'status-active' : 'status-inactive'}">${company.isActive ? 'Active' : 'Inactive'}</span></td></tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6 class="text-primary"><i class="fas fa-user"></i> Contact Information</h6>
                <table class="table table-sm">
                    <tr><th>Contact Person:</th><td>${company.contactPerson}</td></tr>
                    <tr><th>Designation:</th><td>${company.designation || 'N/A'}</td></tr>
                    <tr><th>Email:</th><td><a href="mailto:${company.email}">${company.email}</a></td></tr>
                    <tr><th>Phone:</th><td>${company.phone}</td></tr>
                    <tr><th>Alternate Phone:</th><td>${company.alternatePhone || 'N/A'}</td></tr>
                    <tr><th>Website:</th><td>${company.website ? '<a href="' + company.website + '" target="_blank">' + company.website + '</a>' : 'N/A'}</td></tr>
                </table>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-12">
                <h6 class="text-primary"><i class="fas fa-map-marker-alt"></i> Address</h6>
                <p>${company.address}<br>
                ${company.city ? company.city + ', ' : ''}${company.state || ''} ${company.zipCode || ''}</p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-6">
                <h6 class="text-primary"><i class="fas fa-chart-bar"></i> Statistics</h6>
                <p><strong>Total Files:</strong> ${company.filesCount}<br>
                <strong>Created Date:</strong> ${formatDate(company.createdDate)}</p>
            </div>
            <div class="col-md-6">
                <h6 class="text-primary"><i class="fas fa-sticky-note"></i> Notes</h6>
                <p>${company.notes || 'No notes available'}</p>
            </div>
        </div>
    `;

    document.getElementById('viewCompanyContent').innerHTML = content;
    const modal = new bootstrap.Modal(document.getElementById('viewCompanyModal'));
    modal.show();
}

// Edit company
function editCompany(id) {
    console.log('Editing company with ID:', id);
    const company = companies.find(c => c.id === id);
    if (!company) {
        console.error('Company not found with ID:', id);
        showAlert('danger', 'Company not found!');
        return;
    }

    // Populate form
    document.getElementById('editCompanyId').value = company.id;
    document.getElementById('editCompanyName').value = company.companyName;
    document.getElementById('editCompanyCode').value = company.companyCode || '';
    document.getElementById('editContactPerson').value = company.contactPerson;
    document.getElementById('editDesignation').value = company.designation || '';
    document.getElementById('editEmail').value = company.email;
    document.getElementById('editPhone').value = company.phone;
    document.getElementById('editAlternatePhone').value = company.alternatePhone || '';
    document.getElementById('editWebsite').value = company.website || '';
    document.getElementById('editAddress').value = company.address;
    document.getElementById('editCity').value = company.city || '';
    document.getElementById('editState').value = company.state || '';
    document.getElementById('editZipCode').value = company.zipCode || '';
    document.getElementById('editIndustry').value = company.industry || '';
    document.getElementById('editCompanySize').value = company.companySize || '';
    document.getElementById('editNotes').value = company.notes || '';
    document.getElementById('editIsActive').checked = company.isActive;

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editCompanyModal'));
    modal.show();
}

// Update company
function updateCompany() {
    console.log('updateCompany function called');
    
    const form = document.getElementById('editCompanyForm');
    if (!form) {
        console.error('Edit form not found!');
        return;
    }
    
    if (!form.checkValidity()) {
        console.log('Form validation failed');
        form.reportValidity();
        return;
    }

    try {
        const id = parseInt(document.getElementById('editCompanyId').value);
        console.log('Updating company with ID:', id);
        
        const companyIndex = companies.findIndex(c => c.id === id);
        
        if (companyIndex === -1) {
            console.error('Company not found with ID:', id);
            showAlert('danger', 'Company not found!');
            return;
        }

        const updatedName = document.getElementById('editCompanyName').value.trim();
        
        // Update the company
        companies[companyIndex] = {
            ...companies[companyIndex],
            companyName: updatedName,
            companyCode: document.getElementById('editCompanyCode').value.trim(),
            contactPerson: document.getElementById('editContactPerson').value.trim(),
            designation: document.getElementById('editDesignation').value.trim(),
            email: document.getElementById('editEmail').value.trim(),
            phone: document.getElementById('editPhone').value.trim(),
            alternatePhone: document.getElementById('editAlternatePhone').value.trim(),
            website: document.getElementById('editWebsite').value.trim(),
            address: document.getElementById('editAddress').value.trim(),
            city: document.getElementById('editCity').value.trim(),
            state: document.getElementById('editState').value.trim(),
            zipCode: document.getElementById('editZipCode').value.trim(),
            industry: document.getElementById('editIndustry').value,
            companySize: document.getElementById('editCompanySize').value,
            notes: document.getElementById('editNotes').value.trim(),
            isActive: document.getElementById('editIsActive').checked
        };

        console.log('✅ Company updated:', companies[companyIndex]);

        // Close modal
        const modalElement = document.getElementById('editCompanyModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
        
        // Remove backdrop manually if it persists
        setTimeout(() => {
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('padding-right');
        }, 300);
        
        // Destroy existing DataTable before updating
        if ($.fn.DataTable.isDataTable('#companiesTable')) {
            $('#companiesTable').DataTable().destroy();
        }
        
        // Update UI
        console.log('🔄 Updating statistics...');
        updateStatistics();
        
        console.log('🔄 Loading companies table...');
        loadCompanies();
        
        console.log('🔄 Initializing DataTable...');
        initializeDataTable();
        
        // Show success message
        showAlert('success', `✓ Company "${updatedName}" updated successfully!`);
        
        console.log('✅ Company update completed successfully');
    } catch (error) {
        console.error('❌ Error updating company:', error);
        showAlert('danger', 'Error updating company: ' + error.message);
    }
}

// Delete company
function deleteCompany(id) {
    const company = companies.find(c => c.id === id);
    if (!company) return;

    if (confirm(`Are you sure you want to delete "${company.companyName}"?\n\nThis action cannot be undone.`)) {
        companies = companies.filter(c => c.id !== id);
        
        // Reload table
        loadCompanies();
        updateStatistics();
        initializeDataTable();
        
        // Show success message
        showAlert('success', 'Company deleted successfully!');
    }
}

// Utility function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Show alert message
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Export companies data (for future use)
function exportCompanies() {
    // This function can be implemented to export data to CSV/Excel
    console.log('Export functionality to be implemented');
}
