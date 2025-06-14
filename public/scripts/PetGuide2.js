document.addEventListener('DOMContentLoaded', () => {
    const petSelector = document.querySelector('.pet-type-selector');
    const petTypes = document.querySelectorAll('.pet-type-selector span');
    
    // Adjust underline behavior
    const underline = document.createElement('div');
    underline.classList.add('underline');
    petSelector.appendChild(underline);  // Add the underline div

    petTypes.forEach((type, index) => {
        type.addEventListener('click', () => {
            petTypes.forEach(el => el.classList.remove('active'));
            type.classList.add('active');

            // Move the underline
            underline.style.width = `${type.offsetWidth}px`;
            underline.style.left = `${type.offsetLeft}px`;

            // Toggle between dog and cat cards
            const selectedPetType = type.textContent.toLowerCase(); // 'dogs' or 'cats'
            switchPetType(selectedPetType);
        });
    });

    // Show description
    window.showDescription = function(breedId) {
        const breedName = document.querySelector(`#${breedId} h3`).textContent;
        const breedDescription = getDescriptionById(breedId);

        // Get the specific description container for the breed
        const container = document.querySelector(`#${breedId} .description-container`);
        const isActive = container.classList.contains('active');

        // If the description is already active, close it
        if (isActive) {
            container.classList.remove('active');
        } else {
            // Close all other descriptions first
            const allDescriptions = document.querySelectorAll('.description-container');
            allDescriptions.forEach(desc => desc.classList.remove('active'));

            // Now open the clicked description
            container.querySelector('.breed-title').textContent = breedName;
            container.querySelector('.breed-description').textContent = breedDescription;

            const adoptButtonLink = container.querySelector('#adopt-now-link');
            if (adoptButtonLink) {
                adoptButtonLink.href = `adopt.html?breed=${breedId}`;
            }

            container.classList.add('active');
        }
    };

    // Description fetch based on breed ID
    function getDescriptionById(id) {
        const descriptions = {
            frenchbulldog: 'Gentle and courageous companion.',
            germanshepherd: 'Loyal and intelligent.',
            labrador: 'Friendly, outgoing, and high-spirited.',
            beagle: 'Cheerful, curious, and friendly.',
            goldenretriever: 'Friendly and intelligent family dog.',
            husky: 'Energetic, friendly, and loyal.',
            cocker: 'Affectionate, intelligent, and merry.',
            baladi: 'A local breed, affectionate and smart.',
            bordercollie: 'Highly intelligent and energetic.',
            chihuahua: 'Tiny but brave.',
            pug: 'Charming and comical.',
            boxer: 'Energetic and playful.',
            bolognese: 'Affectionate and loyal.',
            jackrussel: 'Friendly and energetic.',
            rottweiler: 'Confident and fearless.',
            siemese: 'Affectionate and intelligent.',
            persian: 'Calm and loving.',
            mainecoon: 'Large, friendly, and affectionate.',
            baladicat: 'A local breed, affectionate and smart.',
            ragdoll: 'Highly intelligent and energetic.',
            scottishfold: 'Loyal and intelligent.',
            sphynx:'Charming and comical.',
            norwiegien: 'Cheerful, curious, and friendly.',
        };
        return descriptions[id] || 'No description available.';
    }

    // Function to switch between dog and cat cards
    function switchPetType(type) {
        const dogCards = document.querySelectorAll('.dog-card');
        const catCards = document.querySelectorAll('.cat-card');

        // Show/hide cards based on selected pet type
        if (type === 'dogs') {
            dogCards.forEach(card => card.style.display = 'block');
            catCards.forEach(card => card.style.display = 'none');
        } else if (type === 'cats') {
            dogCards.forEach(card => card.style.display = 'none');
            catCards.forEach(card => card.style.display = 'block');
        }
    }
});
