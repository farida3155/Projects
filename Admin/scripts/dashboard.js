document.addEventListener("DOMContentLoaded", () => {
  fetchStats();
  renderAdoptionChart();
});

function fetchStats() {
  fetch('/api/admin/insights')
    .then(res => res.json())
    .then(data => {
     
      document.getElementById('boardingCount').innerText = data.newBoardings || 0;
      document.getElementById('activeUsers').innerText = data.activeUsers || 0;
      document.getElementById('revenue').innerText = `$${data.totalRevenue || 0}`;
       document.getElementById('adoptCount').innerText = data.pendingRequests + " pending";
document.getElementById('petsCount').innerText = data.petsOnBoard || 0;
    })
    .catch(err => {
      console.error("Error fetching stats:", err);
    });
}

function renderAdoptionChart() {
  fetch('/api/admin/insights')
    .then(res => res.json())
    .then(data => {
      const ctx = document.getElementById('adoptionChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.adoptionTrends.map(entry => entry.date),
          datasets: [{
            label: 'Adoption Requests',
            data: data.adoptionTrends.map(entry => entry.count),
            borderColor: '#6c63ff',
            backgroundColor: 'rgba(108,99,255,0.1)',
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          }
        }
      });
    })
    .catch(err => {
      console.error("Error loading chart data:", err);
    });
}

// Optional: navigation from widget boxes
function goTo(page) {
  window.location.href = "/admin/" + page;
}
