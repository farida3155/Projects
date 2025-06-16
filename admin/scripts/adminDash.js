
 let allPets = [];
 let filteredPets = [];


 function fetchAllPets() {
   fetch('/api/pets/all')
     .then(res => res.json())
     .then(pets => {
       allPets = pets;
       filteredPets = pets;
       renderPets(filteredPets);
     }).catch(() => {
       document.getElementById('managepets-cards-container').innerHTML = `<p style="color:red;">Could not load pets.</p>`;
     });
 }

 //search
 function filterPetsByName() {
   const val = document.getElementById('petSearchInput').value.trim().toLowerCase();
   filteredPets = allPets.filter(pet => (pet.name || '').toLowerCase().includes(val));
   renderPets(filteredPets);
 }

 //render pets
 function renderPets(pets) {
   const container = document.getElementById('managepets-cards-container');
   if (!pets.length) {
     container.innerHTML = `<p style="margin-top:30px;">No pets found.</p>`;
     return;
   }
   container.innerHTML = pets.map(pet => petCardHTML(pet)).join('');

   document.querySelectorAll('.flip-card').forEach(card => {
     card.onclick = function(e) {
       if (!e.target.classList.contains('flip-card-action-btn') && !e.target.classList.contains('danger-btn')) {
         this.classList.toggle('flipped');
       }
     };
   });
   
   document.querySelectorAll('.update-pet-btn').forEach(btn => {
     btn.onclick = function(e) {
       e.stopPropagation();
       openUpdatePetModal(btn.dataset.id);
     };
   });
   document.querySelectorAll('.remove-pet-btn').forEach(btn => {
     btn.onclick = function(e) {
       e.stopPropagation();
       openRemovePetModal(btn.dataset.id);
     };
   });
 }


 function petCardHTML(pet) {

   const defaultImg = '/images/default.png';
   

   let imgUrl = defaultImg;
   
   if (pet.image) {
     if (typeof pet.image === 'string') {
       if (pet.image.startsWith('http://') || pet.image.startsWith('https://')) {
         imgUrl = pet.image;
       } else if (pet.image.startsWith('/')) {
         imgUrl = pet.image;
       } else if (pet.image.includes('/')) {
         imgUrl = `/${pet.image}`;
       } else {
         imgUrl = `/uploads/${pet.image}`;
       }
     } else if (typeof pet.image === 'object' && pet.image.url) {
       imgUrl = pet.image.url;
     }
   }

   return `
     <div class="flip-card" tabindex="0">
       <div class="flip-card-inner">
         <div class="flip-card-front">
           <img src="${imgUrl}" alt="${pet.name || 'Pet'}" 
                onerror="this.src='${defaultImg}';this.onerror=null;">
           <h2>${pet.name || ""}</h2>
           <div class="flip-card-actions">
             <button class="flip-card-action-btn update-pet-btn" data-id="${pet._id}">Update</button>
             <button class="danger-btn remove-pet-btn" data-id="${pet._id}">Remove</button>
           </div>
         </div>
         <div class="flip-card-back">
           <h3>${pet.name || ""}</h3>
           <p><b>Age:</b> ${pet.age ? `${pet.age.value} ${pet.age.unit}` : ""}</p>
           <p><b>Breed:</b> ${pet.breed || ""}</p>
           <p><b>Gender:</b> ${pet.gender || ""}</p>
           <p><b>Neutered:</b> ${pet.neutered || ""}</p>
           <p><b>Location:</b> ${pet.location || ""}</p>
           <p><b>Type:</b> ${pet.type || ""}</p>
           <p><b>Up For Adoption:</b> ${pet.upForAdoption === false ? "No" : "Yes"}</p>
         </div>
       </div>
     </div>
   `;
 }

 //ADD PET MODAL
 function openAddPetModal() {
   showPetFormModal('add');
 }

 //UPDATE PET MODAL
 function openUpdatePetModal(petId) {
   if (!petId) { alert("No pet ID found!"); return; }
   fetch(`/api/pets/${petId}`)
     .then(r => {
       if (!r.ok) throw new Error();
       return r.json();
     })
     .then(pet => {
       showPetFormModal('update', pet);
     })
     .catch(() => alert("Pet not found."));
 }

 //REMOVE PET MODAL
 function openRemovePetModal(petId) {
   if (!petId) {
     alert("No pet ID found!");
     return;
   }
   fetch(`/api/pets/${petId}`)
     .then(r => {
       if (!r.ok) throw new Error('Pet not found');
       return r.json();
     })
     .then(pet => {
       showRemoveConfirmModal(pet);
     })
     .catch(error => {
       console.error('Error fetching pet:', error);
       alert("Failed to load pet data: " + error.message);
     });
 }

