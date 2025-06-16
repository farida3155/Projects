function parseJwt (token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  // On page load, show logged-in admin info
  document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if not logged in
      window.location.href = "adminlogin.html";
      return;
    }
    const data = parseJwt(token);
    if (data) {
      document.getElementById("adminUsername").textContent = data.username || "";
      document.getElementById("adminEmail").textContent = data.email || "";
      document.getElementById("adminRole").textContent = data.role ? "(" + data.role + ")" : "";
    }
  });