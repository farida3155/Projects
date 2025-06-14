document.querySelectorAll(".toggle").forEach(button => {
  button.addEventListener("click", () => {
    
    const content = button.nextElementSibling;
    content.classList.toggle("active");
  });
});


document.querySelectorAll(".preview-link").forEach(container => {
  const link = container.dataset.link;

  fetch(`https://api.microlink.io/?url=${encodeURIComponent(link)}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === "success" && data.data) {
        const { title, description, image, url } = data.data;
        container.innerHTML = `
          <div class="link-preview-card">
            <img src="${image?.url || ''}" alt="${title}" class="link-img"/>
            <div class="link-content">
              <h4>${title}</h4>
              <p>${description}</p>
              <a href="${url}" target="_blank">Visit</a>
            </div>
          </div>
        `;
      } else {
        container.innerHTML = `<p>Preview unavailable. <a href="${link}" target="_blank">Visit here</a></p>`;
      }
    })
    .catch(() => {
      container.innerHTML = `<p>Error loading preview. <a href="${link}" target="_blank">Visit here</a></p>`;
    });
});


const breedSelect = document.getElementById("breedSelect");
const breedInfo = document.getElementById("breedInfo");
const productRecommendations = document.getElementById("productRecommendations");
const breedImg = document.getElementById("breed-img");

const API_KEY = "live_MKzrnZsIbvokTA4iIiYh2gCYwqqCpqdrx7NBbR4FobxPgIB6pCdKcznR0BHBYmWt"; // Replace with your free TheCatAPI key

// Maps breed names in your HTML to API breed IDs
const breedMap = {
  "Persian": "pers",
  "Siamise": "siam",  // Typo in your HTML ("Siamise" vs "Siamese") — keep consistent
  "Maine Coon": "mcoo"
};

breedSelect.addEventListener("change", async function () {
  const selected = breedSelect.value;

  // Reset if none selected
  if (!selected || !breedMap[selected]) {
    breedInfo.innerHTML = "";
    productRecommendations.innerHTML = "";
    breedImg.src = "images/cat5.jpg";
    return;
  }

  const breedId = breedMap[selected];

  try {
    const res = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`, {
      headers: { "x-api-key": API_KEY }
    });
    const data = await res.json();

    const breedData = data[0]?.breeds[0];
    const imgUrl = data[0]?.url;

    if (!breedData) {
      breedInfo.innerHTML = "<p>Sorry, no info available.</p>";
      return;
    }

    // Update image
    if (imgUrl) {
      breedImg.src = imgUrl;
    }

    // Breed info
    breedInfo.innerHTML = `
      <h3>${breedData.name}</h3>
      <p><strong>Origin:</strong> ${breedData.origin}</p>
      <p><strong>Temperament:</strong> ${breedData.temperament}</p>
      <p><strong>Description:</strong> ${breedData.description}</p>
    `;

    // Product logic based on breed traits
    let grooming, food, accessories;
    const isLongHair = breedData.description.toLowerCase().includes("long");
    const isPlayful = breedData.temperament.toLowerCase().includes("playful");
    const isAffectionate = breedData.temperament.toLowerCase().includes("affectionate");

    grooming = isLongHair ? "Long-hair grooming brush, detangling spray" : "Slicker brush, nail clippers";
    food = isPlayful ? "High-protein diet, energy-boosting snacks" : "Indoor cat formula, hairball control food";
    accessories = isAffectionate ? "Window hammock, soft bed" : "Cat tunnel, interactive toys";

    productRecommendations.innerHTML = `
      <h4>Recommended Essentials:</h4>
      <ul>
        <li><strong>Grooming:</strong> ${grooming}</li>
        <li><strong>Food:</strong> ${food}</li>
        <li><strong>Accessories & Toys:</strong> ${accessories}</li>
      </ul>
    `;
  } catch (error) {
    console.error("Error fetching breed data:", error);
    breedInfo.innerHTML = "<p>Error fetching breed data.</p>";
  }
});
