// File Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Create File Form Handler
    const createFileForm = document.getElementById('createFileForm');
    if (createFileForm) {
        createFileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const company = document.getElementById('company').value;
            const fileTitle = document.getElementById('fileTitle').value;
            const preparedBy = document.getElementById('preparedBy').value;
            const purpose = document.getElementById('purpose').value;
            const responsiblePerson = document.getElementById('responsiblePerson').value;
            const rackLocation = document.getElementById('rackLocation').value;
            
            // Validation
            if (!company || !fileTitle || !preparedBy || !purpose || !responsiblePerson || !rackLocation) {
                showAlert('Please fill all required fields marked with *', 'warning');
                return;
            }
            
            // Generate file ID
            const fileId = generateFileId();
            
            // Show success message
            showAlert(`File created successfully! File ID: ${fileId}`, 'success');
            
            // Show QR section
            const qrSection = document.getElementById('qrSection');
            qrSection.classList.remove('d-none');
            
            // Update generated info
            document.getElementById('generatedFileId').textContent = fileId;
            document.getElementById('generatedFileTitle').textContent = fileTitle;
            document.getElementById('generatedCompany').textContent = document.getElementById('company').options[document.getElementById('company').selectedIndex].text;
            document.getElementById('generatedRack').textContent = document.getElementById('rackLocation').options[document.getElementById('rackLocation').selectedIndex].text;
            document.getElementById('generatedDate').textContent = new Date().toLocaleDateString();
            
            // Scroll to QR section
            qrSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // File List Search Functionality
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
    }
    
    // Reset Filters
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetFilters();
        });
    }
    
    // Export to Excel
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportToExcel();
        });
    }
    
    // Initialize DataTable
    initDataTable();
});

// Generate unique File ID
function generateFileId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000);
    
    return `FMS-${year}${month}${day}-${String(randomNum).padStart(3, '0')}`;
}

// Initialize DataTable
function initDataTable() {
    const fileTable = document.getElementById('fileTable');
    if (fileTable) {
        $(fileTable).DataTable({
            "pageLength": 10,
            "order": [[0, 'desc']],
            "language": {
                "search": "Search files:",
                "lengthMenu": "Show _MENU_ files per page",
                "info": "Showing _START_ to _END_ of _TOTAL_ files"
            }
        });
    }
}

// Perform search on file list
function performSearch() {
    const fileId = document.getElementById('searchFileId').value;
    const fileName = document.getElementById('searchFileName').value;
    const company = document.getElementById('searchCompany').value;
    const status = document.getElementById('searchStatus').value;
    
    let message = 'Searching for files with filters: ';
    const filters = [];
    
    if (fileId) filters.push(`File ID: ${fileId}`);
    if (fileName) filters.push(`File Name: ${fileName}`);
    if (company) filters.push(`Company: ${company}`);
    if (status) filters.push(`Status: ${status}`);
    
    if (filters.length > 0) {
        showAlert(filters.join(', '), 'info');
    } else {
        showAlert('Please enter search criteria', 'warning');
    }
}

// Reset all filters
function resetFilters() {
    const filters = ['searchFileId', 'searchFileName', 'searchCompany', 'searchStatus', 'searchResponsible', 'searchRack', 'searchDepartment'];
    
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            if (element.tagName === 'SELECT') {
                element.selectedIndex = 0;
            } else {
                element.value = '';
            }
        }
    });
    
    showAlert('All filters have been reset', 'info');
}

// Export to Excel (simulated)
function exportToExcel() {
    showAlert('Exporting file list to Excel...', 'info');
    
    // In a real application, this would make an API call to generate Excel
    setTimeout(() => {
        showAlert('File exported successfully!', 'success');
        
        // Simulate download
        const link = document.createElement('a');
        link.download = `fms-export-${new Date().toISOString().split('T')[0]}.xlsx`;
        link.href = '#';
        link.click();
    }, 2000);
}
// Print Functions
function printBarcodePage() {
    const fileData = collectFileData();
    
    // Open barcode page in new window with data
    const params = new URLSearchParams(fileData).toString();
    const printWindow = window.open(`../print/barcode-page.html?${params}&autoPrint=true`, '_blank');
    
    // Focus the print window
    if (printWindow) {
        printWindow.focus();
    }
}

function printIndexPage() {
    const fileData = collectFileData();
    
    // Open index page in new window with data
    const params = new URLSearchParams(fileData).toString();
    const printWindow = window.open(`../print/index-page.html?${params}&autoPrint=true`, '_blank');
    
    if (printWindow) {
        printWindow.focus();
    }
}

function printBothPages() {
    const fileData = collectFileData();
    
    // Open combined page in new window with data
    const params = new URLSearchParams(fileData).toString();
    const printWindow = window.open(`../print/both-pages.html?${params}&autoPrint=true`, '_blank');
    
    if (printWindow) {
        printWindow.focus();
    }
}

// Collect file data from form
function collectFileData() {
    const companySelect = document.getElementById('company');
    const rackSelect = document.getElementById('rackLocation');
    const deptSelect = document.getElementById('department');
    
    return {
        fileName: document.getElementById('fileTitle')?.value || 'New File',
        companyName: companySelect?.options[companySelect.selectedIndex]?.text || 'ABC Corporation',
        createdBy: document.getElementById('preparedBy')?.value || 'Admin',
        fileLocation: rackSelect?.options[rackSelect.selectedIndex]?.text || 'Rack A - Shelf 1',
        creationDate: new Date().toLocaleDateString(),
        purpose: document.getElementById('purpose')?.value || 'File Purpose',
        responsiblePerson: document.getElementById('responsiblePerson')?.options[document.getElementById('responsiblePerson').selectedIndex]?.text || 'Responsible Person',
        department: deptSelect?.options[deptSelect.selectedIndex]?.text || 'General',
        fileId: generateFileId(),
        preparedBySignature: document.getElementById('preparedBy')?.value || 'Prepared By',
        approvedBySignature: 'Approving Authority'
    };
}

// Add event listeners for print buttons
document.addEventListener('DOMContentLoaded', function() {
    // Existing code...
    
    // Add print button listeners
    const printBarcodeBtn = document.getElementById('printBarcodeBtn');
    const printIndexBtn = document.getElementById('printIndexBtn');
    const printBothBtn = document.getElementById('printBothBtn');
    
    if (printBarcodeBtn) {
        printBarcodeBtn.addEventListener('click', printBarcodePage);
    }
    
    if (printIndexBtn) {
        printIndexBtn.addEventListener('click', printIndexPage);
    }
    
    if (printBothBtn) {
        printBothBtn.addEventListener('click', printBothPages);
    }
});