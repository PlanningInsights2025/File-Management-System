// Firebase Authentication Configuration
// Using Firebase for user authentication

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXlqC7hHr8nYKueWU-AnDTW3jszYaXkL4",
  authDomain: "file-management-system-2edee.firebaseapp.com",
  projectId: "file-management-system-2edee",
  storageBucket: "file-management-system-2edee.firebasestorage.app",
  messagingSenderId: "265888215756",
  appId: "1:265888215756:web:9f1d387b1dcdf046bfc869",
  measurementId: "G-FZZRNZ3SXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

console.log('✅ Firebase initialized successfully');

// Export for use in other files
export { app, auth, db, analytics };
