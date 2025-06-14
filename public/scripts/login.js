const loginForm = document.querySelector(".login-form");
const signupForm = document.querySelector(".signup-form");
const wrapper = document.querySelector(".wrapper");
const loginTitle = document.querySelector(".title-login");
const signupTitle = document.querySelector(".title-signup");

function loginFunction() {
    // Make login form active and signup form inactive
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
    // Make signup form active and login form inactive
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

function admin() {
    if (document.getElementById("sign-pass").value == "1234") {
        window.location.href = "donations.html";
    }
}
const modal = document.getElementById("termsModal");
const openModalLink = document.getElementById("openModalLink");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeModalFooterBtn = document.getElementById("closeModalFooterBtn");

// Open modal when clicking the "terms and conditions" link
openModalLink.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default link behavior
    modal.style.display = "block"; // Show modal
});

// Close modal when clicking the close button (X)
closeModalBtn.addEventListener("click", function() {
    modal.style.display = "none";
});

// Close modal when clicking the footer close button
closeModalFooterBtn.addEventListener("click", function() {
    modal.style.display = "none";
});

// Close modal when clicking outside the modal content
window.addEventListener("click", function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});