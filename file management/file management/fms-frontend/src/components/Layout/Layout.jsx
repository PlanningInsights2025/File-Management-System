import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import '../../styles/layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="sidebar-overlay active" onClick={closeSidebar}></div>}
      <div className="main-wrapper">
        <Header onMenuClick={toggleSidebar} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;