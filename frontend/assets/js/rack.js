// Rack Management System
console.log('✅ Rack Management Script Loaded');

// Sample Racks Data
let racks = [
    {
        id: 1,
        rackName: 'Archive Section A',
        rackCode: 'RK-A-001',
        location: 'Main Storage Hall',
        floor: 'Ground Floor',
        capacity: 200,
        currentFiles: 145,
        section: 'Section A',
        description: 'Primary archive storage for historical documents',
        isActive: true,
        createdDate: '2024-01-15'
    },
    {
        id: 2,
        rackName: 'Active Files - Zone B',
        rackCode: 'RK-B-002',
        location: 'Main Storage Hall',
        floor: 'Ground Floor',
        capacity: 150,
        currentFiles: 150,
        section: 'Section B',
        description: 'Current year active file storage',
        isActive: true,
        createdDate: '2024-01-20'
    },
    {
        id: 3,
        rackName: 'Finance Records',
        rackCode: 'RK-F-001',
        location: 'Secure Vault',
        floor: '1st Floor',
        capacity: 100,
        currentFiles: 67,
        section: 'Finance',
        description: 'Financial documents and tax records',
        isActive: true,
        createdDate: '2024-02-10'
    },
    {
        id: 4,
        rackName: 'Legal Documents',
        rackCode: 'RK-L-001',
        location: 'Secure Vault',
        floor: '1st Floor',
        capacity: 80,
        currentFiles: 42,
        section: 'Legal',
        description: 'Legal contracts and agreements',
        isActive: true,
        createdDate: '2024-02-15'
    },
    {
        id: 5,
        rackName: 'Old Records - Basement',
        rackCode: 'RK-AR-005',
        location: 'Basement Storage',
        floor: 'Basement',
        capacity: 300,
        currentFiles: 198,
        section: 'Archive',
        description: 'Long-term archive storage',
        isActive: false,
        createdDate: '2023-12-01'
    }
];

let dataTable;

// Initialize DataTable and Load Racks
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Content Loaded - Initializing Rack Management');
    loadRacks();
    updateStatistics();
});

