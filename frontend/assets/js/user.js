// User Management JavaScript

let users = [
    {
        id: 1,
        fullName: 'John Doe',
        username: 'john.doe',
        email: 'john.doe@fms.com',
        phone: '+1 (555) 123-4567',
        role: 'admin',
        department: 'IT',
        designation: 'System Administrator',
        isActive: true,
        createdDate: '2024-01-15'
    },
    {
        id: 2,
        fullName: 'Sarah Johnson',
        username: 'sarah.j',
        email: 'sarah.johnson@fms.com',
        phone: '+1 (555) 234-5678',
        role: 'manager',
        department: 'HR',
        designation: 'HR Manager',
        isActive: true,
        createdDate: '2024-02-20'
    },
    {
        id: 3,
        fullName: 'Michael Chen',
        username: 'michael.c',
        email: 'michael.chen@fms.com',
        phone: '+1 (555) 345-6789',
        role: 'user',
        department: 'Finance',
        designation: 'Accountant',
        isActive: true,
        createdDate: '2023-11-10'
    },
    {
        id: 4,
        fullName: 'Emily Davis',
        username: 'emily.d',
        email: 'emily.davis@fms.com',
        phone: '+1 (555) 456-7890',
        role: 'user',
        department: 'Legal',
        designation: 'Legal Assistant',
        isActive: true,
        createdDate: '2024-03-05'
    },
    {
        id: 5,
        fullName: 'Robert Wilson',
        username: 'robert.w',
        email: 'robert.wilson@fms.com',
        phone: '+1 (555) 567-8901',
        role: 'manager',
        department: 'Operations',
        designation: 'Operations Manager',
        isActive: false,
        createdDate: '2023-08-22'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    updateStatistics();
    initializeDataTable();
});

function loadUsers() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    users.forEach(user => {
        const initials = user.fullName.split(' ').map(n => n[0]).join('');
        const roleClass = user.role === 'admin' ? 'role-admin' : user.role === 'manager' ? 'role-manager' : 'role-user';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="user-avatar me-2">${initials}</div>
                    <strong>${user.fullName}</strong>
                </div>
            </td>
            <td>${user.username}</td>
            <td><a href="mailto:${user.email}">${user.email}</a></td>
            <td>${user.phone}</td>
            <td><span class="role-badge ${roleClass}">${user.role.toUpperCase()}</span></td>
            <td>${user.department || 'N/A'}</td>
            <td><span class="${user.isActive ? 'status-active' : 'status-inactive'}">${user.isActive ? 'Active' : 'Inactive'}</span></td>
            <td>${formatDate(user.createdDate)}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-info" onclick="viewUser(${user.id})" title="View" type="button">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editUser(${user.id})" title="Edit" type="button">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})" title="Delete" type="button">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function initializeDataTable() {
    if ($.fn.DataTable.isDataTable('#usersTable')) {
        $('#usersTable').DataTable().destroy();
    }
    
    setTimeout(function() {
        $('#usersTable').DataTable({
            pageLength: 10,
            order: [[0, 'desc']],
            language: {
                search: "Search users:",
                lengthMenu: "Show _MENU_ users per page",
                info: "Showing _START_ to _END_ of _TOTAL_ users"
            },
            columnDefs: [{ orderable: false, targets: [9] }]
        });
    }, 100);
}

function updateStatistics() {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = users.filter(u => new Date(u.createdDate) >= thirtyDaysAgo).length;

    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('adminUsers').textContent = adminUsers;
    document.getElementById('recentUsers').textContent = recentUsers;
}

