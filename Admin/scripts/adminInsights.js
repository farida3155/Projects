document.addEventListener("DOMContentLoaded", () => {
  fetch('/api/admin/insights')
    .then(res => res.json())
    .then(data => {
      // Set stats
      document.getElementById('pendingRequestsCard').textContent = `Pending Requests: ${data.pendingRequests}`;
      document.getElementById('petsOnBoardCard').textContent = `Pets on Board: ${data.petsOnBoard}`;

      // Chart data
      const labels = data.adoptionTrends.map(item => item._id);
      const values = data.adoptionTrends.map(item => item.count);

      const ctx = document.getElementById('adoptionChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Adoption Requests per Month',
            data: values,
            fill: false,
            borderColor: 'purple',
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    })
    .catch(err => {
      console.error("Error loading insights:", err);
    });
});
