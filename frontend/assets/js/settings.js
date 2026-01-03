// Settings Page JavaScript - Fully Working Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('Settings page loaded');
    
    // ========== TAB SWITCHING FUNCTIONALITY ==========
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const addNewBtn = document.getElementById('addNewBtn');
    
    if (tabButtons.length === 0) {
        console.error('No tab buttons found! Check your HTML structure.');
    } else {
        console.log(`Found ${tabButtons.length} tab buttons`);
    }
    
    // Function to switch tabs
    function switchTab(tabName) {
        console.log(`Switching to tab: ${tabName}`);
        
        // Remove active class from all tabs
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Add active class to selected tab
        const activeButton = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(`${tabName}-tab`);
        
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        if (activeContent) {
            activeContent.classList.add('active');
        }
        
        // Update Add New button text
        if (addNewBtn) {
            addNewBtn.textContent = `+ Add New ${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
            addNewBtn.setAttribute('data-current-tab', tabName);
        }
        
        // Load data for the tab
        loadTabData(tabName);
    }
    
    // Add click event to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            console.log(`Tab button clicked: ${tabId}`);
            switchTab(tabId);
        });
    });
    
    // ========== MODAL FUNCTIONALITY ==========
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    
    // Open modal when Add New button is clicked
    if (addNewBtn) {
        addNewBtn.addEventListener('click', function() {
            const currentTab = this.getAttribute('data-current-tab') || 'racks';
            console.log(`Opening modal for: ${currentTab}`);
            openModal('add', currentTab);
        });
    }
    
    // Close modal when X or Cancel is clicked
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // ========== INITIALIZE DEFAULT TAB ==========
    // Check if there's an active tab from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const defaultTab = urlParams.get('tab') || localStorage.getItem('lastActiveTab') || 'racks';
    
    console.log(`Default tab: ${defaultTab}`);
    switchTab(defaultTab);
    
    // Save active tab when switching
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            localStorage.setItem('lastActiveTab', tabId);
        });
    });
    
    // Load mock data for testing
    loadMockData();
});

// ========== DATA LOADING FUNCTIONS ==========
function loadTabData(tab) {
    console.log(`Loading data for: ${tab}`);
    
    switch(tab) {
        case 'racks':
            loadRacksData();
            break;
        case 'companies':
            loadCompaniesData();
            break;
        case 'users':
            loadUsersData();
            break;
        default:
            console.error(`Unknown tab: ${tab}`);
    }
}

function loadRacksData() {
    console.log('Loading racks data...');
    const tableBody = document.getElementById('racks-table-body');
    
    if (!tableBody) {
        console.error('Racks table body not found!');
        return;
    }
    
    // Mock data for testing
    const racks = [
        { id: 'RACK-001', name: 'Main Rack A', location: 'Room 101', capacity: 100, used: 45, status: 'active' },
        { id: 'RACK-002', name: 'Archive Rack B', location: 'Basement', capacity: 200, used: 120, status: 'active' },
        { id: 'RACK-003', name: 'Temporary Rack', location: 'Corridor', capacity: 50, used: 50, status: 'full' },
        { id: 'RACK-004', name: 'Digital Archive', location: 'Server Room', capacity: 500, used: 320, status: 'active' },
        { id: 'RACK-005', name: 'Legal Documents', location: 'Room 205', capacity: 80, used: 80, status: 'full' }
    ];
    
    let html = '';
    racks.forEach(rack => {
        html += `
            <tr>
                <td>${rack.id}</td>
                <td>${rack.name}</td>
                <td>${rack.location}</td>
                <td>${rack.used}/${rack.capacity}</td>
                <td><span class="status-badge ${rack.status}">${rack.status}</span></td>
                <td>
                    <button class="btn-icon edit" onclick="openModal('edit', 'racks', '${rack.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="deleteItem('racks', '${rack.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
    console.log('Racks data loaded successfully');
}

function loadCompaniesData() {
    console.log('Loading companies data...');
    const tableBody = document.getElementById('companies-table-body');
    
    if (!tableBody) {
        console.error('Companies table body not found!');
        return;
    }
    
    // Mock data for testing
    const companies = [
        { id: 'COMP-001', name: 'ABC Corporation', contactPerson: 'John Smith', email: 'john@abccorp.com', phone: '+1-555-1234', status: 'active' },
        { id: 'COMP-002', name: 'XYZ Ltd', contactPerson: 'Sarah Johnson', email: 'sarah@xyz.com', phone: '+1-555-5678', status: 'active' },
        { id: 'COMP-003', name: 'Tech Solutions Inc', contactPerson: 'Mike Wilson', email: 'mike@techsolutions.com', phone: '+1-555-9012', status: 'active' },
        { id: 'COMP-004', name: 'Global Enterprises', contactPerson: 'Emma Davis', email: 'emma@global.com', phone: '+1-555-3456', status: 'inactive' }
    ];
    
    let html = '';
    companies.forEach(company => {
        html += `
            <tr>
                <td>${company.id}</td>
                <td>${company.name}</td>
                <td>${company.contactPerson}</td>
                <td>${company.email}</td>
                <td>${company.phone}</td>
                <td><span class="status-badge ${company.status}">${company.status}</span></td>
                <td>
                    <button class="btn-icon edit" onclick="openModal('edit', 'companies', '${company.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="deleteItem('companies', '${company.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
    console.log('Companies data loaded successfully');
}

function loadUsersData() {
    console.log('Loading users data...');
    const tableBody = document.getElementById('users-table-body');
    
    if (!tableBody) {
        console.error('Users table body not found!');
        return;
    }
    
    // Mock data for testing
    const users = [
        { id: 'USER-001', fullName: 'John Doe', email: 'john@admin.com', role: 'Admin', company: 'ABC Corp', lastLogin: '2024-01-15 10:30 AM', status: 'active' },
        { id: 'USER-002', fullName: 'Mike Wilson', email: 'mike@user.com', role: 'User', company: 'XYZ Ltd', lastLogin: '2024-01-14 02:15 PM', status: 'active' },
        { id: 'USER-003', fullName: 'Sarah Johnson', email: 'sarah@manager.com', role: 'Manager', company: 'Tech Solutions', lastLogin: '2024-01-13 09:45 AM', status: 'active' },
        { id: 'USER-004', fullName: 'Emma Davis', email: 'emma@viewer.com', role: 'Viewer', company: 'Global Enterprises', lastLogin: '2024-01-12 04:20 PM', status: 'inactive' }
    ];
    
    let html = '';
    users.forEach(user => {
        html += `
            <tr>
                <td>${user.id}</td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td><span class="role-badge ${user.role.toLowerCase()}">${user.role}</span></td>
                <td>${user.company}</td>
                <td>${user.lastLogin}</td>
                <td><span class="status-badge ${user.status}">${user.status}</span></td>
                <td>
                    <button class="btn-icon edit" onclick="openModal('edit', 'users', '${user.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="deleteItem('users', '${user.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
    console.log('Users data loaded successfully');
}

// ========== MODAL FUNCTIONS ==========
function openModal(action, type, id = null) {
    console.log(`Opening modal - Action: ${action}, Type: ${type}, ID: ${id}`);
    
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalForm = document.getElementById('modal-form');
    
    if (!modal || !modalTitle || !modalForm) {
        console.error('Modal elements not found!');
        return;
    }
    
    modalTitle.textContent = `${action === 'add' ? 'Add New' : 'Edit'} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
    // Generate form based on type
    let formHtml = '';
    
    if (type === 'racks') {
        formHtml = `
            <div class="form-group">
                <label for="rackName">Rack Name *</label>
                <input type="text" id="rackName" name="rackName" required placeholder="Enter rack name">
            </div>
            <div class="form-group">
                <label for="location">Location *</label>
                <input type="text" id="location" name="location" required placeholder="Enter location">
            </div>
            <div class="form-group">
                <label for="capacity">Capacity *</label>
                <input type="number" id="capacity" name="capacity" required placeholder="Enter capacity">
            </div>
            <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" name="description" rows="2" placeholder="Optional description"></textarea>
            </div>
            <div class="form-group">
                <label for="status">Status</label>
                <select id="status" name="status">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Under Maintenance</option>
                    <option value="full">Full</option>
                </select>
            </div>
        `;
    } else if (type === 'companies') {
        formHtml = `
            <div class="form-group">
                <label for="companyName">Company Name *</label>
                <input type="text" id="companyName" name="companyName" required placeholder="Enter company name">
            </div>
            <div class="form-group">
                <label for="contactPerson">Contact Person *</label>
                <input type="text" id="contactPerson" name="contactPerson" required placeholder="Enter contact person">
            </div>
            <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" name="email" required placeholder="Enter email">
            </div>
            <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" name="phone" placeholder="Enter phone number">
            </div>
            <div class="form-group">
                <label for="address">Address</label>
                <textarea id="address" name="address" rows="2" placeholder="Enter address"></textarea>
            </div>
            <div class="form-group">
                <label for="companyStatus">Status</label>
                <select id="companyStatus" name="companyStatus">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                </select>
            </div>
        `;
    } else if (type === 'users') {
        formHtml = `
            <div class="form-group">
                <label for="fullName">Full Name *</label>
                <input type="text" id="fullName" name="fullName" required placeholder="Enter full name">
            </div>
            <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" name="email" required placeholder="Enter email">
            </div>
            <div class="form-group">
                <label for="role">Role *</label>
                <select id="role" name="role">
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="User">User</option>
                    <option value="Viewer">Viewer</option>
                </select>
            </div>
            <div class="form-group">
                <label for="company">Company</label>
                <select id="company" name="company">
                    <option value="">Select Company</option>
                    <option value="ABC Corporation">ABC Corporation</option>
                    <option value="XYZ Ltd">XYZ Ltd</option>
                    <option value="Tech Solutions Inc">Tech Solutions Inc</option>
                </select>
            </div>
            ${action === 'add' ? `
            <div class="form-group">
                <label for="password">Password *</label>
                <input type="password" id="password" name="password" required placeholder="Enter password">
            </div>
            <div class="form-group">
                <label for="confirmPassword">Confirm Password *</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Confirm password">
            </div>
            ` : ''}
            <div class="form-group">
                <label for="userStatus">Status</label>
                <select id="userStatus" name="userStatus">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                </select>
            </div>
        `;
    }
    
    modalForm.innerHTML = formHtml;
    modal.style.display = 'block';
    
    // If editing, load existing data
    if (action === 'edit' && id) {
        loadItemData(type, id);
    }
    
    // Add form submit handler
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.onclick = function(e) {
            e.preventDefault();
            handleFormSubmit(action, type, id);
        };
    }
}

function handleFormSubmit(action, type, id) {
    const modal = document.getElementById('modal');
    
    // Get form data
    const formData = {};
    const inputs = document.querySelectorAll('#modal-form input, #modal-form select, #modal-form textarea');
    
    inputs.forEach(input => {
        formData[input.name] = input.value;
    });
    
    console.log(`Form submitted - Action: ${action}, Type: ${type}, Data:`, formData);
    
    // Here you would typically send data to server via AJAX
    
    // Show success message
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} ${action === 'add' ? 'added' : 'updated'} successfully!`);
    
    // Close modal
    modal.style.display = 'none';
    
    // Reload current tab data
    const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
    loadTabData(activeTab);
}

function deleteItem(type, id) {
    if (confirm(`Are you sure you want to delete this ${type.slice(0, -1)}? This action cannot be undone.`)) {
        console.log(`Deleting ${type} with ID: ${id}`);
        
        // Here you would typically send delete request to server
        
        // Show success message
        alert(`${type.charAt(0).toUpperCase() + type.slice(1, -1)} deleted successfully!`);
        
        // Reload current tab data
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        loadTabData(activeTab);
    }
}

// ========== HELPER FUNCTIONS ==========
function loadMockData() {
    console.log('Loading all mock data...');
    // Initial data is loaded when tabs are switched
}

// Function to load item data for editing (mock)
function loadItemData(type, id) {
    console.log(`Loading ${type} data for ID: ${id}`);
    // In a real app, you would fetch this from server
}