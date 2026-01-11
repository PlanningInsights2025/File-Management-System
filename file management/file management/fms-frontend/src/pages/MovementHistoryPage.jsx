import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';
import '../styles/movementHistory.css';

const MovementHistoryPage = () => {
  // Mock data - replace with actual API call
  const mockMovements = [
    {
      id: 1,
      fileId: 'FMS-20260102-001',
      fileName: 'Annual Report 2025',
      action: 'Check-out',
      user: 'John Smith',
      dateTime: '2026-01-02 09:15:30',
      department: 'Finance',
      company: 'ABC Corporation',
      details: 'Checked out for review'
    },
    {
      id: 2,
      fileId: 'FMS-20260102-002',
      fileName: 'Employee Contracts',
      action: 'Check-in',
      user: 'Sarah Johnson',
      dateTime: '2026-01-02 10:30:45',
      department: 'Human Resources',
      company: 'ABC Corporation',
      details: 'Checked in after update'
    },
    {
      id: 3,
      fileId: 'FMS-20260102-003',
      fileName: 'Legal Agreement',
      action: 'Transfer',
      user: 'Mike Wilson',
      dateTime: '2026-01-02 11:45:20',
      department: 'Legal',
      company: 'XYZ Enterprises',
      details: 'Transferred to Legal department'
    },
    {
      id: 4,
      fileId: 'FMS-20260101-005',
      fileName: 'IT Infrastructure Plan',
      action: 'Edit',
      user: 'David Brown',
      dateTime: '2026-01-02 13:20:10',
      department: 'IT Department',
      company: 'Tech Innovators Inc',
      details: 'Updated network diagrams'
    },
    {
      id: 5,
      fileId: 'FMS-20260101-004',
      fileName: 'Marketing Campaign',
      action: 'Create',
      user: 'Emma Wilson',
      dateTime: '2026-01-02 14:55:40',
      department: 'Marketing',
      company: 'Global Solutions Ltd',
      details: 'Created new campaign file'
    },
    {
      id: 6,
      fileId: 'FMS-20251231-010',
      fileName: 'Budget Planning',
      action: 'Check-out',
      user: 'Robert Chen',
      dateTime: '2026-01-02 15:30:25',
      department: 'Finance',
      company: 'Finance Masters LLC',
      details: 'Checked out for budget meeting'
    },
    {
      id: 7,
      fileId: 'FMS-20251230-008',
      fileName: 'Sales Report Q4',
      action: 'Check-in',
      user: 'Lisa Wong',
      dateTime: '2026-01-02 16:45:15',
      department: 'Sales',
      company: 'XYZ Enterprises',
      details: 'Checked in after analysis'
    },
    {
      id: 8,
      fileId: 'FMS-20251229-012',
      fileName: 'Operations Manual',
      action: 'Edit',
      user: 'James Miller',
      dateTime: '2026-01-02 17:10:55',
      department: 'Operations',
      company: 'ABC Corporation',
      details: 'Updated safety procedures'
    }
  ];

  const [movements, setMovements] = useState(mockMovements);
  const [filteredMovements, setFilteredMovements] = useState(mockMovements);
  const [displayedMovements, setDisplayedMovements] = useState([]);
  
  // UI states
  const [showFilters, setShowFilters] = useState(true);
  
  // Filter states
  const [dateFilter, setDateFilter] = useState('today');
  const [fromDate, setFromDate] = useState('2026-01-08');
  const [toDate, setToDate] = useState('2026-01-08');
  const [fileIdFilter, setFileIdFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  useEffect(() => {
    applyPagination();
  }, [filteredMovements, currentPage, entriesPerPage]);

  const applyPagination = () => {
    const indexOfLastEntry = currentPage * parseInt(entriesPerPage);
    const indexOfFirstEntry = indexOfLastEntry - parseInt(entriesPerPage);
    const currentEntries = filteredMovements.slice(indexOfFirstEntry, indexOfLastEntry);
    setDisplayedMovements(currentEntries);
  };

  const handleApplyFilters = () => {
    let filtered = [...movements];

    // Date filter
    if (dateFilter === 'custom' && fromDate && toDate) {
      filtered = filtered.filter(m => {
        const movementDate = m.dateTime.split(' ')[0];
        return movementDate >= fromDate && movementDate <= toDate;
      });
    } else if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(m => m.dateTime.startsWith(today));
    }

    // File ID filter
    if (fileIdFilter.trim()) {
      filtered = filtered.filter(m => 
        m.fileId.toLowerCase().includes(fileIdFilter.toLowerCase())
      );
    }

    // Company filter
    if (companyFilter) {
      filtered = filtered.filter(m => m.company === companyFilter);
    }

    // Department filter
    if (departmentFilter) {
      filtered = filtered.filter(m => m.department === departmentFilter);
    }

    // Action filter
    if (actionFilter) {
      filtered = filtered.filter(m => m.action === actionFilter);
    }

    // User filter
    if (userFilter.trim()) {
      filtered = filtered.filter(m => 
        m.user.toLowerCase().includes(userFilter.toLowerCase())
      );
    }

    setFilteredMovements(filtered);
    setCurrentPage(1);
    toast.success(`✅ Found ${filtered.length} records`);
  };

  const handleResetFilters = () => {
    setDateFilter('today');
    setFromDate('2026-01-08');
    setToDate('2026-01-08');
    setFileIdFilter('');
    setCompanyFilter('');
    setDepartmentFilter('');
    setActionFilter('');
    setUserFilter('');
    setSearchQuery('');
    setFilteredMovements(movements);
    setCurrentPage(1);
    toast.info('🔄 Filters reset');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      applyPagination();
      return;
    }

    const searched = filteredMovements.filter(m =>
      m.fileId.toLowerCase().includes(query.toLowerCase()) ||
      m.fileName.toLowerCase().includes(query.toLowerCase()) ||
      m.user.toLowerCase().includes(query.toLowerCase()) ||
      m.department.toLowerCase().includes(query.toLowerCase()) ||
      m.company.toLowerCase().includes(query.toLowerCase())
    );
    
    setDisplayedMovements(searched);
  };

  // Export Functions
  const handleExportExcel = () => {
    try {
      const worksheetData = filteredMovements.map((m, index) => ({
        '#': index + 1,
        'File ID': m.fileId,
        'File Name': m.fileName,
        'Action': m.action,
        'User': m.user,
        'Date & Time': m.dateTime,
        'Department': m.department,
        'Company': m.company,
        'Details': m.details
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Movement History');

      worksheet['!cols'] = [
        { wch: 5 }, { wch: 18 }, { wch: 25 }, { wch: 12 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 30 }
      ];

      const fileName = `Movement_History_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      toast.success(`📊 Exported ${filteredMovements.length} records to Excel`);
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('❌ Failed to export to Excel');
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF('landscape');
      
      doc.setFontSize(18);
      doc.setTextColor(102, 126, 234);
      doc.text('Movement History Report', 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
      doc.text(`Total Records: ${filteredMovements.length}`, 14, 34);

      const tableData = filteredMovements.map((m, index) => [
        index + 1,
        m.fileId,
        m.fileName,
        m.action,
        m.user,
        m.dateTime,
        m.department,
        m.company,
        m.details
      ]);

      doc.autoTable({
        startY: 40,
        head: [['#', 'File ID', 'File Name', 'Action', 'User', 'Date & Time', 'Department', 'Company', 'Details']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [102, 126, 234],
          textColor: 255,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 8,
          cellPadding: 3
        }
      });

      const fileName = `Movement_History_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success(`📄 Exported ${filteredMovements.length} records to PDF`);
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('❌ Failed to export to PDF');
    }
  };

  const handleExportCSV = () => {
    try {
      const headers = ['#', 'File ID', 'File Name', 'Action', 'User', 'Date & Time', 'Department', 'Company', 'Details'];
      const csvData = [
        headers.join(','),
        ...filteredMovements.map((m, index) => 
          [index + 1, m.fileId, m.fileName, m.action, m.user, m.dateTime, m.department, m.company, m.details]
            .map(field => `"${field}"`)
            .join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Movement_History_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success(`📋 Exported ${filteredMovements.length} records to CSV`);
    } catch (error) {
      console.error('CSV export error:', error);
      toast.error('❌ Failed to export to CSV');
    }
  };

  const handlePrintReport = () => {
    window.print();
    toast.success('🖨️ Print dialog opened');
  };

  const handleEmailReport = () => {
    const subject = `Movement History Report - ${new Date().toLocaleDateString()}`;
    const body = `Movement History Report\n\nTotal Records: ${filteredMovements.length}\nGenerated: ${new Date().toLocaleString()}\n\nPlease find the attached movement history report.`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.info('📧 Opening email client...');
  };

  const handleCopyTable = () => {
    const tableText = filteredMovements.map((m, index) =>
      `${index + 1}\t${m.fileId}\t${m.fileName}\t${m.action}\t${m.user}\t${m.dateTime}\t${m.department}\t${m.company}\t${m.details}`
    ).join('\n');
    
    navigator.clipboard.writeText(tableText).then(() => {
      toast.success('📋 Table copied to clipboard');
    }).catch(() => {
      toast.error('❌ Failed to copy table');
    });
  };

  const handlePrintTable = () => {
    window.print();
    toast.success('🖨️ Print dialog opened');
  };

  // Pagination
  const totalPages = Math.ceil(filteredMovements.length / parseInt(entriesPerPage));
  const startEntry = filteredMovements.length > 0 ? (currentPage - 1) * parseInt(entriesPerPage) + 1 : 0;
  const endEntry = Math.min(currentPage * parseInt(entriesPerPage), filteredMovements.length);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Layout>
      <div className="movement-history-page">
        <div className="page-header-movement">
          <h1>🕐 Movement History</h1>
        </div>

        {/* Collapsible Filter Section */}
        <div className="filter-movements-section">
          <div 
            className="filter-header" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <h2>{showFilters ? '▼' : '▶'} Filter Movements</h2>
          </div>

          {showFilters && (
            <div className="filter-content">
              {/* Filter Options Card */}
              <div className="filter-options-card">
                <h3>⚙️ Filter Options</h3>
                
                <div className="filter-grid">
                  {/* Date Range Filter */}
                  <div className="filter-group date-range-group">
                    <label className="filter-label">📅 Date Range</label>
                    <div className="date-radio">
                      <label className="radio-label">
                        <input 
                          type="radio"
                          value="today"
                          checked={dateFilter === 'today'}
                          onChange={(e) => setDateFilter(e.target.value)}
                        />
                        Today
                      </label>
                      <label className="radio-label">
                        <input 
                          type="radio"
                          value="custom"
                          checked={dateFilter === 'custom'}
                          onChange={(e) => setDateFilter(e.target.value)}
                        />
                        Custom Range
                      </label>
                    </div>
                    
                    <div className="date-inputs">
                      <div className="date-field">
                        <label>From Date</label>
                        <input 
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          className="date-input"
                        />
                      </div>
                      <div className="date-field">
                        <label>To Date</label>
                        <input 
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="date-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* File ID Search */}
                  <div className="filter-group file-id-group">
                    <label className="filter-label">📋 File ID Search</label>
                    <p className="filter-hint">Enter File ID</p>
                    <input 
                      type="text"
                      placeholder="Enter File ID (e.g., FMS-20260102-001)"
                      value={fileIdFilter}
                      onChange={(e) => setFileIdFilter(e.target.value)}
                      className="filter-input"
                    />
                  </div>

                  {/* Company Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Company</label>
                    <select 
                      value={companyFilter}
                      onChange={(e) => setCompanyFilter(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Companies</option>
                      <option value="ABC Corporation">ABC Corporation</option>
                      <option value="XYZ Enterprises">XYZ Enterprises</option>
                      <option value="Tech Innovators Inc">Tech Innovators Inc</option>
                      <option value="Global Solutions Ltd">Global Solutions Ltd</option>
                      <option value="Finance Masters LLC">Finance Masters LLC</option>
                    </select>
                  </div>

                  {/* Department Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Department</label>
                    <select 
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Departments</option>
                      <option value="Finance">Finance</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Legal">Legal</option>
                      <option value="IT Department">IT Department</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>

                  {/* Action Type Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Action Type</label>
                    <select 
                      value={actionFilter}
                      onChange={(e) => setActionFilter(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Actions</option>
                      <option value="Check-out">Check-out</option>
                      <option value="Check-in">Check-in</option>
                      <option value="Transfer">Transfer</option>
                      <option value="Edit">Edit</option>
                      <option value="Create">Create</option>
                    </select>
                  </div>

                  {/* User Filter */}
                  <div className="filter-group">
                    <label className="filter-label">User</label>
                    <input 
                      type="text"
                      placeholder="Enter user name"
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="filter-input"
                    />
                  </div>
                </div>

                <div className="filter-actions">
                  <button className="btn-apply" onClick={handleApplyFilters}>
                    ▼ Apply Filters
                  </button>
                  <button className="btn-reset" onClick={handleResetFilters}>
                    🔄 Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="export-section">
          <h3>📥 Export Options</h3>
          <div className="export-buttons">
            <button className="export-btn excel" onClick={handleExportExcel}>
              📊 Export to Excel
            </button>
            <button className="export-btn pdf" onClick={handleExportPDF}>
              📄 Export to PDF
            </button>
            <button className="export-btn csv" onClick={handleExportCSV}>
              📋 Export to CSV
            </button>
            <button className="export-btn print" onClick={handlePrintReport}>
              🖨️ Print Report
            </button>
            <button className="export-btn email" onClick={handleEmailReport}>
              📧 Email Report
            </button>
          </div>
        </div>

        {/* Movement History Table */}
        <div className="movement-history-card">
          <div className="table-header-controls">
            <h3>🕐 Movement History</h3>
            <div className="table-actions">
              <input 
                type="text"
                placeholder="Search movements..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
              <button className="btn-copy" onClick={handleCopyTable}>
                📋 Copy
              </button>
              <button className="btn-print-table" onClick={handlePrintTable}>
                🖨️ Print Table
              </button>
            </div>
          </div>

          <div className="table-controls-bottom">
            <label className="entries-label">
              Show 
              <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(e.target.value)}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              entries
            </label>
          </div>

          <div className="table-wrapper">
            <table className="movements-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>File ID ▼</th>
                  <th>File Name</th>
                  <th>Action</th>
                  <th>User</th>
                  <th>Date & Time</th>
                  <th>Department</th>
                  <th>Company</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {displayedMovements.length > 0 ? (
                  displayedMovements.map((movement, index) => (
                    <tr key={movement.id}>
                      <td>{startEntry + index}</td>
                      <td>{movement.fileId}</td>
                      <td>{movement.fileName}</td>
                      <td>
                        <span className={`action-badge ${movement.action.toLowerCase().replace('-', '')}`}>
                          {movement.action}
                        </span>
                      </td>
                      <td>{movement.user}</td>
                      <td>{movement.dateTime}</td>
                      <td>{movement.department}</td>
                      <td>{movement.company}</td>
                      <td>{movement.details}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer-controls">
            <div className="entries-info">
              Showing {startEntry} to {endEntry} of {filteredMovements.length} entries
            </div>
            <div className="pagination">
              <button 
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {getPageNumbers().map(num => (
                <button 
                  key={num}
                  className={`page-btn ${currentPage === num ? 'active' : ''}`}
                  onClick={() => handlePageChange(num)}
                >
                  {num}
                </button>
              ))}
              <button 
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>

          <div className="records-info">
            <div className="info-box">
              ℹ️ Showing {filteredMovements.length} records
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MovementHistoryPage;
