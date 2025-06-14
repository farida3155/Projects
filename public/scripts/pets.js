// --- DATA: Provided by EJS ---
let currentType = 'cat'; // start with cats
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
// --- RENDER FLIP CARDS ---
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
          <button id="adopt-btn" onclick="openAdoptionForm('${pet._id}')">Adopt</button>
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

// --- TABS: Cat / Dog ---
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

// --- FILTERS ---
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

// --- UPDATE BREED/LOCATION FILTERS WHEN PET TYPE CHANGES ---
function updateFilters() {
  // Breeds
  const breedSelect = document.getElementById('breed');
  breedSelect.innerHTML = `<option value="">Any</option>` + breedsByType[currentType].map(b => `<option value="${b}">${b}</option>`).join('');
  // Locations
  const locSelect = document.getElementById('location');
  locSelect.innerHTML = `<option value="">Any</option>` + locationsByType[currentType].map(l => `<option value="${l}">${l}</option>`).join('');
}

// Adoption form modal logic
function openAdoptionForm() {
    const modal = document.getElementById("adoption-form");
    if (modal) modal.style.display = "block";
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
// --- INITIALIZE PAGE ---
renderPetCards(cats);
updateFilters();

// Clear Filters
document.getElementById('clearFiltersBtn').addEventListener('click', function() {
    // Reset all filter fields
    document.getElementById('gender').value = "";
    document.getElementById('age').value = "";
    document.getElementById('age-unit').value = "years";
    document.getElementById('breed').value = "";
    document.getElementById('neutered').value = "";
    document.getElementById('location').value = "";
  
    // Re-render all pets for the current type
    if (currentType === 'cat') {
      renderPetCards(cats);
    } else {
      renderPetCards(dogs);
    }
  });
  