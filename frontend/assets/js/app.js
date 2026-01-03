// Main Application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('FMS Application Loaded');
    
    // // Initialize tooltips
    // const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    // tooltipTriggerList.map(function (tooltipTriggerEl) {
    //     return new bootstrap.Tooltip(tooltipTriggerEl);
    // });
    
    // // Set current year in footer
    // const currentYear = new Date().getFullYear();
    // document.querySelectorAll('.current-year').forEach(el => {
    //     el.textContent = currentYear;
    // });
    
    // // Handle active navigation links
    // const currentPage = window.location.pathname.split('/').pop();
    // document.querySelectorAll('.nav-link').forEach(link => {
    //     const linkPage = link.getAttribute('href').split('/').pop();
    //     if (linkPage === currentPage) {
    //         link.classList.add('active');
    //     } else {
    //         link.classList.remove('active');
    //     }
    // });
    
    // // Logout confirmation
    // document.querySelectorAll('a[href*="logout"], a[href*="index.html"]').forEach(link => {
    //     if (link.textContent.toLowerCase().includes('logout')) {
    //         link.addEventListener('click', function(e) {
    //             if (!confirm('Are you sure you want to logout?')) {
    //                 e.preventDefault();
    //             }
    //         });
    //     }
    // });
    
    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            
            // Simple validation
            if (!username || !password) {
                showAlert('Please fill all required fields', 'danger');
                return;
            }
            
            // Simulate login process
            showAlert('Login successful! Redirecting to dashboard...', 'success');
            
            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'pages/dashboard.html';
            }, 1500);
        });
    }
    
    // Dashboard Toggle Sidebar
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.getElementById('wrapper').classList.toggle('toggled');
        });
    }
    
    // Initialize DataTable for file list
    const fileTable = document.getElementById('fileTable');
    if (fileTable) {
        // Will initialize DataTable in file.js
    }
    
    console.log('FMS Application initialized');
});

// Alert Function
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-' + type + ' alert-dismissible fade show';
    alertDiv.innerHTML = message + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
    
    // Insert at the beginning of body
    document.body.insertBefore(alertDiv, document.body.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// File Status Badge Colors
function getStatusBadge(status) {
    const badges = {
        'IN': 'success',
        'OUT': 'danger',
        'OVERDUE': 'warning',
        'CREATED': 'primary'
    };
    
    return badges[status] || 'secondary';
}