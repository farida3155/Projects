document.addEventListener('DOMContentLoaded', function() {
  const statusFilter = document.getElementById('statusFilter');
  const requestsList = document.getElementById('requestsList');
  
  // Load requests based on filter
  function loadRequests(status = 'pending') {
    requestsList.innerHTML = '<p>Loading requests...</p>';
    
    // This would be replaced with actual API call
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
    
    requestsList.innerHTML = requests.map(request => `
      <div class="request-card" data-id="${request._id}">
        <div class="request-images">
          <img src="${request.images?.[0] || '/images/pawdefault.png'}" 
               alt="${request.petDetails?.name || 'Pet'}"
               onerror="this.src='/images/pawdefault.png'">
        </div>
        <div class="request-details">
          <h3>${request.petDetails?.name || 'Unknown'}</h3>
          <p><b>Breed:</b> <span>${request.petDetails?.breed || 'Unknown'}</span></p>
          <p><b>Type:</b> <span>${request.petDetails?.type || 'Unknown'}</span></p>
          <p><b>Location:</b> <span>${request.petDetails?.location || 'Unknown'}</span></p>
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
    `).join('');
    
    // Add event listeners to action buttons
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
  
  // Approve request
  function approveRequest(requestId) {
    fetch(`/api/post-requests/${requestId}/approve`, {
      method: 'POST'
    })
    .then(response => response.json())
    .then(() => {
      loadRequests(statusFilter.value);
    })
    .catch(error => {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    });
  }
  
  // Reject request
  function rejectRequest(requestId) {
    fetch(`/api/post-requests/${requestId}/reject`, {
      method: 'POST'
    })
    .then(response => response.json())
    .then(() => {
      loadRequests(statusFilter.value);
    })
    .catch(error => {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    });
  }
  
  // Filter change handler
  statusFilter.addEventListener('change', function() {
    loadRequests(this.value === 'all' ? '' : this.value);
  });
  
  // Initial load
  loadRequests();
});