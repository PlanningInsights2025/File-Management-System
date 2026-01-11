
import React, { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/Common/Modal';
import '../styles/notifications.css';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};


export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [openDetail, setOpenDetail] = useState(null); // notification object or null

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const showNotification = useCallback(({ type = 'info', message, duration = 4000 }) => {
    const id = Date.now() + Math.random();
    const notification = { id, type, message };

    setNotifications(prev => [...prev, notification]);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, [removeNotification]);

  const removeAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, removeNotification, removeAllNotifications }}>
      {children}
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification}
        onOpenDetail={notif => setOpenDetail(notif)}
      />
      <Modal open={!!openDetail}>
        {openDetail && (
          <div style={{ background: '#fff', borderRadius: 8, padding: 24, minWidth: 280, maxWidth: 360, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
            <h3 style={{ marginTop: 0, marginBottom: 12 }}>Notification Details</h3>
            <div style={{ marginBottom: 16 }}>
              <strong>Type:</strong> {openDetail.type}<br/>
              <strong>Message:</strong> <div style={{ marginTop: 4 }}>{openDetail.message}</div>
            </div>
            <button onClick={() => setOpenDetail(null)} style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 500, cursor: 'pointer' }}>Close</button>
          </div>
        )}
      </Modal>
    </NotificationContext.Provider>
  );
};

const NotificationContainer = ({ notifications, onRemove, onOpenDetail }) => {
  if (notifications.length === 0) return null;
  return (
    <div className="notification-container" role="region" aria-label="Notifications">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => onRemove(notification.id)}
          onOpenDetail={() => onOpenDetail(notification)}
        />
      ))}
    </div>
  );
};

const Notification = ({ id, type, message, onClose, onOpenDetail }) => {
  const icons = {
    success: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
      </svg>
    ),
    warning: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg>
    ),
    info: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
      </svg>
    )
  };

  return (
    <div 
      className={`notification notification-${type}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      style={{ cursor: 'pointer' }}
      onClick={onOpenDetail}
    >
      <div className="notification-icon">
        {icons[type]}
      </div>
      <div className="notification-content">
        <p className="notification-message">{message}</p>
      </div>
      <button 
        className="notification-close"
        onClick={e => { e.stopPropagation(); onClose(); }}
        aria-label="Close notification"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
        </svg>
      </button>
    </div>
  );
};
