// scan.js - QR/Barcode Scanner Functionality

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const readerElement = document.getElementById('reader');
    const startScannerBtn = document.getElementById('startScannerBtn');
    const stopScannerBtn = document.getElementById('stopScannerBtn');
    const scanResultElement = document.getElementById('scanResult');
    const scannedCodeElement = document.getElementById('scannedCode');
    const fileIdInput = document.getElementById('fileIdInput');
    const searchFileBtn = document.getElementById('searchFileBtn');
    const fileDetailsSection = document.getElementById('fileDetails');
    const noFileSelectedSection = document.getElementById('noFileSelected');
    
    // Scanner instance
    let html5QrCode = null;
    let isScannerActive = false;
    
    // Sample file data for demonstration
    const sampleFiles = {
        'FMS-2024-001': {
            id: 'FMS-2024-001',
            title: 'Annual Financial Report 2024',
            company: 'Tech Solutions Inc.',
            preparedBy: 'John Smith',
            responsiblePerson: 'Sarah Johnson',
            rackLocation: 'Rack A-12, Shelf 3',
            purpose: 'Annual Audit',
            createdDate: '2024-01-15',
            updatedDate: '2024-06-20',
            department: 'Finance',
            description: 'Complete financial report for fiscal year 2024 including income statements, balance sheets, and cash flow analysis.',
            status: 'Available'
        },
        'FMS-2024-002': {
            id: 'FMS-2024-002',
            title: 'Employee Contracts',
            company: 'Global Enterprises',
            preparedBy: 'HR Department',
            responsiblePerson: 'Michael Chen',
            rackLocation: 'Rack B-05, Shelf 1',
            purpose: 'Legal Documentation',
            createdDate: '2024-02-10',
            updatedDate: '2024-05-15',
            department: 'Human Resources',
            description: 'Signed employment contracts and related documentation for all employees.',
            status: 'Checked Out'
        },
        'FMS-2024-003': {
            id: 'FMS-2024-003',
            title: 'Product Development Roadmap',
            company: 'Innovate Tech',
            preparedBy: 'Robert Wilson',
            responsiblePerson: 'Emily Davis',
            rackLocation: 'Rack C-08, Shelf 2',
            purpose: 'Project Planning',
            createdDate: '2024-03-05',
            updatedDate: '2024-06-30',
            department: 'Research & Development',
            description: 'Detailed roadmap for product development including timelines, milestones, and resource allocation.',
            status: 'Available'
        },
        'FMS-2024-004': {
            id: 'FMS-2024-004',
            title: 'Client Agreements',
            company: 'Prime Solutions',
            preparedBy: 'Legal Team',
            responsiblePerson: 'David Miller',
            rackLocation: 'Rack D-03, Shelf 4',
            purpose: 'Contract Management',
            createdDate: '2024-04-20',
            updatedDate: '2024-07-10',
            department: 'Legal',
            description: 'All client service agreements and legal contracts.',
            status: 'Archived'
        }
    };
    
    // Initialize Scanner
    function initScanner() {
        // Check if scanner is already initialized
        if (html5QrCode) {
            return html5QrCode;
        }
        
        // Create new scanner instance
        html5QrCode = new Html5Qrcode("reader");
        
        // Configure scanner
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
            showTorchButtonIfSupported: true
        };
        
        return html5QrCode;
    }
    
    // Start Scanner
    async function startScanner() {
        try {
            // Initialize scanner if not already done
            initScanner();
            
            // Get camera configuration
            const cameraConfig = {
                facingMode: "environment" // Use back camera on mobile
            };
            
            // Start scanning
            await html5QrCode.start(
                cameraConfig,
                config,
                onScanSuccess,
                onScanError
            );
            
            // Update UI
            isScannerActive = true;
            startScannerBtn.disabled = true;
            stopScannerBtn.disabled = false;
            readerElement.classList.add('scanner-active');
            
            console.log('Scanner started successfully');
            
        } catch (error) {
            console.error('Failed to start scanner:', error);
            
            // Try with default camera if environment fails
            try {
                await html5QrCode.start(
                    { facingMode: "user" }, // Front camera
                    config,
                    onScanSuccess,
                    onScanError
                );
                
                // Update UI
                isScannerActive = true;
                startScannerBtn.disabled = true;
                stopScannerBtn.disabled = false;
                readerElement.classList.add('scanner-active');
                
            } catch (fallbackError) {
                alert('Cannot access camera. Please ensure camera permissions are granted.');
                console.error('Fallback camera also failed:', fallbackError);
            }
        }
    }
    
    // Stop Scanner
    async function stopScanner() {
        try {
            if (html5QrCode && isScannerActive) {
                await html5QrCode.stop();
                isScannerActive = false;
                
                // Update UI
                startScannerBtn.disabled = false;
                stopScannerBtn.disabled = true;
                readerElement.classList.remove('scanner-active');
                
                console.log('Scanner stopped');
            }
        } catch (error) {
            console.error('Failed to stop scanner:', error);
        }
    }
    
    // Handle Successful Scan
    function onScanSuccess(decodedText, decodedResult) {
        console.log('Scanned successfully:', decodedText);
        console.log('Full decoded result:', decodedResult);
        
        // Display scan result
        showScanResult(decodedText);
        
        // Process the scanned code
        processScannedCode(decodedText);
        
        // Stop scanner after successful scan
        setTimeout(() => {
            stopScanner();
        }, 1000);
    }
    
    // Handle Scan Error
    function onScanError(error) {
        // We don't need to show every scan error to the user
        console.debug('Scan error (normal during scanning):', error);
    }
    
    // Show Scan Result
    function showScanResult(code) {
        scannedCodeElement.textContent = code;
        scanResultElement.classList.remove('d-none');
        
        // Hide result after 3 seconds
        setTimeout(() => {
            scanResultElement.classList.add('d-none');
        }, 3000);
    }
    
    // Process Scanned Code
    function processScannedCode(code) {
        // Clean the code (remove whitespace, special characters if needed)
        const cleanCode = code.trim();
        
        // For demonstration, check if it matches any sample file
        if (sampleFiles[cleanCode]) {
            displayFileDetails(sampleFiles[cleanCode]);
        } else if (cleanCode.startsWith('FMS-')) {
            // If it's a file ID format but not in sample data
            const fileData = {
                id: cleanCode,
                title: 'New File - ' + cleanCode,
                company: 'Unknown Company',
                preparedBy: 'Unknown',
                responsiblePerson: 'To be assigned',
                rackLocation: 'Not assigned',
                purpose: 'To be determined',
                createdDate: new Date().toISOString().split('T')[0],
                updatedDate: new Date().toISOString().split('T')[0],
                department: 'General',
                description: 'File created via QR scan. Details to be updated.',
                status: 'Pending'
            };
            displayFileDetails(fileData);
        } else {
            // Handle other types of codes
            alert('Scanned code: ' + cleanCode + '\nThis is not a recognized file ID.');
        }
    }
    
    // Display File Details
    function displayFileDetails(file) {
        // Hide "no file selected" message
        noFileSelectedSection.style.display = 'none';
        fileDetailsSection.classList.remove('d-none');
        
        // Update file details in the UI
        document.getElementById('fileTitleDisplay').textContent = file.title;
        document.getElementById('fileIdDisplay').textContent = file.id;
        
        // Set status badge color
        const statusBadge = document.getElementById('fileStatusDisplay');
        statusBadge.textContent = file.status;
        statusBadge.className = 'badge ms-2 ';
        
        switch(file.status) {
            case 'Available':
                statusBadge.classList.add('bg-success');
                break;
            case 'Checked Out':
                statusBadge.classList.add('bg-warning');
                break;
            case 'Archived':
                statusBadge.classList.add('bg-secondary');
                break;
            case 'Pending':
                statusBadge.classList.add('bg-info');
                break;
            default:
                statusBadge.classList.add('bg-primary');
        }
        
        // Update other details
        document.getElementById('companyDisplay').textContent = file.company;
        document.getElementById('preparedByDisplay').textContent = file.preparedBy;
        document.getElementById('responsibleDisplay').textContent = file.responsiblePerson;
        document.getElementById('rackDisplay').textContent = file.rackLocation;
        document.getElementById('purposeDisplay').textContent = file.purpose;
        document.getElementById('createdDateDisplay').textContent = file.createdDate;
        document.getElementById('updatedDateDisplay').textContent = file.updatedDate;
        document.getElementById('departmentDisplay').textContent = file.department;
        document.getElementById('descriptionDisplay').textContent = file.description;
        
        // Show success message
        showScanResult(file.id);
    }
    
    // Event Listeners
    startScannerBtn.addEventListener('click', startScanner);
    stopScannerBtn.addEventListener('click', stopScanner);
    
    // Manual Search
    searchFileBtn.addEventListener('click', function() {
        const fileId = fileIdInput.value.trim();
        if (fileId) {
            processScannedCode(fileId);
        } else {
            alert('Please enter a File ID');
        }
    });
    
    // Allow Enter key to trigger search
    fileIdInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchFileBtn.click();
        }
    });
    
    // Check Out Button
    document.getElementById('checkOutBtn')?.addEventListener('click', function() {
        const modal = new bootstrap.Modal(document.getElementById('checkOutModal'));
        modal.show();
    });
    
    // Check In Button
    document.getElementById('checkInBtn')?.addEventListener('click', function() {
        const fileId = document.getElementById('fileIdDisplay').textContent;
        if (confirm(`Check in file: ${fileId}?`)) {
            alert(`File ${fileId} has been checked in successfully!`);
            // Update status in UI
            document.getElementById('fileStatusDisplay').textContent = 'Available';
            document.getElementById('fileStatusDisplay').className = 'badge ms-2 bg-success';
        }
    });
    
    // Print Barcode
    document.getElementById('printBarcodeBtn')?.addEventListener('click', function() {
        const fileId = document.getElementById('fileIdDisplay').textContent;
        alert(`Printing barcode for file: ${fileId}`);
        // In a real application, you would generate and print a barcode
    });
    
    // Print File
    document.getElementById('printFileBtn')?.addEventListener('click', function() {
        window.print();
    });
    
    // Confirm Check Out
    document.getElementById('confirmCheckOut')?.addEventListener('click', function() {
        const issuedTo = document.getElementById('issuedTo').value;
        const purpose = document.getElementById('checkOutPurpose').value;
        
        if (!issuedTo || !purpose) {
            alert('Please fill in all required fields');
            return;
        }
        
        const fileId = document.getElementById('fileIdDisplay').textContent;
        
        // Update file status
        document.getElementById('fileStatusDisplay').textContent = 'Checked Out';
        document.getElementById('fileStatusDisplay').className = 'badge ms-2 bg-warning';
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('checkOutModal'));
        modal.hide();
        
        // Show success message
        alert(`File ${fileId} checked out to ${issuedTo} successfully!`);
        
        // Reset form
        document.getElementById('checkOutForm').reset();
    });
    
    // Generate Test QR Codes Button (for testing)
    const testBtn = document.createElement('button');
    testBtn.className = 'btn btn-warning btn-sm mt-2';
    testBtn.innerHTML = '<i class="fas fa-qrcode"></i> Generate Test QR Codes';
    document.querySelector('.camera-controls').appendChild(testBtn);
    
    testBtn.addEventListener('click', function() {
        const testCodes = [
            'FMS-2024-001',
            'FMS-2024-002',
            'FMS-2024-003',
            'FMS-2024-004'
        ];
        
        let html = '<div class="mt-3"><h6>Test QR Codes:</h6><div class="row">';
        testCodes.forEach(code => {
            html += `
                <div class="col-6 mb-2">
                    <div class="border p-2 text-center">
                        <div class="small">${code}</div>
                        <button class="btn btn-sm btn-outline-primary mt-1 simulate-scan" data-code="${code}">
                            Simulate Scan
                        </button>
                    </div>
                </div>
            `;
        });
        html += '</div></div>';
        
        const existingTestCodes = document.querySelector('.test-codes');
        if (existingTestCodes) {
            existingTestCodes.remove();
        }
        
        const testDiv = document.createElement('div');
        testDiv.className = 'test-codes';
        testDiv.innerHTML = html;
        document.querySelector('.camera-controls').appendChild(testDiv);
        
        // Add event listeners to simulate buttons
        document.querySelectorAll('.simulate-scan').forEach(button => {
            button.addEventListener('click', function() {
                const code = this.getAttribute('data-code');
                processScannedCode(code);
            });
        });
    });
    
    // Clean up scanner when page is unloaded
    window.addEventListener('beforeunload', function() {
        if (html5QrCode && isScannerActive) {
            stopScanner();
        }
    });
    
    // Initialize page state
    console.log('Scan page initialized');
});