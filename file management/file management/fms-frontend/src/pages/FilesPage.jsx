import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FolderIcon from '@mui/icons-material/Folder';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import QrCodeIcon from '@mui/icons-material/QrCode';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TableChartIcon from '@mui/icons-material/TableChart';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LogoutIcon from '@mui/icons-material/Logout';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import '../styles/fileList.css';

const FilesPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  
  const [filters, setFilters] = useState({
    fileId: '',
    fileName: '',
    company: '',
    status: '',
    responsiblePerson: '',
    department: '',
    rackLocation: '',
    createdDate: ''
  });
  
  const [visibleColumns, setVisibleColumns] = useState({
    fileId: true,
    fileName: true,
    company: true,
    department: true,
    responsiblePerson: true,
    rackLocation: true,
    status: true,
    createdDate: true,
    lastUpdated: true,
    actions: true
  });

  // Mock data
  const mockFiles = [
    {
      id: 1,
      fileId: 'FMS2026001',
      fileName: 'Annual Financial Report 2025',
      company: 'Tech Corp',
      department: 'Finance',
      responsiblePerson: 'John Doe',
      rackLocation: 'Rack A - Shelf 1',
      status: 'IN',
      createdDate: '08-01-2026',
      lastUpdated: '08-01-2026 10:30 AM'
    },
    {
      id: 2,
      fileId: 'FMS2026002',
      fileName: 'HR Policy Document',
      company: 'Global Industries',
      department: 'HR',
      responsiblePerson: 'Jane Smith',
      rackLocation: 'Rack B - Shelf 2',
      status: 'OUT',
      createdDate: '07-01-2026',
      lastUpdated: '07-01-2026 03:15 PM'
    },
    {
      id: 3,
      fileId: 'FMS2026003',
      fileName: 'Project Proposal Q1',
      company: 'Innovate Solutions',
      department: 'Operations',
      responsiblePerson: 'Mike Johnson',
      rackLocation: 'Rack A - Shelf 3',
      status: 'IN',
      createdDate: '06-01-2026',
      lastUpdated: '06-01-2026 11:45 AM'
    },
    {
      id: 4,
      fileId: 'FMS2026004',
      fileName: 'Sales Report December',
      company: 'Enterprise LLC',
      department: 'Sales',
      responsiblePerson: 'Sarah Williams',
      rackLocation: 'Rack C - Shelf 1',
      status: 'OVERDUE',
      createdDate: '30-12-2025',
      lastUpdated: '05-01-2026 09:20 AM'
    },
    {
      id: 5,
      fileId: 'FMS2026005',
      fileName: 'IT Infrastructure Plan',
      company: 'Tech Corp',
      department: 'IT',
      responsiblePerson: 'David Brown',
      rackLocation: 'Rack A - Shelf 2',
      status: 'IN',
      createdDate: '05-01-2026',
      lastUpdated: '05-01-2026 02:00 PM'
    },
    {
      id: 6,
      fileId: 'FMS2026006',
      fileName: 'Legal Contract Review',
      company: 'Global Industries',
      department: 'Legal',
      responsiblePerson: 'Emily Davis',
      rackLocation: 'Rack B - Shelf 1',
      status: 'OUT',
      createdDate: '04-01-2026',
      lastUpdated: '04-01-2026 04:30 PM'
    },
    {
      id: 7,
      fileId: 'FMS2026007',
      fileName: 'Marketing Campaign 2026',
      company: 'Innovate Solutions',
      department: 'Marketing',
      responsiblePerson: 'Robert Wilson',
      rackLocation: 'Rack C - Shelf 2',
      status: 'IN',
      createdDate: '03-01-2026',
      lastUpdated: '03-01-2026 01:15 PM'
    },
    {
      id: 8,
      fileId: 'FMS2026008',
      fileName: 'Quality Assurance Report',
      company: 'Enterprise LLC',
      department: 'QA',
      responsiblePerson: 'Lisa Anderson',
      rackLocation: 'Rack A - Shelf 4',
      status: 'IN',
      createdDate: '02-01-2026',
      lastUpdated: '02-01-2026 10:00 AM'
    }
  ];

  useEffect(() => {
    fetchFiles();
  }, []);
  
  useEffect(() => {
    setFilteredFiles(files);
  }, [files]);

  const fetchFiles = async () => {
    setLoading(true);
    setTimeout(() => {
      setFiles(mockFiles);
      setFilteredFiles(mockFiles);
      setLoading(false);
    }, 500);
  };

  const handleSearch = () => {
    let filtered = [...mockFiles];
    
    if (filters.fileId) {
      filtered = filtered.filter(f => f.fileId.toLowerCase().includes(filters.fileId.toLowerCase()));
    }
    if (filters.fileName) {
      filtered = filtered.filter(f => f.fileName.toLowerCase().includes(filters.fileName.toLowerCase()));
    }
    if (filters.company && filters.company !== 'All Companies') {
      filtered = filtered.filter(f => f.company === filters.company);
    }
    if (filters.status && filters.status !== 'All Status') {
      filtered = filtered.filter(f => f.status === filters.status);
    }
    if (filters.responsiblePerson) {
      filtered = filtered.filter(f => f.responsiblePerson.toLowerCase().includes(filters.responsiblePerson.toLowerCase()));
    }
    if (filters.department && filters.department !== 'All Departments') {
      filtered = filtered.filter(f => f.department === filters.department);
    }
    if (filters.rackLocation && filters.rackLocation !== 'All Locations') {
      filtered = filtered.filter(f => f.rackLocation === filters.rackLocation);
    }
    
    setFiles(filtered);
    setFilteredFiles(filtered);
    toast.success(`Found ${filtered.length} file(s)`);
  };

  const handleReset = () => {
    setFilters({
      fileId: '',
      fileName: '',
      company: '',
      status: '',
      responsiblePerson: '',
      department: '',
      rackLocation: '',
      createdDate: ''
    });
    setFiles(mockFiles);
    setFilteredFiles(mockFiles);
    setGlobalSearch('');
    toast.info('Filters reset');
  };
  
  const handleGlobalSearch = (query) => {
    setGlobalSearch(query);
    
    if (!query) {
      setFilteredFiles(files);
      return;
    }
    
    const filtered = files.filter(file => 
      Object.values(file).some(value => 
        value.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
    
    setFilteredFiles(filtered);
  };
  
  const handleRefresh = async () => {
    setLoading(true);
    await fetchFiles();
    setLoading(false);
    toast.success('File list refreshed');
  };
  
  const handleCopy = () => {
    const tableText = filteredFiles.map(file => 
      `${file.fileId}\t${file.fileName}\t${file.company}\t${file.department}\t${file.responsiblePerson}\t${file.rackLocation}\t${file.status}\t${file.createdDate}\t${file.lastUpdated}`
    ).join('\n');
    
    navigator.clipboard.writeText(tableText);
    toast.success('Table data copied to clipboard');
  };
  
  const handleExportExcel = () => {
    const excelData = filteredFiles.map(file => ({
      'File ID': file.fileId,
      'File Name': file.fileName,
      'Company': file.company,
      'Department': file.department,
      'Responsible Person': file.responsiblePerson,
      'Rack Location': file.rackLocation,
      'Status': file.status,
      'Created Date': file.createdDate,
      'Last Updated': file.lastUpdated
    }));
    
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'File List');
    
    XLSX.writeFile(wb, `File_List_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast.success('Excel file downloaded');
  };
  
  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('File List Report', 14, 20);
    
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Files: ${filteredFiles.length}`, 14, 37);
    
    const tableData = filteredFiles.map(file => [
      file.fileId,
      file.fileName,
      file.company,
      file.department,
      file.responsiblePerson,
      file.rackLocation,
      file.status,
      file.createdDate
    ]);
    
    doc.autoTable({
      startY: 42,
      head: [['File ID', 'File Name', 'Company', 'Department', 'Person', 'Location', 'Status', 'Date']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 150, 243] }
    });
    
    doc.save(`File_List_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast.success('PDF file downloaded');
  };
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    const tableHTML = `
      <html>
        <head>
          <title>File List - Print</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #2196F3; }
            .info { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background: #2196F3; color: white; font-weight: bold; }
            tr:nth-child(even) { background: #f5f5f5; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <h1>File List Report</h1>
          <div class="info">
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Files:</strong> ${filteredFiles.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>File ID</th>
                <th>File Name</th>
                <th>Company</th>
                <th>Department</th>
                <th>Responsible Person</th>
                <th>Location</th>
                <th>Status</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredFiles.map(file => `
                <tr>
                  <td>${file.fileId}</td>
                  <td>${file.fileName}</td>
                  <td>${file.company}</td>
                  <td>${file.department}</td>
                  <td>${file.responsiblePerson}</td>
                  <td>${file.rackLocation}</td>
                  <td>${file.status}</td>
                  <td>${file.createdDate}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <button onclick="window.print()" style="
            margin-top: 20px;
            padding: 10px 20px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          ">Print</button>
        </body>
      </html>
    `;
    
    printWindow.document.write(tableHTML);
    printWindow.document.close();
  };
  
  const toggleColumn = (columnName) => {
    setVisibleColumns({
      ...visibleColumns,
      [columnName]: !visibleColumns[columnName]
    });
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    
    const sorted = [...filteredFiles].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredFiles(sorted);
  };

  const handleView = (file) => {
    setSelectedFile(file);
    setShowModal(true);
  };

  const handleEdit = (file) => {
    navigate(`/files/edit/${file.id}`, { state: { fileData: file } });
  };

  const handleQRCode = (file) => {
    const printWindow = window.open('', '_blank', 'width=600,height=700');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${file.fileId}</title>
          <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 40px;
            }
            #qrcode {
              margin: 30px auto;
              display: inline-block;
            }
            .file-info {
              margin: 20px auto;
              text-align: left;
              display: inline-block;
              border: 1px solid #ddd;
              padding: 20px;
              border-radius: 8px;
            }
            .file-info p {
              margin: 8px 0;
            }
            .print-btn {
              background: #2196F3;
              color: white;
              padding: 10px 30px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              margin-top: 20px;
              font-size: 16px;
            }
            @media print {
              .print-btn { display: none; }
            }
          </style>
        </head>
        <body>
          <h2>File QR Code</h2>
          <div id="qrcode"></div>
          <div class="file-info">
            <p><strong>File ID:</strong> ${file.fileId}</p>
            <p><strong>File Name:</strong> ${file.fileName}</p>
            <p><strong>Company:</strong> ${file.company}</p>
            <p><strong>Department:</strong> ${file.department}</p>
            <p><strong>Rack Location:</strong> ${file.rackLocation}</p>
            <p><strong>Status:</strong> ${file.status}</p>
          </div>
          <button class="print-btn" onclick="window.print()">Print QR Code</button>
          <script>
            const qrcode = new QRCode(document.getElementById("qrcode"), {
              text: "${file.fileId}",
              width: 256,
              height: 256,
              colorDark: "#000000",
              colorLight: "#ffffff"
            });
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };
  
  const handleCheckInOut = async (file) => {
    const action = file.status === 'IN' ? 'Check Out' : 'Check In';
    const newStatus = file.status === 'IN' ? 'OUT' : 'IN';
    
    const confirmAction = window.confirm(
      `${action} file: ${file.fileName}?\n\nFile ID: ${file.fileId}\nCurrent Status: ${file.status}\n\nThis will update the file status to ${newStatus}.`
    );
    
    if (!confirmAction) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedFiles = files.map(f => 
        f.id === file.id ? { 
          ...f, 
          status: newStatus,
          lastUpdated: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        } : f
      );
      
      setFiles(updatedFiles);
      setFilteredFiles(updatedFiles.filter(f => 
        !globalSearch || Object.values(f).some(value => 
          value.toString().toLowerCase().includes(globalSearch.toLowerCase())
        )
      ));
      
      toast.success(`File ${action.toLowerCase()}ed successfully!`);
      
    } catch (error) {
      console.error('Status toggle error:', error);
      toast.error(`Failed to ${action.toLowerCase()} file. Please try again.`);
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFile(null);
  };
  
  const handlePrintQRCode = () => {
    if (!selectedFile) return;
    handleQRCode(selectedFile);
  };
  
  const handleCheckOutFromModal = async () => {
    if (!selectedFile) return;
    handleCloseModal();
    await handleCheckInOut(selectedFile);
  };
  
  const handleEditFile = () => {
    if (!selectedFile) return;
    handleCloseModal();
    navigate(`/files/edit/${selectedFile.id}`, { state: { fileData: selectedFile } });
  };
  
  const handlePrintDetails = () => {
    if (!selectedFile) return;
    
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>File Details - ${selectedFile.fileId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              max-width: 900px;
              margin: 0 auto;
            }
            h1 {
              color: #2196F3;
              border-bottom: 3px solid #2196F3;
              padding-bottom: 10px;
            }
            .section {
              margin: 30px 0;
            }
            .section h2 {
              color: #555;
              font-size: 18px;
              margin-bottom: 15px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .info-item {
              padding: 10px;
              background: #f5f5f5;
              border-left: 3px solid #2196F3;
            }
            .info-label {
              font-weight: bold;
              color: #666;
              font-size: 12px;
              text-transform: uppercase;
            }
            .info-value {
              font-size: 14px;
              color: #333;
              margin-top: 5px;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 4px;
              color: white;
              font-weight: bold;
            }
            .status-in { background: #4CAF50; }
            .status-out { background: #F44336; }
            .status-overdue { background: #FF9800; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>File Details Report</h1>
          
          <div class="section">
            <h2>File Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">File ID</div>
                <div class="info-value">${selectedFile.fileId}</div>
              </div>
              <div class="info-item">
                <div class="info-label">File Name</div>
                <div class="info-value">${selectedFile.fileName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Company</div>
                <div class="info-value">${selectedFile.company}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Department</div>
                <div class="info-value">${selectedFile.department}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Responsible Person</div>
                <div class="info-value">${selectedFile.responsiblePerson}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Rack Location</div>
                <div class="info-value">${selectedFile.rackLocation}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Status & Dates</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Status</div>
                <div class="info-value">
                  <span class="status-badge status-${selectedFile.status.toLowerCase()}">
                    ${selectedFile.status}
                  </span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">Created Date</div>
                <div class="info-value">${selectedFile.createdDate}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Last Updated</div>
                <div class="info-value">${selectedFile.lastUpdated}</div>
              </div>
            </div>
          </div>
          
          <button onclick="window.print()" style="
            margin-top: 30px;
            padding: 12px 24px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          ">Print Details</button>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpwardIcon style={{ fontSize: 14, opacity: 0.3 }} />;
    return sortConfig.direction === 'asc' ? 
      <ArrowUpwardIcon style={{ fontSize: 14 }} /> : 
      <ArrowDownwardIcon style={{ fontSize: 14 }} />;
  };

  return (
    <Layout>
      <div className="file-list-page-new">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-icon">
            <FolderIcon />
          </div>
          <div className="hero-content">
            <h1>📁 File List</h1>
            <p>Search, filter, and manage all files in the system</p>
          </div>
        </div>

        {/* Advanced Search Section */}
        <div className="advanced-search-card">
          <div className="card-header" onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>
            <div className="header-left">
              <SearchIcon style={{ marginRight: 8 }} />
              <h3>Advanced Search</h3>
            </div>
            {showAdvancedSearch ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </div>
          
          {showAdvancedSearch && (
            <div className="search-body">
              <div className="filter-grid">
                {/* Row 1 */}
                <div className="filter-item">
                  <label><QrCodeIcon style={{ fontSize: 16, marginRight: 5 }} />File ID</label>
                  <input 
                    type="text" 
                    placeholder="Enter File ID"
                    value={filters.fileId}
                    onChange={(e) => setFilters({...filters, fileId: e.target.value})}
                  />
                </div>
                
                <div className="filter-item">
                  <label><AssignmentIcon style={{ fontSize: 16, marginRight: 5 }} />File Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter file name"
                    value={filters.fileName}
                    onChange={(e) => setFilters({...filters, fileName: e.target.value})}
                  />
                </div>
                
                <div className="filter-item">
                  <label><BusinessIcon style={{ fontSize: 16, marginRight: 5 }} />Company</label>
                  <select value={filters.company} onChange={(e) => setFilters({...filters, company: e.target.value})}>
                  <option value="">All Companies</option>
                  <option value="Tech Corp">Tech Corp</option>
                  <option value="Global Industries">Global Industries</option>
                  <option value="Innovate Solutions">Innovate Solutions</option>
                  <option value="Enterprise LLC">Enterprise LLC</option>
                </select>
              </div>
              
              <div className="filter-item">
                <label><AssignmentIcon style={{ fontSize: 16, marginRight: 5 }} />Status</label>
                <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
                  <option value="">All Status</option>
                  <option value="IN">IN</option>
                  <option value="OUT">OUT</option>
                  <option value="OVERDUE">OVERDUE</option>
                </select>
              </div>

              {/* Row 2 */}
              <div className="filter-item">
                <label><PersonIcon style={{ fontSize: 16, marginRight: 5 }} />Responsible Person</label>
                <input 
                  type="text" 
                  placeholder="Enter person name"
                  value={filters.responsiblePerson}
                  onChange={(e) => setFilters({...filters, responsiblePerson: e.target.value})}
                />
              </div>
              
              <div className="filter-item">
                <label><BusinessIcon style={{ fontSize: 16, marginRight: 5 }} />Department</label>
                <select value={filters.department} onChange={(e) => setFilters({...filters, department: e.target.value})}>
                  <option value="">All Departments</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                  <option value="Legal">Legal</option>
                  <option value="Marketing">Marketing</option>
                  <option value="QA">QA</option>
                </select>
              </div>
              
              <div className="filter-item">
                <label><LocationOnIcon style={{ fontSize: 16, marginRight: 5 }} />Rack Location</label>
                <select value={filters.rackLocation} onChange={(e) => setFilters({...filters, rackLocation: e.target.value})}>
                  <option value="">All Locations</option>
                  <option value="Rack A - Shelf 1">Rack A - Shelf 1</option>
                  <option value="Rack A - Shelf 2">Rack A - Shelf 2</option>
                  <option value="Rack A - Shelf 3">Rack A - Shelf 3</option>
                  <option value="Rack A - Shelf 4">Rack A - Shelf 4</option>
                  <option value="Rack B - Shelf 1">Rack B - Shelf 1</option>
                  <option value="Rack B - Shelf 2">Rack B - Shelf 2</option>
                  <option value="Rack C - Shelf 1">Rack C - Shelf 1</option>
                  <option value="Rack C - Shelf 2">Rack C - Shelf 2</option>
                </select>
              </div>
              
              <div className="filter-item">
                <label><CalendarTodayIcon style={{ fontSize: 16, marginRight: 5 }} />Created Date</label>
                <input 
                  type="date" 
                  placeholder="dd-mm-yyyy"
                  value={filters.createdDate}
                  onChange={(e) => setFilters({...filters, createdDate: e.target.value})}
                />
              </div>
            </div>

            <div className="search-actions">
              <button className="btn-primary" onClick={handleSearch}>
                <SearchIcon style={{ fontSize: 18, marginRight: 6 }} />
                Search Files
              </button>
              <button className="btn-secondary" onClick={handleReset}>
                <RefreshIcon style={{ fontSize: 18, marginRight: 6 }} />
                Reset Filters
              </button>
              <button className="btn-success" style={{ marginLeft: 'auto' }}>
                <QrCodeScannerIcon style={{ fontSize: 18, marginRight: 6 }} />
                Quick Scan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* File Records Section */}
      <div className="file-records-card">
        <div className="card-header-blue">
          <div className="header-content">
            <span className="header-icon"><TableChartIcon /></span>
            <span className="header-title">File Records</span>
            <span className="badge-count">{filteredFiles.length} Files</span>
          </div>
          <button className="icon-btn header-refresh-btn" onClick={handleRefresh} title="Refresh">
            <RefreshIcon style={{ fontSize: 20 }} />
          </button>
        </div>

        <div className="table-actions-bar">
          <div className="export-buttons">
            <button className="export-btn" onClick={handleCopy} title="Copy">
              <ContentCopyIcon style={{ fontSize: 16, marginRight: 4 }} />
              Copy
            </button>
            <button className="export-btn" onClick={handleExportExcel} title="Export to Excel">
              <TableChartIcon style={{ fontSize: 16, marginRight: 4 }} />
              Excel
            </button>
            <button className="export-btn" onClick={handleExportPDF} title="Export to PDF">
              <PictureAsPdfIcon style={{ fontSize: 16, marginRight: 4 }} />
              PDF
            </button>
            <button className="export-btn" onClick={handlePrint} title="Print">
              <PrintIcon style={{ fontSize: 16, marginRight: 4 }} />
              Print
            </button>
            <div className="columns-dropdown" style={{ position: 'relative' }}>
              <button className="export-btn" onClick={() => setShowColumnsMenu(!showColumnsMenu)} title="Columns">
                <ViewColumnIcon style={{ fontSize: 16, marginRight: 4 }} />
                Columns
                <KeyboardArrowDownIcon style={{ fontSize: 16, marginLeft: 4 }} />
              </button>
              {showColumnsMenu && (
                <div className="columns-menu" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                  minWidth: '200px'
                }}>
                  {Object.keys(visibleColumns).map(column => (
                    <label key={column} style={{ display: 'block', padding: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={visibleColumns[column]}
                        onChange={() => toggleColumn(column)}
                        style={{ marginRight: '8px' }}
                      />
                      {column.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="table-search-box">
            <SearchIcon style={{ fontSize: 18, color: '#999', marginRight: 8 }} />
            <input 
              type="text" 
              placeholder="Search in all columns:"
              value={globalSearch}
              onChange={(e) => handleGlobalSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container-new">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading files...</p>
            </div>
          ) : (
            <table className="file-records-table">
              <thead>
                <tr>
                  {visibleColumns.fileId && (
                    <th onClick={() => handleSort('fileId')}>
                      File ID {getSortIcon('fileId')}
                    </th>
                  )}
                  {visibleColumns.fileName && (
                    <th onClick={() => handleSort('fileName')}>
                      File Name {getSortIcon('fileName')}
                    </th>
                  )}
                  {visibleColumns.company && (
                    <th onClick={() => handleSort('company')}>
                      Company {getSortIcon('company')}
                    </th>
                  )}
                  {visibleColumns.department && (
                    <th onClick={() => handleSort('department')}>
                      Department {getSortIcon('department')}
                    </th>
                  )}
                  {visibleColumns.responsiblePerson && (
                    <th onClick={() => handleSort('responsiblePerson')}>
                      Responsible Person {getSortIcon('responsiblePerson')}
                    </th>
                  )}
                  {visibleColumns.rackLocation && (
                    <th onClick={() => handleSort('rackLocation')}>
                      Rack Location {getSortIcon('rackLocation')}
                    </th>
                  )}
                  {visibleColumns.status && (
                    <th onClick={() => handleSort('status')}>
                      Status {getSortIcon('status')}
                    </th>
                  )}
                  {visibleColumns.createdDate && (
                    <th onClick={() => handleSort('createdDate')}>
                      Created Date {getSortIcon('createdDate')}
                    </th>
                  )}
                  {visibleColumns.lastUpdated && (
                    <th onClick={() => handleSort('lastUpdated')}>
                      Last Updated {getSortIcon('lastUpdated')}
                    </th>
                  )}
                  {visibleColumns.actions && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file, index) => (
                  <tr key={file.id}>
                    {visibleColumns.fileId && <td className="file-id">{file.fileId}</td>}
                    {visibleColumns.fileName && <td className="file-name">{file.fileName}</td>}
                    {visibleColumns.company && <td>{file.company}</td>}
                    {visibleColumns.department && <td>{file.department}</td>}
                    {visibleColumns.responsiblePerson && <td>{file.responsiblePerson}</td>}
                    {visibleColumns.rackLocation && <td>{file.rackLocation}</td>}
                    {visibleColumns.status && (
                      <td className="status-cell">
                        <span className={`status-badge-new status-${file.status.toLowerCase()}`}>
                          {file.status}
                        </span>
                      </td>
                    )}
                    {visibleColumns.createdDate && <td>{file.createdDate}</td>}
                    {visibleColumns.lastUpdated && <td className="last-updated">{file.lastUpdated}</td>}
                    {visibleColumns.actions && (
                      <td className="actions-cell-new">
                        <button className="action-btn-new view-btn" onClick={() => handleView(file)} title="View Details">
                          <VisibilityIcon style={{ fontSize: 16 }} />
                        </button>
                        <button 
                          className="action-btn-new checkin-btn" 
                          onClick={() => handleCheckInOut(file)} 
                          title={file.status === 'IN' ? 'Check Out' : 'Check In'}
                        >
                          <SwapHorizIcon style={{ fontSize: 16 }} />
                        </button>
                        <button className="action-btn-new qr-btn" onClick={() => handleQRCode(file)} title="Print QR Code">
                          <QrCodeIcon style={{ fontSize: 16 }} />
                        </button>
                        <button className="action-btn-new edit-btn" onClick={() => handleEdit(file)} title="Edit File">
                          <EditIcon style={{ fontSize: 16 }} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* File Details Modal */}
      {showModal && selectedFile && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <DescriptionIcon style={{ fontSize: 24, marginRight: 8, color: '#2196F3' }} />
                <h2>File Details</h2>
              </div>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <CloseIcon />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-info-section">
                <h3>File Information</h3>
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <label>File ID:</label>
                    <span>{selectedFile.fileId}</span>
                  </div>
                  <div className="modal-info-item">
                    <label>File Name:</label>
                    <span>{selectedFile.fileName}</span>
                  </div>
                  <div className="modal-info-item">
                    <label>Company:</label>
                    <span>{selectedFile.company}</span>
                  </div>
                  <div className="modal-info-item">
                    <label>Department:</label>
                    <span>{selectedFile.department}</span>
                  </div>
                  <div className="modal-info-item">
                    <label>Responsible Person:</label>
                    <span>{selectedFile.responsiblePerson}</span>
                  </div>
                </div>
              </div>

              <div className="modal-info-section">
                <h3>File Details</h3>
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <label>Rack Location:</label>
                    <span>{selectedFile.rackLocation}</span>
                  </div>
                  <div className="modal-info-item">
                    <label>Status:</label>
                    <span className={`status-badge-new status-${selectedFile.status.toLowerCase()}`}>
                      {selectedFile.status}
                    </span>
                  </div>
                  <div className="modal-info-item">
                    <label>Created Date:</label>
                    <span>{selectedFile.createdDate}</span>
                  </div>
                  <div className="modal-info-item">
                    <label>Last Updated:</label>
                    <span>{selectedFile.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn modal-btn-primary" onClick={handlePrintQRCode}>
                <QrCodeIcon style={{ fontSize: 18, marginRight: 6 }} />
                Print QR Code
              </button>
              <button className="modal-btn modal-btn-success" onClick={handleCheckOutFromModal}>
                <CheckCircleIcon style={{ fontSize: 18, marginRight: 6 }} />
                {selectedFile.status === 'IN' ? 'Check Out' : 'Check In'}
              </button>
              <button className="modal-btn modal-btn-warning" onClick={handleEditFile}>
                <EditIcon style={{ fontSize: 18, marginRight: 6 }} />
                Edit File
              </button>
              <button className="modal-btn modal-btn-secondary" onClick={handleCloseModal}>
                <CloseIcon style={{ fontSize: 18, marginRight: 6 }} />
                Close
              </button>
              <button className="modal-btn modal-btn-primary" onClick={handlePrintDetails}>
                <PrintIcon style={{ fontSize: 18, marginRight: 6 }} />
                Print Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      </div>
    </Layout>
  );
};

export default FilesPage;
