document.getElementById("loginBtn").addEventListener("click", async function () {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  try {
    const response = await fetch("/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      window.location.href = "AdminDash.html";
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("An error occurred. Try again.");
  }
});
