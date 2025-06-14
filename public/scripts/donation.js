document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".donationwrapper form");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const firstName = document.getElementById("fn").value.trim();
        const lastName = document.getElementById("ln").value.trim();
        const email = document.getElementById("email") ? document.getElementById("email").value.trim() : "";
        const pack = document.getElementById("pack").value;
        const randomAmount = document.getElementById("random").value.trim();

        if (!firstName || !lastName || !email) {
            alert("Please fill in all required fields.");
            return;
        }
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            alert("Please enter a valid email.");
            return;
        }
        if (!pack && !randomAmount) {
            alert("Please select a package or enter an amount.");
            return;
        }
        if (randomAmount && (isNaN(randomAmount) || Number(randomAmount) <= 0)) {
            alert("Enter a valid donation amount.");
            return;
        }

        const payload = { firstName, lastName, email, pack, randomAmount };

        const response = await fetch("/api/donate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        alert(data.message);

        if (data.status === "Success") {
            form.reset();
        }
    });
});