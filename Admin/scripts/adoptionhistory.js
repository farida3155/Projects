document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/adoption-history")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("adoptionHistoryContainer");
      container.innerHTML = "";
      data.forEach(form => {
        const card = document.createElement("div");
        card.className = "contact-card";
        card.innerHTML = `
          <p><strong>Name:</strong> ${form.fullName}</p>
          <p><strong>Email:</strong> ${form.email}</p>
          <p><strong>Location:</strong> ${form.location}</p>
          <button class="view-more-btn">View More</button>
        `;

        // Card click shows modal with details
        card.querySelector(".view-more-btn").addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent propagation
          showModal(form);
        });

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error fetching adoption history:", err);
    });
});

function showModal(form) {
  document.getElementById("modalName").textContent = form.fullName || "";
  document.getElementById("modalAge").textContent = form.age || "";
  document.getElementById("modalEmail").textContent = form.email || "";
  document.getElementById("modalPhone").textContent = form.phone || "";
  document.getElementById("modalAltPhone").textContent = form.altPhone || "";
  document.getElementById("modalLocation").textContent = form.location || "";
  document.getElementById("modalSocialMedia").textContent = form.socialMediaUrl || "";
  document.getElementById("modalReason").textContent = form.reasonForAdoption || "";
  document.getElementById("modalTimeLooking").textContent = form.timeLookingToAdopt || "";
  document.getElementById("modalSpaying").textContent = form.spayingThoughts || "";
  document.getElementById("modalHadCats").textContent = form.hadCats || "";
  document.getElementById("modalChildrenHome").textContent = form.childrenAtHome || "";
  document.getElementById("modalChildrenAge").textContent = form.childrenAge || "";
  document.getElementById("modalYard").textContent = form.fencedYard || "";
  document.getElementById("modalHomeType").textContent = form.homeType || "";
  document.getElementById("modalOtherPets").textContent = form.otherPets || "";
  document.getElementById("modalHouseSupport").textContent = form.houseSupport || "";
  document.getElementById("modalAloneTime").textContent = form.aloneTime || "";
  document.getElementById("modalVetCheckups").textContent = form.vetCheckups || "";
  document.getElementById("modalExperience").textContent = form.petExperience || "";
  document.getElementById("modalAllergies").textContent = form.petAllergies || "";
  document.getElementById("modalExercise").textContent = form.exercisePlan || "";
  document.getElementById("modalTravel").textContent = form.travelFrequency || "";
  document.getElementById("modalVacation").textContent = form.vacationPlan || "";
  document.getElementById("modalSpecialNeeds").textContent = form.specialNeeds || "";
  document.getElementById("modalVetAvailable").textContent = form.vetAvailable || "";
  document.getElementById("modalVetCost").textContent = form.vetCostEstimate || "";
  document.getElementById("modalEmergencyReady").textContent = form.vetEmergencyReady || "";
  document.getElementById("modalInsurance").textContent = form.petInsurance || "";
  document.getElementById("modalExpenses").textContent = form.monthlyExpenses || "";
  document.getElementById("modalLifeChanges").textContent = form.lifeChanges || "";
  document.getElementById("modalStress").textContent = form.stressManagement || "";
  document.getElementById("modalCommitment").textContent = form.commitment || "";
  document.getElementById("modalWhyFit").textContent = form.whyFit || "";
  document.getElementById("modalIntroduction").textContent = form.petIntroduction || "";

  document.getElementById("adoptionModal").style.display = "flex";
}



function closeModal() {
  document.getElementById("adoptionModal").style.display = "none";
}
