import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import FilterListIcon from '@mui/icons-material/FilterList';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import '../styles/reports.css';

const ReportsPage = () => {
  const [activeReport, setActiveReport] = useState('movement');
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-23',
  });
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [lastGenerated, setLastGenerated] = useState(null);
  const [reportData, setReportData] = useState(null);

  const reports = [
    { id: 'movement', label: 'File Movement', icon: <AssessmentIcon /> },
    { id: 'overdue', label: 'Overdue Files', icon: <AssessmentIcon /> },
    { id: 'usage', label: 'File Usage', icon: <AssessmentIcon /> },
    { id: 'audit', label: 'Audit Trail', icon: <AssessmentIcon /> },
    { id: 'user', label: 'User Activity', icon: <AssessmentIcon /> },
    { id: 'company', label: 'Company Reports', icon: <AssessmentIcon /> },
    { id: 'all', label: 'All Reports', icon: <AssessmentIcon /> },
  ];

  const handleExport = () => {
    if (!reportData) {
      alert('No report generated yet. Click "Generate Report" first.');
      return;
    }
    // Build CSV depending on activeReport
    const buildCSV = (rows, headers) => {
      const hdr = headers.join(',') + '\n';
      const body = rows.map(r => headers.map(h => (`"${(r[h] ?? '')}"`)).join(',')).join('\n');
      return hdr + body;
    };

    let csv = '';
    if (activeReport === 'movement' && reportData.movement) {
      const rows = reportData.movement.rows || [];
      csv = buildCSV(rows, ['date','ins','outs','transfers','total']);
    } else if (activeReport === 'overdue' && reportData.overdue) {
      csv = buildCSV(reportData.overdue.rows || [], ['id','title','user','issued','expected','overdue','dept']);
    } else if (activeReport === 'all' && reportData.all) {
      csv = 'Report,Key,Value\n';
      Object.entries(reportData.all).forEach(([k,v]) => {
        csv += `${k},summary,${v.summary}\n`;
      });
    } else {
      csv = 'key,value\n';
      Object.entries(reportData || {}).forEach(([k,v]) => { csv += `${k},${JSON.stringify(v)}\n`; });
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeReport || 'report'}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    alert('CSV exported');
  };

  const handlePrint = () => {
    window.print();
  };

  const renderTabContent = () => {
    switch (activeReport) {
      case 'all':
        return <AllReports data={reportData} generatedAt={lastGenerated} />;
      case 'movement':
        return <MovementReport dateRange={dateRange} company={selectedCompany} generatedAt={lastGenerated} data={reportData} />;
      case 'overdue':
        return <OverdueReport dateRange={dateRange} company={selectedCompany} generatedAt={lastGenerated} data={reportData} />;
      case 'usage':
        return <UsageReport dateRange={dateRange} company={selectedCompany} generatedAt={lastGenerated} data={reportData} />;
      case 'audit':
        return <AuditReport dateRange={dateRange} company={selectedCompany} generatedAt={lastGenerated} data={reportData} />;
      case 'user':
        return <UserReport dateRange={dateRange} company={selectedCompany} generatedAt={lastGenerated} data={reportData} />;
      case 'company':
        return <CompanyReport dateRange={dateRange} company={selectedCompany} generatedAt={lastGenerated} data={reportData} />;
      default:
        return <MovementReport dateRange={dateRange} company={selectedCompany} generatedAt={lastGenerated} data={reportData} />;
    }
  };

  // Generate mock report data for the selected report (or all)
  const generateReport = (reportId) => {
    const now = new Date();
    setLastGenerated(now);
    let data = null;
    if (reportId === 'movement') {
      const rows = [
        { date: dateRange.end, ins: 45, outs: 32, transfers: 8, total: 85 },
        { date: dateRange.start, ins: 38, outs: 41, transfers: 12, total: 91 },
      ];
      data = { movement: { summary: { totalIn: 291, totalOut: 250, transfers: 63 }, rows } };
    } else if (reportId === 'overdue') {
      const rows = [
        { id: 'FMS-1024', title: 'Annual Budget', user: 'John Doe', issued: '2024-01-10', expected: '2024-01-17', overdue: 6, dept: 'Finance' },
      ];
      data = { overdue: { summary: { overdueCount: 23 }, rows } };
    } else if (reportId === 'usage') {
      data = { usage: { summary: { totalFiles: 1247, active: 342, inStorage: 905 } } };
    } else if (reportId === 'audit') {
      data = { audit: { summary: { events: 125 }, rows: [] } };
    } else if (reportId === 'user') {
      data = { user: { summary: { activeUsers: 120 }, rows: [] } };
    } else if (reportId === 'company') {
      data = { company: { summary: { companies: 4 }, rows: [] } };
    } else if (reportId === 'all') {
      data = {
        all: {
          movement: { summary: { totalIn: 291 } },
          overdue: { summary: { overdueCount: 23 } },
          usage: { summary: { totalFiles: 1247 } },
          audit: { summary: { events: 125 } },
          user: { summary: { activeUsers: 120 } },
          company: { summary: { companies: 4 } },
        }
      };
    }
    setReportData(data);
    alert('Report generated');
  };

  return (
    <Layout>
      <div className="reports-page">
        <div className="page-header">
          <div className="header-left">
            <AssessmentIcon className="page-icon" />
            <div>
              <h2>Reports & Analytics</h2>
              <p className="page-subtitle">Generate insights and analytics on file management</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={handleExport}>
              <DownloadIcon /> Export
            </button>
            <button className="btn btn-secondary" onClick={handlePrint}>
              <PrintIcon /> Print
            </button>
          </div>
        </div>

        <div className="reports-controls">
          <div className="report-types">
            {reports.map((report) => (
              <button
                key={report.id}
                className={`report-type ${activeReport === report.id ? 'active' : ''}`}
                onClick={() => setActiveReport(report.id)}
              >
                {report.icon}
                <span>{report.label}</span>
              </button>
            ))}
          </div>

          <div className="report-filters">
            <div className="filter-item">
              <CalendarTodayIcon />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="date-input"
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="date-input"
              />
            </div>

            <div className="filter-item">
              <FilterListIcon />
              <select className="filter-select" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
                <option value="all">All Companies</option>
                <option value="Company A">Company A</option>
                <option value="Company B">Company B</option>
                <option value="Company C">Company C</option>
                <option value="Company D">Company D</option>
              </select>
            </div>

            <button className="btn btn-primary" onClick={() => generateReport(activeReport)}>
              Generate Report
            </button>
          </div>
        </div>

        <div className="report-content">
          {renderTabContent()}
        </div>
      </div>
    </Layout>
  );
};

