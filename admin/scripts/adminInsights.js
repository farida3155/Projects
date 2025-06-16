document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/admin/insights')
      .then(res => res.json())
      .then(data => {
        // Set stats
        document.getElementById('pendingRequestsCard').textContent = `Pending Requests: ${data.pendingRequests}`;
        document.getElementById('petsOnBoardCard').textContent = `Pets on Board: ${data.petsOnBoard}`;
  
        // Chart data
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
        console.error("Error loading insights:", err);
      });
  });
  