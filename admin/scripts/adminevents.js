document.addEventListener('DOMContentLoaded', () => {
    const eventList = document.getElementById('event-list');
    const addBtn = document.getElementById('add-event-btn');
    const deleteBtn = document.getElementById('delete-event-btn');
    const addEventForm = document.getElementById('add-event-form');
    const cancelAddEvent = document.getElementById('cancel-add-event');
    let selectedEventId = null;
  
    function fetchEvents() {
      fetch('/admin/events')
        .then(res => res.json())
        .then(data => {
          eventList.innerHTML = '';
          data.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.innerHTML = `
              <input type="radio" name="selectEvent" value="${event._id}">
              <div class="date-box">${event.date}<br><span>${event.month}</span></div>
              <img src="${event.img}" alt="Event Image">
              <div class="event-content">
                <h2>${event.title}</h2>
                <p class="event-time">${event.time}</p>
                <p>${event.desc}</p>
              </div>
            `;
            eventList.appendChild(eventDiv);
          });
          document.querySelectorAll('input[name="selectEvent"]').forEach(input => {
            input.addEventListener('change', (e) => {
              selectedEventId = e.target.value;
            });
          });
        });
    }
  
    addBtn.addEventListener('click', () => {
      addEventForm.style.display = 'block';
    });
  
    cancelAddEvent.addEventListener('click', () => {
      addEventForm.style.display = 'none';
      addEventForm.reset();
    });
  
    addEventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const event = {
        title: document.getElementById('event-title').value,
        date: document.getElementById('event-date').value,
        month: document.getElementById('event-month').value,
        time: document.getElementById('event-time').value,
        img: document.getElementById('event-img').value,
        desc: document.getElementById('event-desc').value,
      };
      fetch('/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).then(res => {
        if (res.ok) {
          addEventForm.reset();
          addEventForm.style.display = 'none';
          fetchEvents();
        }
      });
    });
  
    deleteBtn.addEventListener('click', () => {
      if (!selectedEventId) {
        alert('Please select an event to delete.');
        return;
      }
      fetch(`/admin/events/${selectedEventId}`, {
        method: 'DELETE',
      }).then(res => {
        if (res.ok) fetchEvents();
      });
    });
  
    fetchEvents();
  });
  