// Report Components
const MovementReport = ({ dateRange, company, generatedAt, data }) => {
  const defaultMovements = [
    { date: '2024-01-23', ins: 45, outs: 32, transfers: 8 },
    { date: '2024-01-22', ins: 38, outs: 41, transfers: 12 },
    { date: '2024-01-21', ins: 52, outs: 28, transfers: 6 },
  ];

  const movement = data?.movement;
  const rows = movement?.rows || defaultMovements;
  const summary = movement?.summary || { totalIn: 291, totalOut: 250, transfers: 63, totalMovements: 604 };

  return (
    <div className="report-card">
      <div className="report-header">
        <h3>File Movement Report</h3>
        <span className="report-period">{dateRange ? `${dateRange.start} to ${dateRange.end}` : 'Period'}</span>
        {company && company !== 'all' && <small className="report-filter">Company: {company}</small>}
        {generatedAt && <small className="report-generated">Generated: {new Date(generatedAt).toLocaleString()}</small>}
      </div>

      <div className="report-stats">
        <div className="stat-card">
          <div className="stat-value">{summary.totalIn}</div>
          <div className="stat-label">Total IN</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.totalOut}</div>
          <div className="stat-label">Total OUT</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.transfers}</div>
          <div className="stat-label">Transfers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.totalMovements}</div>
          <div className="stat-label">Total Movements</div>
        </div>
      </div>

      <div className="report-table">
        <table className="table">
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
            {rows.map((movement, index) => (
              <tr key={index}>
                <td>{movement.date}</td>
                <td>{movement.ins}</td>
                <td>{movement.outs}</td>
                <td>{movement.transfers}</td>
                <td>
                  <strong>{(movement.ins || 0) + (movement.outs || 0) + (movement.transfers || 0)}</strong>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>{summary.totalIn}</strong></td>
              <td><strong>{summary.totalOut}</strong></td>
              <td><strong>{summary.transfers}</strong></td>
              <td><strong>{summary.totalMovements}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const OverdueReport = ({ dateRange, company, generatedAt, data }) => (
  <div className="report-card">
    <div className="report-header">
      <h3>Overdue Files Report</h3>
      <span className="report-period">As of {dateRange ? dateRange.end : 'today'}</span>
      {company && company !== 'all' && <small className="report-filter">Company: {company}</small>}
      {generatedAt && <small className="report-generated">Generated: {new Date(generatedAt).toLocaleString()}</small>}
    </div>

    <div className="report-stats">
      <div className="stat-card danger">
        <div className="stat-value">23</div>
        <div className="stat-label">Overdue Files</div>
      </div>
      <div className="stat-card warning">
        <div className="stat-value">5</div>
        <div className="stat-label">&gt; 7 days overdue</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">12</div>
        <div className="stat-label">Avg overdue days</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">HR</div>
        <div className="stat-label">Top Department</div>
      </div>
    </div>

      <div className="report-table">
        <table className="table">
          <thead>
            <tr>
              <th>File ID</th>
              <th>File Title</th>
              <th>Issued To</th>
              <th>Issued Date</th>
              <th>Expected Return</th>
              <th>Days Overdue</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {(data?.overdue?.rows || [
              { id: 'FMS-1024', title: 'Annual Budget', user: 'John Doe', issued: '2024-01-10', expected: '2024-01-17', overdue: 6, dept: 'Finance' },
            ]).map((file, index) => (
              <tr key={index} className={file.overdue > 7 ? 'danger-row' : ''}>
                <td><strong>{file.id}</strong></td>
                <td>{file.title}</td>
                <td>{file.user}</td>
                <td>{file.issued}</td>
                <td>{file.expected}</td>
                <td>
                  <span className={`overdue-badge ${file.overdue > 7 ? 'danger' : 'warning'}`}>
                    {file.overdue} days
                  </span>
                </td>
                <td>{file.dept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  </div>
);

const UsageReport = ({ dateRange, company, generatedAt, data }) => {
  const summary = data?.usage?.summary || { totalFiles: 1247, active: 342, inStorage: 905, storageUsed: '74%' };
  const filesByCompany = data?.usage?.byCompany || [
    { name: 'Company A', value: 420, color: '#3498db' },
    { name: 'Company B', value: 380, color: '#2ecc71' },
    { name: 'Company C', value: 210, color: '#e74c3c' },
    { name: 'Company D', value: 150, color: '#f39c12' },
  ];

  return (
    <div className="report-card">
      <div className="report-header">
        <h3>File Usage Statistics</h3>
        <span className="report-period">{dateRange ? `${dateRange.start} to ${dateRange.end}` : ''}</span>
        {company && company !== 'all' && <small className="report-filter">Company: {company}</small>}
        {generatedAt && <small className="report-generated">Generated: {new Date(generatedAt).toLocaleString()}</small>}
      </div>

      <div className="report-stats">
        <div className="stat-card">
          <div className="stat-value">{summary.totalFiles}</div>
          <div className="stat-label">Total Files</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.active}</div>
          <div className="stat-label">Active (OUT)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.inStorage}</div>
          <div className="stat-label">In Storage</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.storageUsed}</div>
          <div className="stat-label">Storage Used</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h4>Files by Company</h4>
          <div className="chart-placeholder">
            {filesByCompany.map((c, i) => (
              <div key={i} className="chart-bar" style={{ height: `${(c.value / filesByCompany[0].value) * 100}%`, backgroundColor: c.color }}>{c.name} ({c.value})</div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h4>Files by Department</h4>
          <div className="department-stats">
            {(data?.usage?.byDept || [
              { dept: 'HR', count: 320, color: '#3498db' },
              { dept: 'Finance', count: 280, color: '#2ecc71' },
              { dept: 'Operations', count: 240, color: '#e74c3c' },
              { dept: 'IT', count: 180, color: '#f39c12' },
              { dept: 'Legal', count: 150, color: '#9b59b6' },
            ]).map((dept, index) => (
              <div key={index} className="department-item">
                <div className="dept-info">
                  <span className="dept-name">{dept.dept}</span>
                  <span className="dept-count">{dept.count} files</span>
                </div>
                <div className="dept-bar">
                  <div 
                    className="dept-fill"
                    style={{ 
                      width: `${(dept.count / (data?.usage?.maxDept || 320)) * 100}%`,
                      backgroundColor: dept.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AuditReport = ({ dateRange, company, generatedAt, data }) => {
  const rows = data?.audit?.rows || [
    { time: '2024-01-23 10:30', user: 'admin', action: 'LOGIN', file: 'N/A', details: 'Successful login', ip: '192.168.1.100' },
  ];
  const summary = data?.audit?.summary || { events: rows.length };
  return (
    <div className="report-card">
      <div className="report-header">
        <h3>Audit Trail Report</h3>
        <span className="report-period">{dateRange ? `${dateRange.start} to ${dateRange.end}` : ''}</span>
        {company && company !== 'all' && <small className="report-filter">Company: {company}</small>}
        {generatedAt && <small className="report-generated">Generated: {new Date(generatedAt).toLocaleString()}</small>}
      </div>

      <div className="report-stats">
        <div className="stat-card">
          <div className="stat-value">{summary.events}</div>
          <div className="stat-label">Audit Events</div>
        </div>
      </div>

      <div className="report-table">
        <table className="table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>File ID</th>
              <th>Details</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((audit, index) => (
              <tr key={index}>
                <td>{audit.time}</td>
                <td>{audit.user}</td>
                <td>
                  <span className={`audit-action ${audit.action.toLowerCase()}`}>
                    {audit.action}
                  </span>
                </td>
                <td>{audit.file}</td>
                <td>{audit.details}</td>
                <td><code>{audit.ip}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserReport = ({ dateRange, company, generatedAt, data }) => {
  const rows = data?.user?.rows || [
    { user: 'admin', role: 'Admin', company: 'All', created: 45, out: 12, in: 8, actions: 65, last: '2024-01-23 10:30' },
  ];
  const summary = data?.user?.summary || { activeUsers: rows.length };
  return (
    <div className="report-card">
      <div className="report-header">
        <h3>User Activity Report</h3>
        <span className="report-period">{dateRange ? `${dateRange.start} to ${dateRange.end}` : ''}</span>
        {company && company !== 'all' && <small className="report-filter">Company: {company}</small>}
        {generatedAt && <small className="report-generated">Generated: {new Date(generatedAt).toLocaleString()}</small>}
      </div>

      <div className="report-stats">
        <div className="stat-card">
          <div className="stat-value">{summary.activeUsers}</div>
          <div className="stat-label">Active Users</div>
        </div>
      </div>

      <div className="report-table">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Company</th>
              <th>Files Created</th>
              <th>Files Checked Out</th>
              <th>Files Checked In</th>
              <th>Total Actions</th>
              <th>Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user, index) => (
              <tr key={index}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.user.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <strong>{user.user}</strong>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`role-badge role-${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.company}</td>
                <td>{user.created}</td>
                <td>{user.out}</td>
                <td>{user.in}</td>
                <td><strong>{user.actions}</strong></td>
                <td>{user.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CompanyReport = ({ dateRange, company, generatedAt, data }) => {
  const rows = data?.company?.rows || [
    { company: 'Company A', files: 420, active: 120, overdue: 8, users: 15, racks: 12, storage: '85%', last: '2024-01-23' },
    { company: 'Company B', files: 380, active: 95, overdue: 5, users: 12, racks: 10, storage: '78%', last: '2024-01-23' },
    { company: 'Company C', files: 210, active: 45, overdue: 3, users: 8, racks: 6, storage: '65%', last: '2024-01-22' },
    { company: 'Company D', files: 150, active: 25, overdue: 2, users: 5, racks: 4, storage: '45%', last: '2024-01-21' },
  ];
  return (
    <div className="report-card">
      <div className="report-header">
        <h3>Company-wise Report</h3>
        <span className="report-period">{dateRange ? `${dateRange.start} to ${dateRange.end}` : ''}</span>
        {company && company !== 'all' && <small className="report-filter">Filtered: {company}</small>}
        {generatedAt && <small className="report-generated">Generated: {new Date(generatedAt).toLocaleString()}</small>}
      </div>

      <div className="report-table">
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Total Files</th>
              <th>Active Files</th>
              <th>Overdue Files</th>
              <th>Total Users</th>
              <th>Total Racks</th>
              <th>Storage Used</th>
              <th>Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((companyRow, index) => (
              <tr key={index}>
                <td>
                  <strong>{companyRow.company}</strong>
                </td>
                <td>{companyRow.files}</td>
                <td>{companyRow.active}</td>
                <td>
                  {companyRow.overdue > 0 ? (
                    <span className="overdue-badge warning">{companyRow.overdue}</span>
                  ) : (
                    companyRow.overdue
                  )}
                </td>
                <td>{companyRow.users}</td>
                <td>{companyRow.racks}</td>
                <td>
                  <div className="storage-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: companyRow.storage }}
                      ></div>
                    </div>
                    <span>{companyRow.storage}</span>
                  </div>
                </td>
                <td>{companyRow.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AllReports = ({ data, generatedAt }) => {
  const items = data?.all || {};
  return (
    <div className="report-card">
      <div className="report-header">
        <h3>All Reports Summary</h3>
        {generatedAt && <small className="report-generated">Generated: {new Date(generatedAt).toLocaleString()}</small>}
      </div>
      <div className="report-stats">
        {Object.entries(items).map(([k,v]) => (
          <div className="stat-card" key={k}>
            <div className="stat-value">{v.summary ? Object.values(v.summary)[0] : '-'}</div>
            <div className="stat-label">{k}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;