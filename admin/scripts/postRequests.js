document.addEventListener('DOMContentLoaded', function() {
  const statusFilter = document.getElementById('statusFilter');
  const requestsList = document.getElementById('requestsList');
  
  // FILTER
  function loadRequests(status = 'pending') {
    requestsList.innerHTML = '<p>Loading requests...</p>';
    
    fetch(`/api/post-requests?status=${status}`)
      .then(response => response.json())
      .then(requests => {
        renderRequests(requests);
      })
      .catch(error => {
        console.error('Error loading requests:', error);
        requestsList.innerHTML = `<p class="error">Error loading requests: ${error.message}</p>`;
      });
  }
  
  // Render requests
  function renderRequests(requests) {
    if (!requests || requests.length === 0) {
      requestsList.innerHTML = '<p>No requests found</p>';
      return;
    }
    
    requestsList.innerHTML = requests.map(request => {
      const pd = request.petDetails || {};
      const owner = request.ownerDetails || {};
      const health = pd.healthInfo || {};
      const behavior = pd.behavior || {};
   
      const ageStr = pd.age && typeof pd.age.value === "number" && pd.age.unit
        ? `${pd.age.value} ${pd.age.unit}`
        : "Unknown";
      return `
        <div class="request-card" data-id="${request._id}">
          <div class="request-images">
            <img src="${request.images?.[0] || '/images/pawdefault.png'}" 
                 alt="${pd.name || 'Pet'}"
                 onerror="this.src='/images/pawdefault.png'">
          </div>
          <div class="request-details">
            <h3>${pd.name || 'Unknown'}</h3>
            <p><b>Breed:</b> <span>${pd.breed || 'Unknown'}</span></p>
            <p><b>Type:</b> <span>${pd.type || 'Unknown'}</span></p>
            <p><b>Gender:</b> <span>${pd.gender || 'Unknown'}</span></p>
            <p><b>Age:</b> <span>${ageStr}</span></p>
            <p><b>Neutered:</b> <span>${pd.neutered || 'Unknown'}</span></p>
            <p><b>Location:</b> <span>${pd.location || 'Unknown'}</span></p>
            <p><b>Health - Has Disease:</b> <span>${health.hasDisease || 'Unknown'}</span></p>
            <p><b>Health - Medication:</b> <span>${health.medication || 'None'}</span></p>
            <p><b>Behavior - Good with Children/Others:</b> <span>${behavior.goodWithChildren || 'Unknown'}</span></p>
            <p><b>Extra Notes:</b> <span>${behavior.notes || 'None'}</span></p>
            <hr>
            <p><b>Owner Name:</b> <span>${owner.name || 'Unknown'}</span></p>
            <p><b>Owner Phone:</b> <span>${owner.phone || 'Unknown'}</span></p>
            <p><b>Owner Email:</b> <span>${owner.email || 'Unknown'}</span></p>
            <p><b>Home Preferences:</b> <span>${request.homePreferences || 'None'}</span></p>
            <p><b>Submitted:</b> <span>${new Date(request.createdAt).toLocaleDateString()}</span></p>
            <p><b>Status:</b> <span class="status-${request.status}">${request.status || 'Unknown'}</span></p>
            <div class="request-actions">
              ${request.status === 'pending' ? `
                <button class="approve-btn">Approve</button>
                <button class="reject-btn">Reject</button>
              ` : ''}
              <button class="view-details">View Details</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
    

    document.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const requestId = this.closest('.request-card').dataset.id;
        approveRequest(requestId);
      });
    });
    
    document.querySelectorAll('.reject-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const requestId = this.closest('.request-card').dataset.id;
        rejectRequest(requestId);
      });
    });
  }
  
  // APPROVE
  function approveRequest(requestId) {
    fetch(`/api/post-requests/${requestId}/approve`, {
      method: 'POST'
    })
    .then(response => response.json())
    .then(result => {
      if (!result.success) {
        alert(result.error || 'Failed to approve request');
      }
      loadRequests(statusFilter.value);
    })
    .catch(error => {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    });
  }
  
  // REJECT
  function rejectRequest(requestId) {
    fetch(`/api/post-requests/${requestId}/reject`, { method: 'POST' })
    .then(response => response.json())
    .then(result => {
      if (!result.success) {
        alert(result.error || 'Failed to reject request');
      }
      loadRequests(statusFilter.value);
    })
    .catch(error => {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    });
  }
  
  
  statusFilter.addEventListener('change', function() {
    loadRequests(this.value === 'all' ? '' : this.value);
  });
  
 
  loadRequests();
});
