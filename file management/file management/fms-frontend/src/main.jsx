import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import './styles/main.css'
import './styles/Responsive.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </React.StrictMode>,
)