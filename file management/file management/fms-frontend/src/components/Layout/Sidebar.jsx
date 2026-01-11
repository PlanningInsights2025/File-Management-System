import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ListAltIcon from '@mui/icons-material/ListAlt';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import FolderIcon from '@mui/icons-material/Folder';
import '../../styles/layout.css';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const location = useLocation();
  const menuItems = [
    { path: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard', match: (pathname) => pathname === '/dashboard' },
    { path: '/files/create', icon: <CreateNewFolderIcon />, label: 'Create File', match: (pathname) => pathname === '/files/create' },
    { path: '/files', icon: <ListAltIcon />, label: 'File List', match: (pathname) => pathname === '/files' || pathname.startsWith('/files/') && pathname !== '/files/create' && pathname !== '/files/movement' },
    { path: '/barcode', icon: <QrCodeScannerIcon />, label: 'Scan File', match: (pathname) => pathname === '/barcode' },
    { path: '/files/movement', icon: <HistoryIcon />, label: 'Movement History', match: (pathname) => pathname === '/files/movement' },
    { path: '/reports', icon: <AssessmentIcon />, label: 'Reports', match: (pathname) => pathname === '/reports' },
    { path: '/management', icon: <FolderIcon />, label: 'Management', match: (pathname) => pathname === '/management' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handleNavClick = () => {
    // Close sidebar on mobile after clicking a link
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <FolderIcon className="logo-icon" />
          <div className="logo-content">
            <span className="logo-title">FMS</span>
            <span className="logo-subtitle">File Management System</span>
          </div>
        </div>
        {/* Mobile close button */}
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close Sidebar">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            end
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
        {/* Logout Button */}
        {/* <button className="nav-link logout-btn" onClick={handleLogout}>
          <span className="nav-icon"><LogoutIcon /></span>
          <span className="nav-label">Logout</span>
        </button> */}
      </nav>
    </aside>
  );
};

export default Sidebar;