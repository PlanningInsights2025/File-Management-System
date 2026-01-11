import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Login from './pages/Login';
import DashboardPage from './pages/DashboardPage';
import FilesPage from './pages/FilesPage';
import CreateFilePage from './pages/CreateFilePage';
import PrintPreview from './pages/PrintPreview';
import ManagementPage from './pages/ManagementPage';
import ReportsPage from './pages/ReportsPage';
import BarcodePage from './pages/BarcodePage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import MovementHistoryPage from './pages/MovementHistoryPage';
import ScanFilePage from './pages/ScanFilePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setLoading(false);
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <UserProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/files" element={
            <ProtectedRoute>
              <FilesPage />
            </ProtectedRoute>
          } />
          
          <Route path="/files/create" element={
            <ProtectedRoute>
              <CreateFilePage />
            </ProtectedRoute>
          } />
          
              <Route path="/files/edit/:id" element={
                <ProtectedRoute>
                  <EditFilePage />
                </ProtectedRoute>
              } />
          
          <Route path="/print-preview" element={
            <ProtectedRoute>
              <PrintPreview />
            </ProtectedRoute>
          } />
          
          <Route path="/barcode" element={
            <ProtectedRoute>
              <BarcodePage />
            </ProtectedRoute>
          } />
          
          <Route path="/management" element={
            <ProtectedRoute>
              <ManagementPage />
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/files/movement" element={
            <ProtectedRoute>
              <MovementHistoryPage />
            </ProtectedRoute>
          } />
          
          <Route path="/scan-file" element={
            <ProtectedRoute>
              <ScanFilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
    </UserProvider>
  );
}

    import EditFilePage from './pages/EditFilePage';
export default App;