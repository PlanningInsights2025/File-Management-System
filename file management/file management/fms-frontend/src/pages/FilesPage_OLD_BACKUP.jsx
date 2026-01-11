import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import FolderIcon from '@mui/icons-material/Folder';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DescriptionIcon from '@mui/icons-material/Description';
import ArchiveIcon from '@mui/icons-material/Archive';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RefreshIcon from '@mui/icons-material/Refresh';
import '../styles/fileList.css';

const FilesPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    company: 'all',
    rack: 'all',
  });
  const [files, setFiles] = useState([]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleFileAdded = (fileData) => {
    // normalize fields from FileForm (fileTitle -> title) and add to local list
    const normalized = {
      ...fileData,
      title: fileData.title || fileData.fileTitle || '',
    };
    setFiles(prev => [normalized, ...prev]);
    setShowAddModal(false);
    setSelectedFile(normalized);
    try { printBarcodeAndIndex(normalized); } catch (e) { console.error(e); }
  };

  const handleDelete = (fileId) => {
    if (!window.confirm('Delete this file?')) return;
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile?.id === fileId) setSelectedFile(null);
  };

  const handleEdit = (updated) => {
    setFiles(prev => prev.map(f => f.id === updated.id ? { ...f, ...updated } : f));
  };

  const handleToggleMovement = (fileId, action) => {
    setFiles(prev => prev.map(f => {
      if (f.id !== fileId) return f;
      const newStatus = action === 'out' ? 'out' : 'in';
      return { ...f, status: newStatus, lastMovement: new Date().toISOString().split('T')[0] };
    }));
  };

  const handleGenerateBarcode = (fileId) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i=0;i<12;i++) code += chars.charAt(Math.floor(Math.random()*chars.length));
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, barcode: code } : f));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter, value) => {
    setFilters({
      ...filters,
      [filter]: value,
    });
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting files...');
  };

  const handlePrint = () => {
    // If a file is selected, print its barcode cover + index pages.
    if (!selectedFile) {
      alert('Select a file first to print its barcode and index.');
      return;
    }
    try {
      printBarcodeAndIndex(selectedFile);
    } catch (err) {
      console.error('Print error', err);
      alert('Unable to print barcode. See console for details.');
    }
  };

  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function printBarcodeAndIndex(file) {
    const code = file.barcode || file.id || '';
    const html = `
      <html>
        <head>
          <title>Print Barcode & Index - ${file.id}</title>
          <meta charset="utf-8" />
          <style>
            @media print { .page { page-break-after: always } }
            @page a5 { size: A5 }
            @page a4 { size: A4 }
            body { margin:0; font-family: Arial, sans-serif; color: #111 }
            .a5 { width:148mm; height:210mm; padding:18mm; box-sizing:border-box }
            .a4 { width:210mm; height:297mm; padding:16mm; box-sizing:border-box }
            .print-header { display:flex; justify-content:space-between; align-items:flex-start }
            .print-barcode-top { text-align:right }
            .barcode-svg { width:320px; height:80px }
            .barcode-caption { font-weight:700; margin-top:6px }
            .print-title { margin-top:12px; font-size:18px; font-weight:700 }
            .print-meta { margin-top:12px; width:100%; max-width:460px }
            .print-meta dt { font-weight:700; margin-top:6px }
            .print-meta dd { margin:0 0 8px 0 }
            .index-header { display:flex; align-items:center; gap:12px }
            .index-table { width:100%; border-collapse:collapse; margin-top:12px }
            .index-table th, .index-table td { border:1px solid #ccc; padding:8px; text-align:left }
            .blank-lines { margin-top:12px; min-height:120px; border-top:1px dashed #eee; padding-top:8px }
          </style>
        </head>
        <body>
          <div class="page a5">
            <div class="print-header">
              <div style="flex:1">
                <!-- left column: labels -->
              </div>
              <div class="print-barcode-top">
                <svg id="barcode1" class="barcode-svg"></svg>
                <div class="barcode-caption">${escapeHtml(code)}</div>
              </div>
            </div>

            <div class="print-title">${escapeHtml(file.title)}</div>

            <dl class="print-meta">
              <dt>Name of the File</dt><dd>${escapeHtml(file.title)}</dd>
              <dt>Company</dt><dd>${escapeHtml(file.company || '')}</dd>
              <dt>Created By</dt><dd>${escapeHtml(file.preparedBy || '')}</dd>
              <dt>File Location</dt><dd>${escapeHtml(file.rack || '')}</dd>
              <dt>Creation Date</dt><dd>${escapeHtml(file.createdAt || '')}</dd>
              <dt>Purpose</dt><dd>${escapeHtml(file.purpose || '')}</dd>
            </dl>
          </div>

          <div class="page a4">
            <div class="index-header">
              <svg id="barcode2" style="width:180px;height:60px"></svg>
              <div>
                <h3 style="margin:0">Index: ${escapeHtml(file.title)}</h3>
                <div style="color:#666">File ID: ${escapeHtml(file.id)}</div>
              </div>
            </div>

            <h4 style="margin-top:18px">Contents / Index</h4>
            <table class="index-table">
              <thead>
                <tr><th style="width:60px">Page</th><th>Section</th><th>Notes</th></tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>Barcode / Cover</td><td></td></tr>
                <tr><td>2</td><td>Index</td><td></td></tr>
                <tr><td>3</td><td>Documents</td><td></td></tr>
              </tbody>
            </table>

            <div class="blank-lines">
              <p style="margin:8px 0">&nbsp;</p>
              <p style="margin:8px 0">&nbsp;</p>
              <p style="margin:8px 0">&nbsp;</p>
              <p style="margin:8px 0">&nbsp;</p>
            </div>
          </div>

          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script>
            (function(){
              var code = ${JSON.stringify(code)};
              function render(){
                try{
                  JsBarcode('#barcode1', code, {format: 'CODE128', displayValue: false, height:60, width:2});
                  JsBarcode('#barcode2', code, {format: 'CODE128', displayValue: true, height:50, width:2});
                }catch(e){console.error(e)}
              }
              if (window.JsBarcode) { render(); window.print(); window.close(); }
              else { document.addEventListener('DOMContentLoaded', function(){ render(); setTimeout(function(){ window.print(); window.close(); }, 600); }); }
            })();
          </script>
        </body>
      </html>
    `;

    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
  }

  return (
    <Layout>
      <div className="files-page">
        <div className="page-header">
          <h2>File Management</h2>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <AddIcon /> Create New File
            </button>
            <button className="btn btn-secondary" onClick={handleExport}>
              <DownloadIcon /> Export
            </button>
            <button className="btn btn-secondary" onClick={handlePrint}>
              <PrintIcon /> Print
            </button>
          </div>
        </div>

        <div className="search-filters">
          <div className="search-box">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by File ID, Name, or Barcode..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <div className="filter-item">
              <FilterListIcon />
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="in">IN</option>
                <option value="out">OUT</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            
            <div className="filter-item">
              <select
                value={filters.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Companies</option>
                <option value="company1">Company A</option>
                <option value="company2">Company B</option>
                <option value="company3">Company C</option>
              </select>
            </div>
            
            <div className="filter-item">
              <select
                value={filters.rack}
                onChange={(e) => handleFilterChange('rack', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Racks</option>
                <option value="rack-a">Rack A</option>
                <option value="rack-b">Rack B</option>
                <option value="rack-c">Rack C</option>
              </select>
            </div>
          </div>
        </div>

        <div className="content-grid">
          <div className="content-main">
            <FileList
              files={files}
              searchTerm={searchTerm}
              filters={filters}
              onFileSelect={handleFileSelect}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onMovement={handleToggleMovement}
              onBarcode={(fileId) => {
                const f = files.find(x => x.id === fileId);
                if (f) printBarcodeAndIndex(f);
              }}
            />
          </div>
          
          {selectedFile && (
            <div className="content-sidebar">
              <FileDetails file={selectedFile} />
            </div>
          )}
        </div>

        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content modal-lg">
              <div className="modal-header">
                <h3 className="modal-title">Create New File</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowAddModal(false)}
                >
                  ×
                </button>
              </div>
              <FileForm onSuccess={handleFileAdded} onCancel={() => setShowAddModal(false)} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FilesPage;