document.addEventListener('DOMContentLoaded', () => {
  // Fetch and display events
  fetch('/admin/events')
    .then(res => res.json())
    .then(data => {
      const eventsSection = document.querySelector('.events-list');
      eventsSection.innerHTML = '';
      data.forEach(event => {
        eventsSection.innerHTML += `
          <div class="event">
            <div class="date-box">${event.date}<br><span>${event.month}</span></div>
            <img src="${event.img}" alt="Event">
            <div class="event-content">
              <h2>${event.title}</h2>
              <p class="event-time">${event.time}</p>
              <p>${event.desc}</p>
            </div>
          </div>
        `;
      });
    });

  // Correct selectors to match your HTML:
  const form = document.querySelector('#subscribeForm');
  const emailInput = document.querySelector('#emailInput');
  const statusMessage = document.querySelector('#statusMessage');

  if (form && emailInput && statusMessage) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusMessage.textContent = '';
      statusMessage.style.color = '';

      const email = emailInput.value.trim();
      if (!email) {
        statusMessage.textContent = 'Please enter a valid email address.';
        statusMessage.style.color = 'red';
        return;
      }

      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await response.json();

        statusMessage.textContent = data.message;
        statusMessage.style.color = data.success ? 'green' : 'red';

        if (data.success) {
          form.reset();
        }
      } catch (err) {
        statusMessage.textContent = 'An error occurred. Please try again.';
        statusMessage.style.color = 'red';
      }
    });
  }
});
