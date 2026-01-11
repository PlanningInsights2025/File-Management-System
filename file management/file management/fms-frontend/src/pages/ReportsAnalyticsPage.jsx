import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';
import '../styles/reportsAnalytics.css';

const ReportsAnalyticsPage = () => {
  const [activeReportType, setActiveReportType] = useState('File Movement');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [companyFilter, setCompanyFilter] = useState('Company C');
  const [loading, setLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  const [reportData, setReportData] = useState({
    totalIn: 0,
    totalOut: 0,
    transfers: 0,
    totalMovements: 0,
    records: []
  });

  const reportTypes = [
    { id: 1, icon: '📊', label: 'File Movement', value: 'File Movement' },
    { id: 2, icon: '⚠️', label: 'Overdue Files', value: 'Overdue Files' },
    { id: 3, icon: '📈', label: 'File Usage', value: 'File Usage' },
    { id: 4, icon: '🔍', label: 'Audit Trail', value: 'Audit Trail' },
    { id: 5, icon: '👤', label: 'User Activity', value: 'User Activity' },
    { id: 6, icon: '🏢', label: 'Company Reports', value: 'Company Reports' }
  ];

  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(2024, 0, 1);
    setStartDate('2024-01-01');
    setEndDate('2024-01-23');
  }, []);

  const generateMockData = () => {
    const records = [
      { date: '2024-01-23', filesIn: 45, filesOut: 32, transfers: 8, total: 85 },
      { date: '2024-01-22', filesIn: 38, filesOut: 41, transfers: 12, total: 91 },
      { date: '2024-01-21', filesIn: 52, filesOut: 28, transfers: 6, total: 86 },
      { date: '2024-01-20', filesIn: 41, filesOut: 35, transfers: 9, total: 85 },
      { date: '2024-01-19', filesIn: 33, filesOut: 29, transfers: 7, total: 69 },
      { date: '2024-01-18', filesIn: 47, filesOut: 38, transfers: 11, total: 96 },
      { date: '2024-01-17', filesIn: 35, filesOut: 47, transfers: 10, total: 92 }
    ];

    const totalIn = records.reduce((sum, r) => sum + r.filesIn, 0);
    const totalOut = records.reduce((sum, r) => sum + r.filesOut, 0);
    const transfers = records.reduce((sum, r) => sum + r.transfers, 0);
    const totalMovements = records.reduce((sum, r) => sum + r.total, 0);

    return { totalIn, totalOut, transfers, totalMovements, records };
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = generateMockData();
      setReportData(data);
      setReportGenerated(true);
      toast.success(`✅ ${activeReportType} Report generated successfully!`);
    } catch (error) {
      toast.error('❌ Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!reportGenerated) {
      toast.warning('⚠️ Please generate a report first');
      return;
    }

    try {
      const worksheetData = reportData.records.map(r => ({
        'Date': r.date,
        'Files IN': r.filesIn,
        'Files OUT': r.filesOut,
        'Transfers': r.transfers,
        'Total': r.total
      }));

      worksheetData.push({
        'Date': 'TOTAL',
        'Files IN': reportData.totalIn,
        'Files OUT': reportData.totalOut,
        'Transfers': reportData.transfers,
        'Total': reportData.totalMovements
      });

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

      worksheet['!cols'] = [
        { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }
      ];

      const fileName = `${activeReportType.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      toast.success('📊 Excel file downloaded successfully!');
    } catch (error) {
      toast.error('❌ Failed to export to Excel');
    }
  };

  const handleExportPDF = () => {
    if (!reportGenerated) {
      toast.warning('⚠️ Please generate a report first');
      return;
    }

    try {
      const doc = new jsPDF();
      
      doc.setFontSize(24);
      doc.setTextColor(74, 144, 226);
      doc.text(`${activeReportType} Report`, 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`Period: ${startDate} to ${endDate}`, 14, 32);
      doc.text(`Company: ${companyFilter}`, 14, 40);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 48);
      
      doc.autoTable({
        startY: 56,
        head: [['Date', 'Files IN', 'Files OUT', 'Transfers', 'Total']],
        body: [
          ...reportData.records.map(r => [r.date, r.filesIn, r.filesOut, r.transfers, r.total]),
          ['TOTAL', reportData.totalIn, reportData.totalOut, reportData.transfers, reportData.totalMovements]
        ],
        headStyles: {
          fillColor: [74, 144, 226],
          fontSize: 11,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        }
      });
      
      const fileName = `${activeReportType.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('📄 PDF file downloaded successfully!');
    } catch (error) {
      toast.error('❌ Failed to export to PDF');
    }
  };

  const handlePrint = () => {
    if (!reportGenerated) {
      toast.warning('⚠️ Please generate a report first');
      return;
    }
    window.print();
    toast.success('🖨️ Print dialog opened');
  };

  const handleEmail = () => {
    if (!reportGenerated) {
      toast.warning('⚠️ Please generate a report first');
      return;
    }

    const subject = `${activeReportType} Report - ${companyFilter}`;
    const body = `Report Summary:\n\nType: ${activeReportType} Report\nPeriod: ${startDate} to ${endDate}\nCompany: ${companyFilter}\n\nTotal IN: ${reportData.totalIn}\nTotal OUT: ${reportData.totalOut}\nTransfers: ${reportData.transfers}\nTotal Movements: ${reportData.totalMovements}`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.info('📧 Opening email client...');
  };

  return (
    <Layout>
      <div className="reports-page">
        <div className="reports-container">
          
          {/* Section 1: Report Type Selection */}
          <div className="report-selection-section">
            <div className="report-types-grid">
              {reportTypes.map(type => (
                <button
                  key={type.id}
                  className={`report-type-btn ${activeReportType === type.value ? 'active' : ''}`}
                  onClick={() => setActiveReportType(type.value)}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
            <button className="all-reports-link">📑 All Reports</button>
          </div>

          {/* Section 2: Filters Section */}
          <div className="filters-section">
            <div className="filters-row">
              <div className="filter-group">
                <label className="filter-label">📅 Date Range</label>
                <div className="date-range-wrapper">
                  <input 
                    type="date" 
                    className="date-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <span className="date-separator">to</span>
                  <input 
                    type="date" 
                    className="date-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="filter-group">
                <label className="filter-label">🏢 Company</label>
                <select 
                  className="company-select"
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                >
                  <option>All Companies</option>
                  <option>Company C</option>
                  <option>ABC Corporation</option>
                  <option>XYZ Enterprises</option>
                  <option>Tech Innovators Inc</option>
                </select>
              </div>
              
              <button 
                className="generate-btn"
                onClick={handleGenerateReport}
                disabled={loading}
              >
                {loading ? '⏳ Generating...' : '📊 Generate Report'}
              </button>
            </div>
          </div>

          {/* Section 3: Generated Report Display */}
          {reportGenerated ? (
            <div className="report-display-section">
              
              {/* Report Header */}
              <div className="report-header">
                <div className="report-title-area">
                  <h1>{activeReportType} Report</h1>
                  <p className="report-date-info">{startDate} to {endDate}</p>
                </div>
                <div className="report-meta">
                  <span className="company-badge">Company: {companyFilter}</span>
                </div>
              </div>

              {/* Summary Statistics */}
              <div className="summary-statistics">
                <div className="stat-card blue">
                  <div className="stat-number">{reportData.totalIn}</div>
                  <div className="stat-label">Total In</div>
                </div>
                <div className="stat-card purple">
                  <div className="stat-number">{reportData.totalOut}</div>
                  <div className="stat-label">Total Out</div>
                </div>
                <div className="stat-card teal">
                  <div className="stat-number">{reportData.transfers}</div>
                  <div className="stat-label">Transfers</div>
                </div>
                <div className="stat-card orange">
                  <div className="stat-number">{reportData.totalMovements}</div>
                  <div className="stat-label">Total Movements</div>
                </div>
              </div>

              {/* Report Table */}
              <div className="report-table-wrapper">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Files IN</th>
                      <th>Files OUT</th>
                      <th>Transfers</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.records.map((record, index) => (
                      <tr key={index}>
                        <td>{record.date}</td>
                        <td>{record.filesIn}</td>
                        <td>{record.filesOut}</td>
                        <td>{record.transfers}</td>
                        <td>{record.total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Total</td>
                      <td>{reportData.totalIn}</td>
                      <td>{reportData.totalOut}</td>
                      <td>{reportData.transfers}</td>
                      <td className="grand-total">{reportData.totalMovements}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Export Section */}
              <div className="export-section">
                <div className="export-info">
                  Generated on: {new Date().toLocaleString()}
                </div>
                <div className="export-buttons-group">
                  <button className="export-btn excel-btn" onClick={handleExportExcel}>
                    📊 Export Excel
                  </button>
                  <button className="export-btn pdf-btn" onClick={handleExportPDF}>
                    📄 Export PDF
                  </button>
                  <button className="export-btn print-btn" onClick={handlePrint}>
                    🖨️ Print
                  </button>
                  <button className="export-btn email-btn" onClick={handleEmail}>
                    📧 Email
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state-section">
              <div className="empty-state-icon">📊</div>
              <h3 className="empty-state-title">No Report Generated</h3>
              <p className="empty-state-text">
                Select a report type, configure filters, and click "Generate Report" to view your data.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ReportsAnalyticsPage;