function saveUser() {
    console.log('saveUser called');
    
    const form = document.getElementById('addUserForm');
    if (!form || !form.checkValidity()) {
        form?.reportValidity();
        return;
    }

    try {
        const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
        
        const newUser = {
            id: maxId + 1,
            fullName: document.getElementById('fullName').value.trim(),
            username: document.getElementById('username').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            role: document.getElementById('role').value,
            department: document.getElementById('department').value,
            designation: document.getElementById('designation').value.trim(),
            isActive: document.getElementById('isActive').checked,
            createdDate: new Date().toISOString().split('T')[0]
        };

        users.push(newUser);
        console.log('✅ User added:', newUser);
        
        const modalElement = document.getElementById('addUserModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
        
        setTimeout(() => {
            document.querySelector('.modal-backdrop')?.remove();
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('padding-right');
        }, 300);
        
        form.reset();
        document.getElementById('isActive').checked = true;
        
        if ($.fn.DataTable.isDataTable('#usersTable')) {
            $('#usersTable').DataTable().destroy();
        }
        
        updateStatistics();
        loadUsers();
        initializeDataTable();
        
        showAlert('success', `✓ User "${newUser.fullName}" added successfully!`);
    } catch (error) {
        console.error('❌ Error:', error);
        showAlert('danger', 'Error adding user: ' + error.message);
    }
}

function viewUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) {
        showAlert('danger', 'User not found!');
        return;
    }

    const initials = user.fullName.split(' ').map(n => n[0]).join('');
    const roleClass = user.role === 'admin' ? 'role-admin' : user.role === 'manager' ? 'role-manager' : 'role-user';

    const content = `
        <div class="text-center mb-3">
            <div class="user-avatar mx-auto" style="width: 80px; height: 80px; font-size: 2rem;">${initials}</div>
            <h4 class="mt-3">${user.fullName}</h4>
            <p class="text-muted">${user.designation || user.role}</p>
        </div>
        <div class="row">
            <div class="col-md-6">
                <h6 class="text-primary"><i class="fas fa-user"></i> Personal Info</h6>
                <table class="table table-sm">
                    <tr><th>Full Name:</th><td>${user.fullName}</td></tr>
                    <tr><th>Username:</th><td>${user.username}</td></tr>
                    <tr><th>Email:</th><td><a href="mailto:${user.email}">${user.email}</a></td></tr>
                    <tr><th>Phone:</th><td>${user.phone}</td></tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6 class="text-primary"><i class="fas fa-briefcase"></i> Work Info</h6>
                <table class="table table-sm">
                    <tr><th>Role:</th><td><span class="role-badge ${roleClass}">${user.role.toUpperCase()}</span></td></tr>
                    <tr><th>Department:</th><td>${user.department || 'N/A'}</td></tr>
                    <tr><th>Designation:</th><td>${user.designation || 'N/A'}</td></tr>
                    <tr><th>Status:</th><td><span class="${user.isActive ? 'status-active' : 'status-inactive'}">${user.isActive ? 'Active' : 'Inactive'}</span></td></tr>
                </table>
            </div>
        </div>
    `;

    document.getElementById('viewUserContent').innerHTML = content;
    new bootstrap.Modal(document.getElementById('viewUserModal')).show();
}

function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) {
        showAlert('danger', 'User not found!');
        return;
    }

    document.getElementById('editUserId').value = user.id;
    document.getElementById('editFullName').value = user.fullName;
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editPhone').value = user.phone;
    document.getElementById('editRole').value = user.role;
    document.getElementById('editDepartment').value = user.department || '';
    document.getElementById('editDesignation').value = user.designation || '';
    document.getElementById('editIsActive').checked = user.isActive;

    new bootstrap.Modal(document.getElementById('editUserModal')).show();
}

function updateUser() {
    const form = document.getElementById('editUserForm');
    if (!form || !form.checkValidity()) {
        form?.reportValidity();
        return;
    }

    try {
        const id = parseInt(document.getElementById('editUserId').value);
        const userIndex = users.findIndex(u => u.id === id);
        
        if (userIndex === -1) {
            showAlert('danger', 'User not found!');
            return;
        }

        const updatedName = document.getElementById('editFullName').value.trim();
        
        users[userIndex] = {
            ...users[userIndex],
            fullName: updatedName,
            username: document.getElementById('editUsername').value.trim(),
            email: document.getElementById('editEmail').value.trim(),
            phone: document.getElementById('editPhone').value.trim(),
            role: document.getElementById('editRole').value,
            department: document.getElementById('editDepartment').value,
            designation: document.getElementById('editDesignation').value.trim(),
            isActive: document.getElementById('editIsActive').checked
        };

        const modalElement = document.getElementById('editUserModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
        
        setTimeout(() => {
            document.querySelector('.modal-backdrop')?.remove();
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('padding-right');
        }, 300);
        
        if ($.fn.DataTable.isDataTable('#usersTable')) {
            $('#usersTable').DataTable().destroy();
        }
        
        updateStatistics();
        loadUsers();
        initializeDataTable();
        
        showAlert('success', `✓ User "${updatedName}" updated successfully!`);
    } catch (error) {
        console.error('❌ Error:', error);
        showAlert('danger', 'Error updating user: ' + error.message);
    }
}

function deleteUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) {
        showAlert('danger', 'User not found!');
        return;
    }

    if (user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1) {
        showAlert('warning', 'Cannot delete the last administrator!');
        return;
    }

    if (confirm(`Delete user "${user.fullName}"?\n\nThis cannot be undone.`)) {
        users = users.filter(u => u.id !== id);
        
        if ($.fn.DataTable.isDataTable('#usersTable')) {
            $('#usersTable').DataTable().destroy();
        }
        
        updateStatistics();
        loadUsers();
        initializeDataTable();
        
        showAlert('success', `✓ User "${user.fullName}" deleted successfully!`);
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}
