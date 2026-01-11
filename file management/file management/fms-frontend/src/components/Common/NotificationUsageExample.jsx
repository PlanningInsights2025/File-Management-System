import React from 'react';
import { useNotification } from '../context/NotificationContext';

/**
 * Example Usage Guide for Notification System
 * 
 * This file demonstrates how to use the global notification system
 * in your React components.
 */

const NotificationUsageExample = () => {
  const { showNotification } = useNotification();

  // Example 1: Success Notification
  const handleSuccess = () => {
    showNotification({
      type: 'success',
      message: 'File marked OUT successfully!',
      duration: 4000 // Optional, defaults to 4000ms
    });
  };

  // Example 2: Error Notification
  const handleError = () => {
    showNotification({
      type: 'error',
      message: 'Failed to save changes. Please try again.',
      duration: 5000
    });
  };

  // Example 3: Warning Notification
  const handleWarning = () => {
    showNotification({
      type: 'warning',
      message: 'File will be overdue in 2 days. Please return soon.',
      duration: 4500
    });
  };

  // Example 4: Info Notification
  const handleInfo = () => {
    showNotification({
      type: 'info',
      message: 'Your settings have been saved locally.',
      duration: 3000
    });
  };

  // Example 5: Custom Duration (No Auto-dismiss)
  const handlePersistent = () => {
    showNotification({
      type: 'info',
      message: 'This notification will stay until you close it.',
      duration: 0 // Set to 0 for persistent notification
    });
  };

  // Example 6: Multiple Notifications (Stacking)
  const handleMultiple = () => {
    showNotification({
      type: 'success',
      message: 'First notification',
      duration: 5000
    });

    setTimeout(() => {
      showNotification({
        type: 'warning',
        message: 'Second notification',
        duration: 5000
      });
    }, 500);

    setTimeout(() => {
      showNotification({
        type: 'info',
        message: 'Third notification',
        duration: 5000
      });
    }, 1000);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Notification System Usage Examples</h2>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
        <button onClick={handleSuccess}>Show Success</button>
        <button onClick={handleError}>Show Error</button>
        <button onClick={handleWarning}>Show Warning</button>
        <button onClick={handleInfo}>Show Info</button>
        <button onClick={handlePersistent}>Persistent Notification</button>
        <button onClick={handleMultiple}>Multiple Notifications</button>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Integration in Your Components:</h3>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
{`// 1. Import the hook at the top of your component
import { useNotification } from '../context/NotificationContext';

// 2. Use the hook in your component
const MyComponent = () => {
  const { showNotification } = useNotification();

  const handleAction = async () => {
    try {
      // Your logic here...
      await someAsyncOperation();
      
      // Show success notification
      showNotification({
        type: 'success',
        message: 'Operation completed successfully!'
      });
    } catch (error) {
      // Show error notification
      showNotification({
        type: 'error',
        message: error.message || 'Something went wrong!'
      });
    }
  };

  return <button onClick={handleAction}>Do Something</button>;
};`}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Available Options:</h3>
        <ul>
          <li><strong>type:</strong> 'success' | 'error' | 'warning' | 'info' (default: 'info')</li>
          <li><strong>message:</strong> String - The notification message to display</li>
          <li><strong>duration:</strong> Number - Auto-dismiss duration in milliseconds (default: 4000, set to 0 for persistent)</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Features:</h3>
        <ul>
          <li>✓ Automatic stacking of multiple notifications</li>
          <li>✓ Auto-dismiss with configurable duration</li>
          <li>✓ Manual close button (×)</li>
          <li>✓ Accessible (ARIA roles and keyboard navigation)</li>
          <li>✓ Responsive design (mobile-friendly)</li>
          <li>✓ Smooth animations</li>
          <li>✓ Color-coded by type</li>
          <li>✓ No external dependencies (pure CSS)</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationUsageExample;
`