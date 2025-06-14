


// Toggle collapsible sections
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

const dogBreedSelect = document.getElementById("breedSelect");
const dogBreedInfo = document.getElementById("breedInfo");
const dogProductRecommendations = document.getElementById("productRecommendations");
const dogImg = document.getElementById("breed-img");

const DOG_API_KEY = "live_PUS1LMVvlm30AXhGmcnUQatvsvNUIGGChGhLPvrdFsxVsbH3MPys6qMsDZqJmFV2"; // Replace with your real key

// Example breed map – real IDs may differ
const dogBreedMap = {
  "Labrador Retriever": 149,
  "German Shepherd": 115,
  "Golden Retriever": 121,
  "Beagle":31,
};

dogBreedSelect.addEventListener("change", async function () {
  const selected = dogBreedSelect.value;

  if (!selected || !dogBreedMap[selected]) {
    dogBreedInfo.innerHTML = "";
    dogProductRecommendations.innerHTML = "";
    dogImg.src = "images/dog-placeholder.jpg";
    return;
  }

  const breedId = dogBreedMap[selected];

  try {
    const res = await fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${breedId}`, {
      headers: { "x-api-key": DOG_API_KEY }
    });

    const data = await res.json();
    const breedData = data[0]?.breeds[0];
    const imgUrl = data[0]?.url;

    if (!breedData) {
      dogBreedInfo.innerHTML = "<p>Sorry, no info available.</p>";
      return;
    }

    // Image update
    if (imgUrl) {
      dogImg.src = imgUrl;
    }

    dogBreedInfo.innerHTML = `
      <h3>${breedData.name}</h3>
      <p><strong>Life Span:</strong> ${breedData.life_span || "Unknown"}</p>
      <p><strong>Temperament:</strong> ${breedData.temperament}</p>
      <p><strong>Bred For:</strong> ${breedData.bred_for || "N/A"}</p>
    `;

    // Product logic based on temperament
    const isActive = breedData.temperament?.toLowerCase().includes("active");
    const isFriendly = breedData.temperament?.toLowerCase().includes("friendly");
    const isLarge = breedData.weight.metric.split(" - ")[1] > 25; // weight in kg

    const grooming = isLarge ? "Heavy-duty brush, paw cleaner" : "Soft bristle brush, dog wipes";
    const food = isActive ? "High-protein dry food, joint supplements" : "Regular adult dog food";
    const accessories = isFriendly ? "Chew toys, comfy bed" : "Training collar, treat pouch";

    dogProductRecommendations.innerHTML = `
      <h4>Recommended Essentials:</h4>
      <ul>
        <li><strong>Grooming:</strong> ${grooming}</li>
        <li><strong>Food:</strong> ${food}</li>
        <li><strong>Accessories & Toys:</strong> ${accessories}</li>
      </ul>
    `;
  } catch (error) {
    console.error("Error fetching dog breed data:", error);
    dogBreedInfo.innerHTML = "<p>Error fetching breed data.</p>";
  }
});

// Fetch and embed link previews using Microlink API


