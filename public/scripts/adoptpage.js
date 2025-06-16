

// Dark Mode
document.getElementById("darkModeToggle").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
});

//Filtering
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

// Render filtered pets 
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
    adoptButton.addEventListener("click", () => {
      localStorage.setItem("selectedPetName", pet.name); // store it
      window.location.href = "/adoptionForm.html"; // go to form
    });
       
    petCard.appendChild(adoptButton);

    container.appendChild(petCard);
  });
}





// Quiz
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


function handleQuizAnswer(e) {
  const btn = e.target.closest('.quiz-answer-btn');
  if (!btn) return;
  const answer = btn.dataset.answer;
  const slideIndex = parseInt(btn.dataset.slide);


  btn.classList.add('selected');
  btn.parentElement.querySelectorAll('.quiz-answer-btn').forEach(b => {
    if (b !== btn) b.classList.remove('selected');
  });


  userAnswers[slideIndex] = answer;


  setTimeout(() => {
    showQuizSlide(slideIndex + 1, 'left');
 
    if (slideIndex + 1 === quizData.length) {
      showQuizResult();
    }
  }, 350);
}

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


document.addEventListener('DOMContentLoaded', function() {

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
 
  const closeQuizModal = document.getElementById('closeQuizModal');
  if (closeQuizModal) {
    closeQuizModal.addEventListener('click', function() {
      document.getElementById('quizModalQ').classList.remove('show');
      document.body.style.overflow = '';
    });
  }
 
  const quizSlidesContainer = document.getElementById('quizSlidesContainer');
  if (quizSlidesContainer) {
    quizSlidesContainer.addEventListener('click', handleQuizAnswer);
  }
 
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


function restartQuiz() {
  userAnswers = [];
  currentSlide = 0;
  createQuizSlides();
  showQuizSlide(0);
}

// Rehome Pet Modal
document.addEventListener('DOMContentLoaded', function() {
  
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

  if (rehomeModal) {
    rehomeModal.addEventListener('mousedown', function(e) {
      if (e.target === rehomeModal) {
        rehomeModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
 
  document.getElementById('petDisease').addEventListener('change', function() {
    document.getElementById('medicationSection').style.display = 
      this.value === 'Yes' ? 'block' : 'none';
  });

  
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

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      

      const response = await fetch('/api/post-requests', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Submission failed');
      }
  
   
      const result = await response.json();
      console.log('Submission successful:', result);
      
      showToast("Thank you for your request! We’ve received your submission and our team will review it soon.");
      

      this.reset();
      document.getElementById('fileCountMsg').textContent = '';
      document.getElementById('rehomePetModal').style.display = 'none';
      
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error: ${error.message}`);
    } finally {
    
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
  }, 3000); 
}

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

