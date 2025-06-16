const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const wrapper = document.querySelector(".wrapper");
const loginTitle = document.querySelector(".title-login");
const signupTitle = document.querySelector(".title-signup");

function loginFunction() {
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
    loginForm.style.left = "50%";
    signupForm.style.left = "150%";
    wrapper.style.height = "500px";
    loginTitle.style.top = "50%";
    loginTitle.style.opacity = 1;
    signupTitle.style.top = "50px";
    signupTitle.style.opacity = 0;
}

function registerFunction() {
    loginForm.classList.remove("active");
    signupForm.classList.add("active");
    loginForm.style.left = "-50%";
    signupForm.style.left = "50%";
    wrapper.style.height = "580px";
    loginTitle.style.top = "-60px";
    loginTitle.style.opacity = 0;
    signupTitle.style.top = "50%";
    signupTitle.style.opacity = 1;
}

const modal = document.getElementById("termsModal");
const openModalLink = document.getElementById("openModalLink");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeModalFooterBtn = document.getElementById("closeModalFooterBtn");

openModalLink.addEventListener("click", function(event) {
    event.preventDefault();
    modal.style.display = "block";
});
closeModalBtn.addEventListener("click", function() {
    modal.style.display = "none";
});
closeModalFooterBtn.addEventListener("click", function() {
    modal.style.display = "none";
});
window.addEventListener("click", function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});


loginForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const email = document.getElementById('log-email').value.trim();
    const password = document.getElementById('log-pass').value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    alert(data.message);
    if (data.status === "Success") {
        localStorage.setItem("userEmail", data.data.email);
        window.location.href = "/";
    }
});

signupForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const email = document.getElementById('sign-email').value.trim();
    const password = document.getElementById('sign-pass').value.trim();
    const confirmPassword = document.getElementById('sign-confirmpass').value.trim();
    const agree = document.getElementById('agree').checked;

    if (!email || !password || !confirmPassword) {
        alert("Please fill all the fields.");
        return;
    }
    if (!agree) {
        alert("You must agree to the Terms & Conditions.");
        return;
    }

    const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword })
    });
    const data = await res.json();
    alert(data.message);
    if (data.status === "Success") {
        localStorage.setItem("userEmail", data.data.email);
        window.location.href = "/";
    }
});

document.getElementById('forgot-password-link').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = '/forgot-password.html';
  });