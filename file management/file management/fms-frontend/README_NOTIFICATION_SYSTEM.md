# Global Notification System - Implementation Guide

## Overview
A reusable notification/toast system for displaying temporary messages across your React application using pure CSS (no Tailwind).

## Features
✅ **Multiple Types**: Success, Error, Warning, Info  
✅ **Auto-dismiss**: Configurable duration (default 4 seconds)  
✅ **Manual Close**: × button on each notification  
✅ **Stacking**: Multiple notifications stack vertically  
✅ **Accessible**: ARIA roles, keyboard navigation  
✅ **Responsive**: Mobile-friendly design  
✅ **Animations**: Smooth slide-in from right  
✅ **Pure CSS**: No external dependencies  

## Files Created

### 1. **src/context/NotificationContext.jsx**
- `NotificationProvider` - Wraps your app to provide global access
- `useNotification()` hook - Easy access from any component
- Auto-dismiss logic with configurable duration
- Notification state management

### 2. **src/styles/notifications.css**  
- Fixed bottom-right positioning
- Color-coded notifications (success=green, error=red, warning=orange, info=blue)
- Smooth animations (slide-in, fade-out)
- Responsive design (mobile breakpoints)
- Accessibility features (high contrast, reduced motion support)

### 3. **src/main.jsx** (Updated)
- Wrapped `<App />` with `<NotificationProvider>`

### 4. **src/components/Common/NotificationUsageExample.jsx**
- Interactive demo page showing all notification types
- Code examples and integration guide

## Setup

The notification system is already integrated! The `NotificationProvider` wraps your entire app in `src/main.jsx`.

## Usage

### Basic Usage

```javascript
import { useNotification } from '../context/NotificationContext';

const MyComponent = () => {
  const { showNotification } = useNotification();

  const handleSuccess = () => {
    showNotification({
      type: 'success',
      message: 'File marked OUT successfully!'
    });
  };

  return <button onClick={handleSuccess}>Mark OUT</button>;
};
```

### Notification Types

```javascript
// Success - Green background
showNotification({
  type: 'success',
  message: 'Profile updated successfully!'
});

// Error - Red background
showNotification({
  type: 'error',
  message: 'Failed to save changes. Please try again.'
});

// Warning - Orange background
showNotification({
  type: 'warning',
  message: 'File will be overdue in 2 days.'
});

// Info - Blue background
showNotification({
  type: 'info',
  message: 'Settings saved locally in browser.'
});
```

### Custom Duration

```javascript
// Auto-dismiss after 5 seconds
showNotification({
  type: 'success',
  message: 'Custom duration notification',
  duration: 5000
});

// Persistent (won't auto-dismiss, only manual close)
showNotification({
  type: 'warning',
  message: 'Important: Please review these changes',
  duration: 0
});
```

### Multiple Notifications

```javascript
// Notifications automatically stack
showNotification({ type: 'success', message: 'First action complete' });
showNotification({ type: 'info', message: 'Second action started' });
showNotification({ type: 'warning', message: 'Third action needs attention' });
```

## Integration Examples

### File Management
```javascript
const handleFileOut = async (fileId) => {
  try {
    await markFileOut(fileId);
    showNotification({
      type: 'success',
      message: 'File marked OUT successfully!'
    });
  } catch (error) {
    showNotification({
      type: 'error',
      message: error.message || 'Failed to mark file OUT'
    });
  }
};
```

### Form Submission
```javascript
const handleSubmit = async (formData) => {
  try {
    await submitForm(formData);
    showNotification({
      type: 'success',
      message: 'Form submitted successfully!'
    });
    navigate('/dashboard');
  } catch (error) {
    showNotification({
      type: 'error',
      message: 'Please check the form and try again'
    });
  }
};
```

### Settings Save
```javascript
const handleSaveSettings = () => {
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
    showNotification({
      type: 'success',
      message: 'Settings saved successfully!'
    });
  }, 800);
};
```

## API Reference

### `useNotification()` Hook

Returns an object with these methods:

#### `showNotification(options)`
Display a notification.

**Parameters:**
- `options.type` (string): 'success' | 'error' | 'warning' | 'info' (default: 'info')
- `options.message` (string): The message to display
- `options.duration` (number): Auto-dismiss duration in ms (default: 4000, set 0 for persistent)

**Returns:** Notification ID (number)

#### `removeNotification(id)`
Manually remove a specific notification.

**Parameters:**
- `id` (number): The notification ID returned by `showNotification()`

#### `removeAllNotifications()`
Clear all active notifications.

## Styling

All styles are in `src/styles/notifications.css`. You can customize:

- **Colors**: Edit the gradient backgrounds in `.notification-success`, `.notification-error`, etc.
- **Position**: Change `bottom` and `right` in `.notification-container`
- **Size**: Adjust `padding`, `border-radius`, `font-size` in `.notification`
- **Animation**: Modify `@keyframes slideInRight` and `@keyframes fadeOut`

## Accessibility

- ✅ `role="alert"` on each notification
- ✅ `aria-live="polite"` for screen readers
- ✅ `aria-atomic="true"` for complete message reading
- ✅ Keyboard-accessible close buttons
- ✅ High contrast mode support
- ✅ Reduced motion support

## Browser Support

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Replacing Old Toast Components

To upgrade pages using old local Toast components:

1. Import the hook:
   ```javascript
   import { useNotification } from '../context/NotificationContext';
   ```

2. Use the hook:
   ```javascript
   const { showNotification } = useNotification();
   ```

3. Replace old toast calls:
   ```javascript
   // Old way ❌
   setShowToast(true);
   
   // New way ✅
   showNotification({ type: 'success', message: 'Action completed!' });
   ```

4. Remove local Toast component code and state

## Testing

Try the interactive demo:
1. Import and use `NotificationUsageExample` component
2. Click buttons to test all notification types
3. Verify stacking, auto-dismiss, and manual close

## Troubleshooting

### Notifications not appearing
- Ensure `NotificationProvider` wraps your app in `main.jsx`
- Check that `notifications.css` is imported in `NotificationContext.jsx`
- Verify no CSS z-index conflicts (notifications use z-index: 9999)

### Notifications behind modal/overlay
- Increase z-index in `.notification-container` if needed
- Ensure modals don't have `overflow: hidden` on body

### Multiple notifications overlapping
- This is normal - they stack vertically with 12px gap
- Adjust `gap` in `.notification-container` if needed

## Next Steps

1. ✅ System is set up and ready to use
2. Update existing pages to use the new system
3. Remove old Toast components from pages
4. Customize colors/styles if needed
5. Add to your component library documentation

## Support

For issues or questions, refer to:
- `src/components/Common/NotificationUsageExample.jsx` - Interactive examples
- `src/context/NotificationContext.jsx` - Implementation code
- `src/styles/notifications.css` - Styling reference

---

**Note:** This notification system uses **pure CSS** - no Tailwind classes or external dependencies required!
