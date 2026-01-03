// Authentication utilities
const auth = {
  // Save user data and token
  login(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Clear user data
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/pages/login.html';
  },

  // Get current user
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get token
  getToken() {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  },

  // Check if user has specific role
  hasRole(role) {
    const user = this.getUser();
    return user && user.role === role;
  },

  // Check if user is admin
  isAdmin() {
    return this.hasRole('admin');
  },

  // Redirect if not authenticated
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = '/pages/login.html';
      return false;
    }
    return true;
  },

  // Redirect if not admin
  requireAdmin() {
    if (!this.isAdmin()) {
      window.location.href = '/pages/dashboard.html';
      return false;
    }
    return true;
  }
};

// Export
window.auth = auth;
