document.querySelector(".contact-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, subject, message }),
    });

    if (res.ok) {
      showModal("Your message has been sent successfully!");
      document.querySelector(".contact-form").reset();
    } else {
      showModal("Something went wrong. Please try again.");
    }
  } catch (err) {
    showModal("Network error. Please check your connection.");
  }
});

// Modal display
function showModal(message) {
  let modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "30%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "#fff";
  modal.style.padding = "20px 30px";
  modal.style.borderRadius = "12px";
  modal.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
  modal.style.zIndex = 9999;
  modal.innerText = message;

  document.body.appendChild(modal);

  setTimeout(() => {
    modal.remove();
  }, 3000);
}

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // example check

  function toggleSidebar() {
    document.getElementById("profileSidebar").classList.toggle("open");
    document.getElementById("sidebarOverlay").classList.toggle("active");
  }

  function handleProfileClick() {
    if (!isLoggedIn) {
      window.location.href = "/login"; // already implemented by you
    } else {
      toggleSidebar();
    }
  }

  // Hide login/signup text if logged in
  document.addEventListener("DOMContentLoaded", () => {
    if (isLoggedIn) {
      const loginSignupText = document.getElementById("loginSignupText");
      if (loginSignupText) loginSignupText.style.display = "none";
    }
  });

