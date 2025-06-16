document.addEventListener("DOMContentLoaded", () => {
    const adminCardsContainer = document.getElementById("adminCardsContainer");
    const addAdminBtn = document.getElementById("addAdminBtn");
    const adminModalBg = document.getElementById("adminModalBg");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const adminForm = document.getElementById("adminForm");
    const modalTitle = document.getElementById("modalTitle");
    const adminSearchInput = document.getElementById("adminSearchInput");
  
    let editingAdminId = null;
    let adminsData = [];
    let currentUser = null;
  
    function getToken() {
      return localStorage.getItem('token');
    }
  
    // Fetch and render all admins
    async function fetchAdmins() {
      try {
        const res = await fetch("/api/admins", {
          headers: {
            "Authorization": "Bearer " + getToken()
          }
        });
        if (res.status === 401) {
          window.location.href = "login.html";
          return;
        }
        adminsData = await res.json();
        renderAdmins(adminsData);
      } catch (err) {
        adminCardsContainer.innerHTML = "<p>Failed to load admins.</p>";
      }
    }
  
    // Fetch current user info from token
    function parseJwt(token) {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return null;
      }
    }
    function setCurrentUser() {
      const token = getToken();
      if (token) {
        currentUser = parseJwt(token);
      }
    }
  
    function renderAdmins(admins) {
      adminCardsContainer.innerHTML = "";
      if (admins.length === 0) {
        adminCardsContainer.innerHTML = "<p>No admins found.</p>";
        return;
      }
      admins.forEach(admin => {
        const card = document.createElement("div");
        card.className = "admin-card";
        card.innerHTML = `
          <div class="admin-info">
            <div class="admin-username">${admin.username} <span style="font-size:0.85em;color:#a57ad9">${admin.role === "superadmin" ? "(superadmin)" : ""}</span></div>
            <div class="admin-email">${admin.email}</div>
          </div>
          <div class="admin-card-actions">
            <button class="admin-card-btn" data-id="${admin._id}" data-action="edit">Edit</button>
            <button class="admin-card-btn-danger" data-id="${admin._id}" data-action="delete">Delete</button>
          </div>
        `;
        // Only superadmin can delete, cannot delete self
        const deleteBtn = card.querySelector('.admin-card-btn-danger');
        if (!currentUser || currentUser.role !== "superadmin" || admin._id === currentUser.id) {
          deleteBtn.disabled = true;
          deleteBtn.style.opacity = 0.5;
          deleteBtn.title = "Not allowed";
        }
        adminCardsContainer.appendChild(card);
      });
    }
  
    // Show modal for add or edit
    function showModal(editing = false, admin = {}) {
      adminModalBg.style.display = "flex";
      modalTitle.textContent = editing ? "Edit Admin" : "Add Admin";
      adminForm.adminUsername.value = admin.username || "";
      adminForm.adminEmail.value = admin.email || "";
      adminForm.adminPassword.value = "";
      adminForm.adminRole.value = admin.role || "admin";
      editingAdminId = editing ? admin._id : null;
    }
  
    function closeModal() {
      adminModalBg.style.display = "none";
      adminForm.reset();
      editingAdminId = null;
    }
  
    // Add Admin
    addAdminBtn.addEventListener("click", () => showModal());
  
    // Close modal
    closeModalBtn.addEventListener("click", closeModal);
    adminModalBg.addEventListener("click", e => {
      if (e.target === adminModalBg) closeModal();
    });
  
    // Handle form submit for add/edit
    adminForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = adminForm.adminUsername.value.trim();
      const email = adminForm.adminEmail.value.trim();
      const password = adminForm.adminPassword.value.trim();
      const role = adminForm.adminRole.value;
  
      if (!username || !email || (!editingAdminId && !password)) {
        alert("Please fill in all required fields.");
        return;
      }
  
      const adminData = { username, email, role };
      if (password) adminData.password = password;
  
      try {
        let res, result;
        const headers = {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + getToken()
        };
        if (editingAdminId) {
          res = await fetch(`/api/admins/${editingAdminId}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(adminData),
          });
          result = await res.json();
          if (!res.ok) throw new Error(result.message || "Failed to update admin.");
        } else {
          res = await fetch("/api/admins", {
            method: "POST",
            headers,
            body: JSON.stringify(adminData),
          });
          result = await res.json();
          if (!res.ok) throw new Error(result.message || "Failed to create admin.");
        }
        closeModal();
        fetchAdmins();
      } catch (err) {
        alert(err.message);
      }
    });
  
    // Edit/Delete button handlers
    adminCardsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const id = btn.getAttribute("data-id");
      const action = btn.getAttribute("data-action");
  
      if (action === "edit") {
        const admin = adminsData.find(a => a._id === id);
        showModal(true, admin);
      } else if (action === "delete") {
        if (confirm("Are you sure you want to delete this admin?")) {
          fetch(`/api/admins/${id}`, {
            method: "DELETE",
            headers: {
              "Authorization": "Bearer " + getToken()
            }
          })
            .then(res => res.json())
            .then((result) => {
              if (result.message) alert(result.message);
              fetchAdmins();
            })
            .catch(() => alert("Failed to delete admin."));
        }
      }
    });
  
    // Search admins
    adminSearchInput.addEventListener("input", (e) => {
      const value = e.target.value.toLowerCase();
      const filtered = adminsData.filter(
        admin =>
          admin.username.toLowerCase().includes(value) ||
          admin.email.toLowerCase().includes(value)
      );
      renderAdmins(filtered);
    });
  
    // Initial load
    setCurrentUser();
    fetchAdmins();
  });
  