

// Dark Mode
document.getElementById("darkModeToggle").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
});

// Alternate filter form logic (if used)
const altForm = document.getElementById("filter-form");
if(altForm) {
  altForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const gender = document.getElementById("gender").value.toLowerCase();
    const age = document.getElementById("age").value;
    const ageUnitElem = document.getElementById("age-unit");
    const ageUnit = ageUnitElem ? ageUnitElem.value : "";
    const breed = document.getElementById("breed").value.toLowerCase();
    const neutered = document.getElementById("neutered").value.toLowerCase();
    const location = document.getElementById("location").value.toLowerCase();

    let ageValue = null;
    if (age) {
        ageValue = parseInt(age);
    }

    const filteredPets = pets.filter((pet) => {
        const matchGender = !gender || pet.gender.toLowerCase() === gender;
        const matchBreed = !breed || pet.breed.toLowerCase() === breed;
        const matchNeutered = !neutered || pet.neutered.toLowerCase() === neutered;
        const matchLocation = !location || pet.location.toLowerCase() === location;

        let petAgeInMonths = 0;
        if (pet.age.toLowerCase().includes("year")) {
            petAgeInMonths = parseInt(pet.age) * 12;
        } else if (pet.age.toLowerCase().includes("month")) {
            petAgeInMonths = parseInt(pet.age);
        }

        const filterAgeInMonths = ageValue
            ? ageUnit === "years"
                ? ageValue * 12
                : ageValue
            : null;

        const matchAge = !filterAgeInMonths || petAgeInMonths === filterAgeInMonths;

        return matchGender && matchBreed && matchNeutered && matchAge && matchLocation;
    });

    renderFilteredPets(filteredPets);
  });
}

