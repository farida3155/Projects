document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("donationRequestsContainer");
  const modal = document.getElementById("donationModal");
  const modalContent = document.getElementById("donationDetails");
  const closeModalBtn = document.getElementById("closeDonationModal");

  // Fetch donations from backend
  fetch("/api/donations-requests")
    .then(res => res.json())
    .then(donations => {
      donations.forEach(donation => {
        const card = document.createElement("div");
        card.className = "donation-card"; // match your CSS class for styling

        const fullName = `${donation.firstName} ${donation.lastName}`;
        const email = donation.email;
        const method = donation.package
          ? `Package: ${donation.package}`
          : `Amount: $${donation.amount}`;
        const donatedAt = new Date(donation.donatedAt).toLocaleString();

        card.innerHTML = `
          <h3>${fullName}</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>${method}</strong></p>
          <p><strong>Date:</strong> ${donatedAt}</p>
          <button class="view-more-btn">View More</button>
        `;

        // Add event listener to open modal
        card.querySelector(".view-more-btn").addEventListener("click", () => {
          openModal(donation);
        });

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Failed to fetch donation forms:", err);
      container.innerHTML = "<p>Error loading donations.</p>";
    });

  // Modal close handler
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Function to populate modal
  function openModal(donation) {
    const fullName = `${donation.firstName} ${donation.lastName}`;
    const donatedAt = new Date(donation.donatedAt).toLocaleString();

    modalContent.innerHTML = `
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${donation.email}</p>
      ${donation.package ? `<p><strong>Package:</strong> ${donation.package}</p>` : ""}
      ${donation.amount ? `<p><strong>Amount:</strong> $${donation.amount}</p>` : ""}
      <p><strong>Donated At:</strong> ${donatedAt}</p>
    `;

    modal.style.display = "block";
  }
  
});
function closeDonationModal() {
  document.getElementById("donationModal").style.display = "none";
}

