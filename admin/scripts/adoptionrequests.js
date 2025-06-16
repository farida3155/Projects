let currentRequestId = null; // track which request is open

document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/adoption-requests")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("adoptionRequestsContainer");
      container.innerHTML = "";
      data.forEach(form => {
        const card = document.createElement("div");
        card.className = "request-card";
        card.innerHTML = `
          <p><strong>Name:</strong> ${form.fullName}</p>
          <p><strong>Email:</strong> ${form.email}</p>
          <button class="view-more-btn">View More</button>
        `;
        // Only listen for the View More button click
        const viewMoreBtn = card.querySelector(".view-more-btn");
        viewMoreBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          openAdoptionModal(form);
        });
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Failed to load adoption requests:", err);
    });
});
function openAdoptionModal(form) {
  const modal = document.getElementById('adoptionModal');
  const detailsContainer = document.getElementById('adoptionDetails');
   currentRequestId = form._id;

  // Clear previous details
  detailsContainer.innerHTML = '';

  // Helper to create a single field row
  function createField(labelText, value, isLink = false) {
    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'field-group';

    const label = document.createElement('label');
    label.textContent = labelText;

    const span = document.createElement('span');

    if (value === undefined || value === null || value === '') {
      span.textContent = 'N/A';
    } else if (isLink) {
      const a = document.createElement('a');
      a.href = value;
      a.textContent = value;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      span.appendChild(a);
    } else {
      span.textContent = value;
    }

    fieldGroup.appendChild(label);
    fieldGroup.appendChild(span);
    return fieldGroup;
  }

  // List all fields according to your schema
  detailsContainer.appendChild(createField('Full Name:', form.fullName));
  detailsContainer.appendChild(createField('Age:', form.age));
  detailsContainer.appendChild(createField('Phone:', form.phone));
  detailsContainer.appendChild(createField('Alternate Phone:', form.altPhone));
  detailsContainer.appendChild(createField('Email:', form.email));
  detailsContainer.appendChild(createField('Location:', form.location));
  detailsContainer.appendChild(createField('Social Media URL:', form.socialMediaUrl, true));
  detailsContainer.appendChild(createField('Reason For Adoption:', form.reasonForAdoption));
  detailsContainer.appendChild(createField('Time Looking To Adopt:', form.timeLookingToAdopt));
  detailsContainer.appendChild(createField('Spaying Thoughts:', form.spayingThoughts));
  detailsContainer.appendChild(createField('Petco Application:', form.petcoApplication));
  detailsContainer.appendChild(createField('Had Cats Before:', form.hadCats));
  detailsContainer.appendChild(createField('Children At Home:', form.childrenAtHome));
  detailsContainer.appendChild(createField('Children Age:', form.childrenAge));
  detailsContainer.appendChild(createField('Fenced Yard:', form.fencedYard));
  detailsContainer.appendChild(createField('Home Type:', form.homeType));
  detailsContainer.appendChild(createField('Other Pets:', form.otherPets));
  detailsContainer.appendChild(createField('House Support:', form.houseSupport));
  detailsContainer.appendChild(createField('Alone Time:', form.aloneTime));
  detailsContainer.appendChild(createField('Vet Checkups:', form.vetCheckups));
  detailsContainer.appendChild(createField('Pet Experience:', form.petExperience));
  detailsContainer.appendChild(createField('Pet Allergies:', form.petAllergies));
  detailsContainer.appendChild(createField('Exercise Plan:', form.exercisePlan));
  detailsContainer.appendChild(createField('Travel Frequency:', form.travelFrequency));
  detailsContainer.appendChild(createField('Vacation Plan:', form.vacationPlan));
  detailsContainer.appendChild(createField('Special Needs:', form.specialNeeds));
  detailsContainer.appendChild(createField('Vet Available:', form.vetAvailable));
  detailsContainer.appendChild(createField('Vet Cost Estimate:', form.vetCostEstimate));
  detailsContainer.appendChild(createField('Vet Emergency Ready:', form.vetEmergencyReady));
  detailsContainer.appendChild(createField('Pet Insurance:', form.petInsurance));
  detailsContainer.appendChild(createField('Monthly Expenses:', form.monthlyExpenses));
  detailsContainer.appendChild(createField('Life Changes:', form.lifeChanges));
  detailsContainer.appendChild(createField('Stress Management:', form.stressManagement));
  detailsContainer.appendChild(createField('Commitment:', form.commitment));
  detailsContainer.appendChild(createField('Why Fit:', form.whyFit));
  detailsContainer.appendChild(createField('Pet Introduction:', form.petIntroduction));

  // Show the modal
  modal.style.display = 'flex';

  // Close modal when clicking on the close button or outside modal content
  const closeBtn = modal.querySelector('.close');
  closeBtn.onclick = () => { modal.style.display = 'none'; };
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}
function closeAdoptionModal() {
  document.getElementById("adoptionModal").style.display = "none";
  currentRequestId = null;
}

function acceptRequest() {
  if (!currentRequestId) return alert("No request selected");

  fetch(`/api/adoption-requests/accept/${currentRequestId}`, { method: "POST" })
    .then(res => {
      if (res.ok) {
        alert("Adoption request accepted!");
        closeAdoptionModal();
        // Refresh the requests list
        location.reload();
      } else {
        alert("Failed to accept request");
      }
    })
    .catch(err => {
      alert("Error accepting request");
      console.error(err);
    });
}

function rejectRequest() {
  if (!currentRequestId) return alert("No request selected");

  fetch(`/api/adoption-requests/reject/${currentRequestId}`, { method: "DELETE" })
    .then(res => {
      if (res.ok) {
        alert("Adoption request rejected!");
        closeAdoptionModal();
        // Refresh the requests list
        location.reload();
      } else {
        alert("Failed to reject request");
      }
    })
    .catch(err => {
      alert("Error rejecting request");
      console.error(err);
    });
}
