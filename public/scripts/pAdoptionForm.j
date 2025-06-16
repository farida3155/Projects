
  // Show selected pet name from localStorage
  document.addEventListener('DOMContentLoaded', () => {
  
    // Form handling
    const form = document.getElementById('adoptionForm');

    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Stop normal form submission

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('/api/adoption', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          showSuccessModal();
          form.reset();
        } else {
          alert(result.message || '❌ Something went wrong.');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        alert('⚠️ Failed to submit form. Please try again later.');
      }
    });
  });

  function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';
  }

  function closeModal() {
    document.getElementById('successModal').style.display = 'none';
  }

