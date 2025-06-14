
  // document.querySelectorAll('.side-nav ul li').forEach(item => {
  //   item.addEventListener('click', () => {
  //     const page = item.getAttribute('data-page');
  //     fetch(`/admin/${page}.html`)
  //       .then(res => res.text())
  //       .then(html => {
  //         const parser = new DOMParser();
  //         const doc = parser.parseFromString(html, 'text/html');
  //         const newContent = doc.getElementById('main-content');
  //         document.getElementById('main-content').innerHTML = newContent.innerHTML;

  //         // Load related JS manually if needed
  //         if (page === 'ContactUs') {
  //           const script = document.createElement('script');
  //           script.src = '/admin/js/contactus.js';
  //           document.body.appendChild(script);
  //         }
  //       });
  //   });
  // });



document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/contact-requests")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("contactsContainer");
      container.innerHTML = "";
      data.forEach(form => {
        const card = document.createElement("div");
        card.className = "contact-card";
        card.innerHTML = `
          <p><strong>Name:</strong> ${form.name}</p>
          <p><strong>Email:</strong> ${form.email}</p>
          <p><strong>Subject:</strong> ${form.subject}</p>
          <button class="view-more-btn">View More</button>
        `;
        card.addEventListener("click", () => showModal(form));
        container.appendChild(card);
      });
    });
});

function showModal(form) {
  document.getElementById("modalName").textContent = form.name || "";
  document.getElementById("modalEmail").textContent = form.email || "";
  document.getElementById("modalSubject").textContent = form.subject || "";
  document.getElementById("modalMessage").textContent = form.message || "";
  document.getElementById("contactModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("contactModal").style.display = "none";
}