// Load and Display Racks
function loadRacks() {
    console.log('📊 Loading racks...');
    const tbody = document.getElementById('racksTableBody');
    if (!tbody) {
        console.error('❌ racksTableBody not found');
        return;
    }

    // Clear existing rows
    tbody.innerHTML = '';
    
    if (racks.length === 0) {
        console.log('⚠️ No racks to display');
    }
    
    racks.forEach(rack => {
        const usagePercent = Math.round((rack.currentFiles / rack.capacity) * 100);
        const statusClass = rack.currentFiles >= rack.capacity ? 'status-full' : (rack.isActive ? 'status-active' : 'status-inactive');
        const statusText = rack.currentFiles >= rack.capacity ? 'Full' : (rack.isActive ? 'Active' : 'Inactive');
        
        const row = `
            <tr>
                <td>${rack.id}</td>
                <td><strong>${rack.rackName}</strong></td>
                <td><code>${rack.rackCode}</code></td>
                <td>${rack.location}<br><small class="text-muted">${rack.floor || 'N/A'}</small></td>
                <td>${rack.capacity}</td>
                <td>${rack.currentFiles}</td>
                <td>
                    <div class="capacity-bar">
                        <div class="capacity-fill" style="width: ${usagePercent}%"></div>
                    </div>
                    <small>${usagePercent}%</small>
                </td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td>${rack.createdDate}</td>
                <td class="action-buttons">
                    <button type="button" class="btn btn-sm btn-info" onclick="viewRack(${rack.id})"><i class="fas fa-eye"></i></button>
                    <button type="button" class="btn btn-sm btn-warning" onclick="editRack(${rack.id})"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn btn-sm btn-danger" onclick="deleteRack(${rack.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    console.log(`✅ Rendered ${racks.length} racks in table`);

    // Initialize or reinitialize DataTable
    setTimeout(() => {
        if (dataTable) {
            console.log('🔄 Destroying existing DataTable...');
            dataTable.destroy();
        }
        initializeDataTable();
    }, 100);
    
    console.log(`✅ Loaded ${racks.length} racks`);
}

// Initialize DataTable
function initializeDataTable() {
    try {
        dataTable = $('#racksTable').DataTable({
            pageLength: 10,
            order: [[0, 'desc']],
            language: {
                search: "Search Racks:",
                lengthMenu: "Show _MENU_ racks",
                info: "Showing _START_ to _END_ of _TOTAL_ racks",
                emptyTable: "No racks available"
            }
        });
        console.log('✅ DataTable initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing DataTable:', error);
    }
}

// Update Statistics
function updateStatistics() {
    const activeRacks = racks.filter(r => r.isActive && r.currentFiles < r.capacity).length;
    const totalCapacity = racks.reduce((sum, r) => sum + r.capacity, 0);
    const totalFiles = racks.reduce((sum, r) => sum + r.currentFiles, 0);

    document.getElementById('totalRacks').textContent = racks.length;
    document.getElementById('activeRacks').textContent = activeRacks;
    document.getElementById('totalCapacity').textContent = totalCapacity;
    document.getElementById('totalFiles').textContent = totalFiles;
    
    console.log('✅ Statistics updated');
}

// Save New Rack
function saveRack() {
    console.log('💾 Saving new rack...');
    
    try {
        const form = document.getElementById('addRackForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            console.log('❌ Form validation failed');
            return;
        }

        const rackName = document.getElementById('rackName').value.trim();
        const rackCode = document.getElementById('rackCode').value.trim() || `RK-${Date.now()}`;
        const location = document.getElementById('location').value.trim();
        const floor = document.getElementById('floor').value;
        const capacity = parseInt(document.getElementById('capacity').value);
        const section = document.getElementById('section').value.trim();
        const description = document.getElementById('description').value.trim();
        const isActive = document.getElementById('isActive').checked;

        // Validate required fields
        if (!rackName || !location || !capacity) {
            alert('Please fill in all required fields!');
            return;
        }

        // Check for duplicate rack code
        if (rackCode && racks.some(r => r.rackCode === rackCode)) {
            alert('Rack code already exists! Please use a different code.');
            return;
        }

        const newRack = {
            id: racks.length > 0 ? Math.max(...racks.map(r => r.id)) + 1 : 1,
            rackName,
            rackCode,
            location,
            floor,
            capacity,
            currentFiles: 0,
            section,
            description,
            isActive,
            createdDate: new Date().toISOString().split('T')[0]
        };

        racks.push(newRack);
        console.log('✅ Rack added:', newRack);
        console.log('📊 Total racks now:', racks.length);

        // Close modal and reset form
        const modalElement = document.getElementById('addRackModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
        form.reset();

        // Remove any lingering backdrops
        setTimeout(() => {
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('padding-right');
        }, 300);

        // Destroy DataTable before reloading
        if (dataTable) {
            dataTable.destroy();
            dataTable = null;
        }

        loadRacks();
        updateStatistics();
        
        alert('✅ Rack added successfully!');
    } catch (error) {
        console.error('❌ Error saving rack:', error);
        alert('Error adding rack. Please try again.');
    }
}

// Edit Rack
function editRack(id) {
    console.log('✏️ Editing rack:', id);
    const rack = racks.find(r => r.id === id);
    if (!rack) {
        console.error('❌ Rack not found:', id);
        return;
    }

    document.getElementById('editRackId').value = rack.id;
    document.getElementById('editRackName').value = rack.rackName;
    document.getElementById('editRackCode').value = rack.rackCode;
    document.getElementById('editLocation').value = rack.location;
    document.getElementById('editFloor').value = rack.floor;
    document.getElementById('editCapacity').value = rack.capacity;
    document.getElementById('editSection').value = rack.section;
    document.getElementById('editDescription').value = rack.description;
    document.getElementById('editIsActive').checked = rack.isActive;

    const modal = new bootstrap.Modal(document.getElementById('editRackModal'));
    modal.show();
}

// Update Rack
function updateRack() {
    console.log('🔄 Updating rack...');
    
    try {
        const form = document.getElementById('editRackForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            console.log('❌ Form validation failed');
            return;
        }

        const id = parseInt(document.getElementById('editRackId').value);
        const index = racks.findIndex(r => r.id === id);
        
        if (index === -1) {
            console.error('❌ Rack not found');
            alert('Error: Rack not found!');
            return;
        }

        const newCapacity = parseInt(document.getElementById('editCapacity').value);
        const currentFiles = racks[index].currentFiles;

        if (newCapacity < currentFiles) {
            alert(`Cannot reduce capacity below current file count (${currentFiles})!`);
            return;
        }

        const updatedRackName = document.getElementById('editRackName').value.trim();
        const updatedRackCode = document.getElementById('editRackCode').value.trim();
        
        // Validate required fields
        if (!updatedRackName || !document.getElementById('editLocation').value.trim() || !newCapacity) {
            alert('Please fill in all required fields!');
            return;
        }

        // Check for duplicate rack code (excluding current rack)
        if (updatedRackCode && racks.some(r => r.rackCode === updatedRackCode && r.id !== id)) {
            alert('Rack code already exists! Please use a different code.');
            return;
        }

        racks[index] = {
            ...racks[index],
            rackName: updatedRackName,
            rackCode: updatedRackCode,
            location: document.getElementById('editLocation').value.trim(),
            floor: document.getElementById('editFloor').value,
            capacity: newCapacity,
            section: document.getElementById('editSection').value.trim(),
            description: document.getElementById('editDescription').value.trim(),
            isActive: document.getElementById('editIsActive').checked
        };

        console.log('✅ Rack updated:', racks[index]);
        console.log('📊 Updated rack details:', JSON.stringify(racks[index], null, 2));

        // Close modal
        const modalElement = document.getElementById('editRackModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }

        // Clean up modal backdrop
        setTimeout(() => {
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('padding-right');
        }, 300);

        // Destroy DataTable before reloading
        if (dataTable) {
            dataTable.destroy();
            dataTable = null;
        }

        loadRacks();
        updateStatistics();
        
        alert('✅ Rack updated successfully!');
    } catch (error) {
        console.error('❌ Error updating rack:', error);
        alert('Error updating rack. Please try again.');
    }
}

// Delete Rack
function deleteRack(id) {
    console.log('🗑️ Attempting to delete rack:', id);
    
    try {
        const rack = racks.find(r => r.id === id);
        if (!rack) {
            console.error('❌ Rack not found:', id);
            alert('Error: Rack not found!');
            return;
        }

        console.log('📋 Rack to delete:', rack.rackName);

        // Prevent deleting rack with files
        if (rack.currentFiles > 0) {
            alert(`Cannot delete rack "${rack.rackName}" because it contains ${rack.currentFiles} files. Please move all files before deleting.`);
            console.log('❌ Delete prevented - rack contains files');
            return;
        }

        if (confirm(`Are you sure you want to delete rack "${rack.rackName}"?\n\nRack Code: ${rack.rackCode}\nLocation: ${rack.location}\n\nThis action cannot be undone.`)) {
            const initialCount = racks.length;
            racks = racks.filter(r => r.id !== id);
            console.log('✅ Rack deleted successfully');
            console.log(`📊 Racks count: ${initialCount} → ${racks.length}`);

            // Destroy DataTable before reloading
            if (dataTable) {
                dataTable.destroy();
                dataTable = null;
            }

            loadRacks();
            updateStatistics();
            
            alert('✅ Rack deleted successfully!');
        } else {
            console.log('⚠️ Delete cancelled by user');
        }
    } catch (error) {
        console.error('❌ Error deleting rack:', error);
        alert('Error deleting rack. Please try again.');
    }
}

// View Rack
function viewRack(id) {
    console.log('👁️ Viewing rack:', id);
    const rack = racks.find(r => r.id === id);
    if (!rack) {
        console.error('❌ Rack not found:', id);
        return;
    }

    const usagePercent = Math.round((rack.currentFiles / rack.capacity) * 100);
    const statusClass = rack.currentFiles >= rack.capacity ? 'status-full' : (rack.isActive ? 'status-active' : 'status-inactive');
    const statusText = rack.currentFiles >= rack.capacity ? 'Full' : (rack.isActive ? 'Active' : 'Inactive');

    const content = `
        <div class="row">
            <div class="col-md-12 text-center mb-4">
                <div class="rack-icon mx-auto mb-3"><i class="fas fa-layer-group"></i></div>
                <h4>${rack.rackName}</h4>
                <code>${rack.rackCode}</code>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <strong><i class="fas fa-map-marker-alt"></i> Location:</strong><br>${rack.location}
            </div>
            <div class="col-md-6 mb-3">
                <strong><i class="fas fa-building"></i> Floor:</strong><br>${rack.floor || 'N/A'}
            </div>
            <div class="col-md-6 mb-3">
                <strong><i class="fas fa-box"></i> Section:</strong><br>${rack.section || 'N/A'}
            </div>
            <div class="col-md-6 mb-3">
                <strong><i class="fas fa-database"></i> Capacity:</strong><br>${rack.capacity} files
            </div>
            <div class="col-md-6 mb-3">
                <strong><i class="fas fa-folder"></i> Current Files:</strong><br>${rack.currentFiles} files
            </div>
            <div class="col-md-6 mb-3">
                <strong><i class="fas fa-chart-pie"></i> Usage:</strong><br>
                <div class="capacity-bar">
                    <div class="capacity-fill" style="width: ${usagePercent}%"></div>
                </div>
                <small>${usagePercent}%</small>
            </div>
            <div class="col-md-6 mb-3">
                <strong><i class="fas fa-toggle-on"></i> Status:</strong><br>
                <span class="${statusClass}">${statusText}</span>
            </div>
            <div class="col-md-6 mb-3">
                <strong><i class="fas fa-calendar"></i> Created:</strong><br>${rack.createdDate}
            </div>
            <div class="col-md-12 mb-3">
                <strong><i class="fas fa-info-circle"></i> Description:</strong><br>
                ${rack.description || 'No description available'}
            </div>
        </div>
    `;

    document.getElementById('viewRackContent').innerHTML = content;
    const modal = new bootstrap.Modal(document.getElementById('viewRackModal'));
    modal.show();
}
