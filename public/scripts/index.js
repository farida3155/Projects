window.addEventListener('scroll', function () {
    const ticker = document.querySelector('.news-ticker');
    const nav = document.querySelector('.nav');
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      ticker.style.transform = 'translateY(-100%)';
      nav.style.transform = 'translate(-50%, -100%)';
    } else {
      ticker.style.transform = 'translateY(0)';
      nav.style.transform = 'translate(-50%, 0)';
    }
  });
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