//UPDATE FORM
 function showPetFormModal(mode, pet = {}) {
  const isUpdate = mode === 'update';
  const imgUrl = pet.image && pet.image.startsWith('/uploads/') ? pet.image : "/images/pawdefault.png";
  document.getElementById('petCardContainer').innerHTML = `
    <div class="modal-petform-box">
      <form id="modalPetForm" enctype="multipart/form-data" autocomplete="off">
        ${isUpdate ? `<input type="hidden" name="petId" value="${pet._id}">` : ""}
        <div class="modal-petform-imgcontainer">
          <img id="modalPreviewImg" src="${imgUrl}" alt="Pet Image">
        </div>
        <input type="file" id="modalImageInput" name="image" accept="image/*">
        <input type="text" name="name" id="modalPetName" placeholder="Name" required value="${pet.name || ''}">
        <div class="modal-petform-row">
          <input type="number" min="0" name="ageValue" id="modalPetAgeValue" placeholder="Age" required value="${pet.age ? pet.age.value : ''}">
          <select name="ageUnit" id="modalPetAgeUnit" required>
            <option value="year" ${pet.age && pet.age.unit === "year" ? "selected" : ""}>year</option>
            <option value="years" ${pet.age && pet.age.unit === "years" ? "selected" : ""}>years</option>
            <option value="month" ${pet.age && pet.age.unit === "month" ? "selected" : ""}>month</option>
            <option value="months" ${pet.age && pet.age.unit === "months" ? "selected" : ""}>months</option>
          </select>
        </div>
        <input type="text" name="breed" id="modalPetBreed" placeholder="Breed" required value="${pet.breed || ''}">
        <div class="modal-petform-row">
          <select name="gender" id="modalPetGender" required>
            <option value="">Gender</option>
            <option value="male" ${pet.gender === "male" ? "selected" : ""}>Male</option>
            <option value="female" ${pet.gender === "female" ? "selected" : ""}>Female</option>
          </select>
          <select name="neutered" id="modalPetNeutered" required>
            <option value="">Neutered?</option>
            <option value="yes" ${pet.neutered === "yes" ? "selected" : ""}>Yes</option>
            <option value="no" ${pet.neutered === "no" ? "selected" : ""}>No</option>
            <option value="unknown" ${pet.neutered === "unknown" ? "selected" : ""}>Unknown</option>
          </select>
        </div>
        <input type="text" name="location" id="modalPetLocation" placeholder="Location" required value="${pet.location || ''}">
        <select name="type" id="modalPetType" required>
          <option value="">Type</option>
          <option value="dog" ${pet.type === "dog" ? "selected" : ""}>Dog</option>
          <option value="cat" ${pet.type === "cat" ? "selected" : ""}>Cat</option>
        </select>
        <label class="modal-toggle-switch">
          <input type="checkbox" id="modalPetUpForAdoption" name="upForAdoption" ${pet.upForAdoption !== false ? "checked" : ""}>
          <span>${pet.upForAdoption === false ? "Not For Adoption" : "Up For Adoption"}</span>
        </label>
        <button type="submit" class="modal-managepets-btn">
          ${isUpdate ? "Update Pet" : "Add Pet"}
        </button>
      </form>
    </div>
  `;
  document.getElementById('petModal').style.display = 'flex';

  
  document.getElementById('modalImageInput').addEventListener('change', function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        document.getElementById('modalPreviewImg').src = e.target.result;
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  const upForAdoptionBox = document.getElementById('modalPetUpForAdoption');
  upForAdoptionBox.addEventListener('change', function () {
    this.nextElementSibling.textContent = this.checked ? "Up For Adoption" : "Not For Adoption";
  });

  
  document.getElementById('modalPetForm').onsubmit = function (e) {
    e.preventDefault();
    const fd = new FormData(this);
    fd.set('age', JSON.stringify({ value: fd.get('ageValue'), unit: fd.get('ageUnit') }));
    fd.delete('ageValue'); fd.delete('ageUnit');
    fd.set('upForAdoption', upForAdoptionBox.checked ? 'true' : 'false');
    if (isUpdate) {
      fetch(`/api/pets/${pet._id}`, { method: 'PUT', body: fd })
        .then(r => r.json())
        .then(() => { closePetModal(); fetchAllPets(); })
        .catch(() => alert("Failed to update pet."));
    } else {
      fetch('/api/pets', { method: 'POST', body: fd })
        .then(r => r.json())
        .then(() => { closePetModal(); fetchAllPets(); })
        .catch(() => alert("Failed to add pet."));
    }
  };
}

 function closePetModal() {
   document.getElementById('petModal').style.display = 'none';
   document.getElementById('petCardContainer').innerHTML = '';
 }

 //REMOVE PET
 function showRemoveConfirmModal(pet) {
   console.log('Showing remove confirmation for:', pet);

  
   let imgUrl = '/images/pawdefault.png';
   if (pet.image && typeof pet.image === 'string' && pet.image.trim() !== "") {
     if (pet.image.startsWith('http://') || pet.image.startsWith('https://') || pet.image.startsWith('/')) {
       imgUrl = pet.image;
     } else {
       imgUrl = `/uploads/${pet.image}`;
     }
   }

  
   const removeCardContainer = document.getElementById('removeCardContainer');
   if (!removeCardContainer) {
     console.error('removeCardContainer not found');
     alert('Error: Remove modal container not found');
     return;
   }
   removeCardContainer.innerHTML = `
     <div class="flip-card" style="pointer-events:none;">
       <div class="flip-card-inner" style="transform:none;">
         <div class="flip-card-front">
           <img src="${imgUrl}" alt="Pet Image" onerror="this.src='/images/pawdefault.png';this.onerror=null;">
           <h2>${pet.name || "Unknown"}</h2>
           <div class="petinfo" style="margin:7px 0;"><b>Breed:</b> ${pet.breed || "Unknown"}</div>
         </div>
         <div class="flip-card-back">
           <h3>${pet.name || "Unknown"}</h3>
           <p><b>Age:</b> ${pet.age ? `${pet.age.value} ${pet.age.unit}` : "Unknown"}</p>
           <p><b>Gender:</b> ${pet.gender || "Unknown"}</p>
           <p><b>Location:</b> ${pet.location || "Unknown"}</p>
           <p><b>Type:</b> ${pet.type || "Unknown"}</p>
           <p><b>Up For Adoption:</b> ${pet.upForAdoption === false ? "No" : "Yes"}</p>
         </div>
       </div>
     </div>
   `;

  
   const confirmBtn = document.getElementById('confirmRemoveBtn');
   if (!confirmBtn) {
     console.error('confirmRemoveBtn not found');
     alert('Error: Confirm button not found');
     return;
   }
   confirmBtn.onclick = function() {
     console.log('Confirming removal of pet:', pet._id);
     if (confirm(`Are you absolutely sure you want to remove "${pet.name || 'this pet'}"? This cannot be undone.`)) {
       fetch(`/api/pets/${pet._id}`, {
         method: 'DELETE',
         headers: {
           'Content-Type': 'application/json'
         }
       })
         .then(response => {
           if (!response.ok) {
             return response.text().then(text => {
               throw new Error(text || 'Network response was not ok');
             });
           }
           return response.json();
         })
         .then(data => {
           console.log('Removal successful:', data);
           closeRemoveModal();
           fetchAllPets(); 
         })
         .catch(error => {
           console.error('Error removing pet:', error);
           alert(`Failed to remove pet: ${error.message}`);
         });
     }
   };

  
   const removeModal = document.getElementById('removeModal');
   if (!removeModal) {
     console.error('removeModal not found');
     alert('Error: Remove modal not found');
     return;
   }
   document.getElementById('petModal').style.display = 'none';
   removeModal.style.display = 'flex';
 }


 function closeRemoveModal() {
   const removeModal = document.getElementById('removeModal');
   const removeCardContainer = document.getElementById('removeCardContainer');
   const confirmRemoveBtn = document.getElementById('confirmRemoveBtn');
   if (removeModal && removeCardContainer && confirmRemoveBtn) {
     removeModal.style.display = 'none';
     removeCardContainer.innerHTML = '';
     confirmRemoveBtn.onclick = null; // Remove event listener to prevent memory leaks
   } else {
     console.error('Remove modal elements not found');
   }
 }


 document.addEventListener('DOMContentLoaded', () => {
   
   fetchAllPets();
   
  
   document.getElementById('petSearchInput')?.addEventListener('input', filterPetsByName);
   
  
   document.getElementById('petSearchInput')?.addEventListener('keydown', function(e) {
     if (e.key === "Enter") {
       e.preventDefault();
       filterPetsByName();
     }
   });
   

   document.getElementById('addPetBtn')?.addEventListener('click', openAddPetModal);
   
   
   document.getElementById('closePetModal')?.addEventListener('click', closePetModal);
   document.getElementById('closeRemoveModal')?.addEventListener('click', closeRemoveModal);
 });
 