// Render filtered pets to container (if used)
function renderFilteredPets(filteredPets) {
  const container = document.getElementById("petListingsContainer");
  if (!container) return;

  container.innerHTML = "";
  filteredPets.forEach((pet) => {
    const petCard = document.createElement("div");
    petCard.className = "pet-card";

    const petImage = document.createElement("img");
    petImage.src = pet.image;
    petImage.alt = `${pet.breed} - ${pet.name}`;
    petCard.appendChild(petImage);

    const petName = document.createElement("h3");
    petName.textContent = pet.name;
    petCard.appendChild(petName);

    const petDetails = document.createElement("p");
    petDetails.innerHTML = `
      <strong>Age:</strong> ${pet.age}<br>
      <strong>Gender:</strong> ${pet.gender}<br>
      <strong>Breed:</strong> ${pet.breed}<br>
      <strong>Neutered:</strong> ${pet.neutered}<br>
      <strong>Location:</strong> ${pet.location}
    `;
    petCard.appendChild(petDetails);

    const adoptButton = document.createElement("button");
    adoptButton.className = "adopt-btn";
    adoptButton.textContent = "Adopt Me";
    adoptButton.addEventListener("click", () => openAdoptionForm(pet));
    petCard.appendChild(adoptButton);

    container.appendChild(petCard);
  });
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

// Quiz questions and structure
const quizData = [
  {
    question: "Do you enjoy outdoor activities?",
    img: "/images/q1.jpeg",
    cat: "no",
    dog: "yes"
  },
  {
    question: "Do you prefer quiet companionship?",
    img: "/images/q2.jpeg",
    cat: "yes",
    dog: "no"
  },
  {
    question: "Do you like high-energy pets?",
    img: "/images/q3.jpeg",
    cat: "no",
    dog: "yes"
  },
  {
    question: "Are you home often during the day?",
    img: "/images/q4.jpeg",
    cat: "yes",
    dog: "no"
  },
  {
    question: "Do you enjoy playing games with pets?",
    img: "/images/q5.jpeg",
    cat: "no",
    dog: "yes"
  },
  {
    question: "Would you rather have a pet that requires less maintenance?",
    img: "/images/q6.jpeg",
    cat: "yes",
    dog: "no"
  },
  {
    question: "Do you like long walks or runs?",
    img: "/images/q7.jpeg",
    cat: "no",
    dog: "yes"
  },
  {
    question: "Would you mind if a pet needed more space?",
    img: "/images/q8.jpeg",
    cat: "no",
    dog: "yes"
  },
  {
    question: "Do you want a pet that can entertain itself?",
    img: "/images/q9.jpeg",
    cat: "yes",
    dog: "no"
  },
  {
    question: "Are you looking for a cuddle buddy?",
    img: "/images/q10.jpeg",
    cat: "yes",
    dog: "yes"
  }
];

// Quiz state
let userAnswers = [];
let currentSlide = 0;

function createQuizSlides() {
  const container = document.getElementById('quizSlidesContainer');
  container.innerHTML = '';
  quizData.forEach((q, i) => {
    const slide = document.createElement('div');
    slide.className = 'quiz-slide' + (i === 0 ? ' active' : '');
    slide.setAttribute('data-slide', i);

    slide.innerHTML = `
    <h2 style="margin-bottom= 20px;">Companion Quiz</h2>
      <img src="${q.img}" alt="Quiz Image ${i+1}">
      <div class="quiz-question">${q.question}</div>
      <div class="quiz-answer-btns">
        <button class="quiz-answer-btn" data-answer="yes" data-slide="${i}">Yes</button>
        <button class="quiz-answer-btn" data-answer="no" data-slide="${i}">No</button>
      </div>
    `;
    container.appendChild(slide);
  });

  // Result slide (last)
  const resultSlide = document.createElement('div');
  resultSlide.className = 'quiz-slide';
  resultSlide.setAttribute('data-slide', quizData.length);
  resultSlide.id = 'quizResultSlide';
  resultSlide.innerHTML = `
    <div class="quiz-result" id="quizResultBox">
      <!-- Result will be filled by JS -->
    </div>
  `;
  container.appendChild(resultSlide);
}

// Show the given slide (by index)
function showQuizSlide(index, tossDirection = null) {
  const slides = document.querySelectorAll('.quiz-slide');
  slides.forEach((slide, i) => {
    slide.classList.remove('active', 'toss-left');
    if (i === index) {
      slide.classList.add('active');
    } else if (i === index-1 && tossDirection === 'left') {
      slide.classList.add('toss-left');
    }
  });
  currentSlide = index;
}

// Handle answer selection and transition
function handleQuizAnswer(e) {
  const btn = e.target.closest('.quiz-answer-btn');
  if (!btn) return;
  const answer = btn.dataset.answer;
  const slideIndex = parseInt(btn.dataset.slide);

  // Mark selected button
  btn.classList.add('selected');
  btn.parentElement.querySelectorAll('.quiz-answer-btn').forEach(b => {
    if (b !== btn) b.classList.remove('selected');
  });

  // Save answer
  userAnswers[slideIndex] = answer;

  // Transition: toss current slide to left, show next
  setTimeout(() => {
    showQuizSlide(slideIndex + 1, 'left');
    // If on result slide, calculate and show result
    if (slideIndex + 1 === quizData.length) {
      showQuizResult();
    }
  }, 350);
}

// Calculate and display result
function showQuizResult() {
  let catScore = 0, dogScore = 0;
  userAnswers.forEach((ans, i) => {
    if (ans === quizData[i].cat) catScore++;
    if (ans === quizData[i].dog) dogScore++;
  });

  let resultText = '', resultImg = '', resultSub = '';
  if (catScore > dogScore) {
    resultText = "You're best suited to adopt a <b>cat</b>!";
    resultImg = "/images/rcat.jpeg";
    resultSub = "You enjoy quiet, independent, and low-maintenance companions.";
  } else if (dogScore > catScore) {
    resultText = "You're best suited to adopt a <b>dog</b>!";
    resultImg = "/images/rdog.jpeg";
    resultSub = "You love playful, energetic, and loyal friends!";
  } else {
    resultText = "You're great with <b>both cats and dogs</b>!";
    resultImg = "/images/rboth.jpeg";
    resultSub = "You have the perfect balance to care for either!";
  }

  document.getElementById('quizResultBox').innerHTML = `
    <img src="${resultImg}" alt="Quiz Result">
    <h3>${resultText}</h3>
    <p>${resultSub}</p>
    <button class="quiz-restart-btn" onclick="restartQuiz()">Restart Quiz</button>
  `;
}

// Quiz modal open/close logic
document.addEventListener('DOMContentLoaded', function() {
  // Quiz modal open
  const openQuizBtn = document.getElementById('openQuizBtn');
  if (openQuizBtn) {
    openQuizBtn.addEventListener('click', function() {
      userAnswers = [];
      currentSlide = 0;
      createQuizSlides();
      showQuizSlide(0);
      document.getElementById('quizModalQ').classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  }
  // Quiz modal close
  const closeQuizModal = document.getElementById('closeQuizModal');
  if (closeQuizModal) {
    closeQuizModal.addEventListener('click', function() {
      document.getElementById('quizModalQ').classList.remove('show');
      document.body.style.overflow = '';
    });
  }
  // Slide answer delegation
  const quizSlidesContainer = document.getElementById('quizSlidesContainer');
  if (quizSlidesContainer) {
    quizSlidesContainer.addEventListener('click', handleQuizAnswer);
  }
  // Dismiss quiz modal on outside click
  const quizModalQ = document.getElementById('quizModalQ');
  if (quizModalQ) {
    quizModalQ.addEventListener('mousedown', function(e) {
      if (e.target === quizModalQ) {
        quizModalQ.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }
});

// Restart quiz from result slide
function restartQuiz() {
  userAnswers = [];
  currentSlide = 0;
  createQuizSlides();
  showQuizSlide(0);
}

// --- REHOME PET MODAL CODE ---
document.addEventListener('DOMContentLoaded', function() {
  // Open Rehome Modal
  const openRehomeBtn = document.getElementById('openRehomeBtn');
  const rehomeModal = document.getElementById('rehomePetModal');
  const closeRehomeModal = document.getElementById('closeRehomeModal');

  if (openRehomeBtn && rehomeModal) {
    openRehomeBtn.addEventListener('click', function() {
      rehomeModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }
  if (closeRehomeModal && rehomeModal) {
    closeRehomeModal.addEventListener('click', function() {
      rehomeModal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }
  // Dismiss modal on outside click
  if (rehomeModal) {
    rehomeModal.addEventListener('mousedown', function(e) {
      if (e.target === rehomeModal) {
        rehomeModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }
});
//REHOME FORM LOGIC
document.addEventListener('DOMContentLoaded', function() {
  // Toggle medication field visibility
  document.getElementById('petDisease').addEventListener('change', function() {
    document.getElementById('medicationSection').style.display = 
      this.value === 'Yes' ? 'block' : 'none';
  });

  // File upload counter
  document.getElementById('petPhotos').addEventListener('change', function() {
    const count = this.files.length;
    document.getElementById('fileCountMsg').textContent = 
      `${count} file${count !== 1 ? 's' : ''} selected`;
  });

  document.getElementById('rehomePetForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    try {
      // Disable button during submission
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      
      // Send form data to the correct endpoint
      const response = await fetch('/api/post-requests', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Submission failed');
      }
  
      // Success handling
      const result = await response.json();
      console.log('Submission successful:', result);
      
      showToast("Thank you for your request! We’ve received your submission and our team will review it soon.");
      
      // Reset form and UI
      this.reset();
      document.getElementById('fileCountMsg').textContent = '';
      document.getElementById('rehomePetModal').style.display = 'none';
      
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit for Adoption';
    }
  });
});
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = "toast";
  }, 3000); // Toast disappears after 3 seconds
}
