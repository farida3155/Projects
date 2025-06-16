
let currentType = 'cat'; 
let currentPets = cats;

function getDisplayImagePath(image) {
    if (!image) return '/images/default-pet.png';
  
    try {
      const url = new URL(image);
      return url.pathname.replace(/^\/public/, '');
    } catch {
      return image.startsWith('/public/') ? image.replace(/^\/public/, '') : image;
    }
  }

function createFlipCard(pet) {
  return `
    <div class="flip-card">
      <div class="flip-card-inner">
        <div class="flip-card-front">
        <img src="${getDisplayImagePath(pet.image)}" alt="${pet.name}">
          <h2>${pet.name}</h2>
        </div>
        <div class="flip-card-back">
          <h3>${pet.name}</h3>
          <p><b>Age:</b> ${pet.age.value} ${pet.age.unit}</p>
          <p><b>Breed:</b> ${pet.breed}</p>
          <p><b>Gender:</b> ${pet.gender}</p>
          <p><b>Neutered:</b> ${pet.neutered}</p>
          <p><b>Location:</b> ${pet.location}</p>
         <button onclick="openAdoptionForm('${pet._id}')">Adopt</button>

        </div>
      </div>
    </div>
  `;
}

function renderPetCards(pets) {
  const container = document.getElementById('petCardsContainer');
  if (!container) return;
  if (!pets || pets.length === 0) {
    container.innerHTML = '<p style="font-size:1.2em;color:#999;">No pets found.</p>';
    return;
  }
  container.innerHTML = pets.map(createFlipCard).join('');
}


document.getElementById('catTab').addEventListener('click', function() {
  currentType = 'cat';
  currentPets = cats;
  this.classList.add('active');
  document.getElementById('dogTab').classList.remove('active');
  renderPetCards(currentPets);
  updateFilters();
});
document.getElementById('dogTab').addEventListener('click', function() {
  currentType = 'dog';
  currentPets = dogs;
  this.classList.add('active');
  document.getElementById('catTab').classList.remove('active');
  renderPetCards(currentPets);
  updateFilters();
});


document.getElementById('filter-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const gender = this.gender.value;
  const breed = this.breed.value;
  const neutered = this.neutered.value;
  const location = this.location.value;
  const ageValue = this.age.value;
  const ageUnit = this['age-unit'].value;

  let filtered = currentType === 'cat' ? cats : dogs;
  if (gender) filtered = filtered.filter(p => p.gender === gender);
  if (breed) filtered = filtered.filter(p => p.breed === breed);
  if (neutered) filtered = filtered.filter(p => p.neutered === neutered);
  if (location) filtered = filtered.filter(p => p.location === location);
  if (ageValue) filtered = filtered.filter(p => String(p.age.value) === String(ageValue) && p.age.unit === ageUnit);

  renderPetCards(filtered);
});


function updateFilters() {

  const breedSelect = document.getElementById('breed');
  breedSelect.innerHTML = `<option value="">Any</option>` + breedsByType[currentType].map(b => `<option value="${b}">${b}</option>`).join('');

  const locSelect = document.getElementById('location');
  locSelect.innerHTML = `<option value="">Any</option>` + locationsByType[currentType].map(l => `<option value="${l}">${l}</option>`).join('');
}

function openAdoptionForm(petId) {
  localStorage.setItem("selectedPetId", petId); // Save to use on the form page
  window.location.href = "adoptionForm.html";
}

  
  function closeAdoptionForm() {
    const modal = document.getElementById("adoption-form");
    if (modal) modal.style.display = "none";
  }
  
  window.onclick = function (event) {
    const adoptionModal = document.getElementById("adoption-form");
    if (event.target === adoptionModal) {
      adoptionModal.style.display = "none";
    }
  };

renderPetCards(cats);
updateFilters();


document.getElementById('clearFiltersBtn').addEventListener('click', function() {
 
    document.getElementById('gender').value = "";
    document.getElementById('age').value = "";
    document.getElementById('age-unit').value = "years";
    document.getElementById('breed').value = "";
    document.getElementById('neutered').value = "";
    document.getElementById('location').value = "";
  
   
    if (currentType === 'cat') {
      renderPetCards(cats);
    } else {
      renderPetCards(dogs);
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