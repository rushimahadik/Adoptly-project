// Show/hide sections with persistence
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = "none";
  });

  document.getElementById(sectionId).style.display = "block";
  localStorage.setItem("selectedSection", sectionId);

  document.querySelectorAll('.sidebar button').forEach(button => {
    button.classList.remove('active');

  });

  document.querySelector(`.sidebar button[data-section="${sectionId}"]`).classList.add('active');

}

document.addEventListener("DOMContentLoaded", function () {
  const savedSection = localStorage.getItem("selectedSection") || 'adoption-requests';
  showSection(savedSection);
  updateDateTime();
  setInterval(updateDateTime, 1000);


  loadAdoptionRequests(); //load pending requests
  loadAdoptionHistory(); // load approved requests
  loadPetRequests();      // Load pending pets
  loadApprovedPets();     // Load approved pets
  loadVolunteerRequests(); // load pending requests

});


function updateDateTime() {
  const now = new Date();
  const formattedDate = now.toLocaleString();
  document.getElementById("datetime").innerHTML = formattedDate;
}

//  LOGIN PAGE POP

function toggleForm() {
  document.getElementById("login-form").classList.toggle("hidden");
  document.getElementById("register-form").classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", function () {
  // Get elements
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginMessage = document.getElementById("loginMessage");
  const registerMessage = document.getElementById("registerMessage");

  var modal = document.getElementById("loginModal");
  // Get open modal button
  var loginBtn = document.getElementById("loginButton");
  // Get close button
  var closeBtn = document.getElementById("closeModal");



  // Listen for open click
  loginBtn.addEventListener("click", openModal);
  // Listen for close click
  closeBtn.addEventListener("click", closeModal);
  // Listen for outside click
  window.addEventListener("click", outsideClick);


  // Function to open modal
  function openModal() {
    modal.style.display = "flex";
    document.body.classList.add("modal-open");
  }
  // Function to close modal
  function closeModal() {
    modal.style.display = "none";
    document.body.classList.remove("modal-open"); // Remove blur effect
    loginMessage.innerText = ""; // Clear message
    registerMessage.innerText = ""; // Clear message
  }

  // Close modal when clicking outside of it
  function outsideClick(e) {
    if (e.target == modal) {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  }



  // Register & Login form submission

  const backendUrl = 'http://localhost:5000';

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value
    };

    const res = await fetch(`${backendUrl}/adminregister`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    const msgEl = document.getElementById('registerMessage');
    msgEl.style.color = "green";
    msgEl.textContent = data.message || data.error;
    msgEl.style.color = data.message ? "green" : "red";

    // Redirect to login after 2 seconds
    if (data.message) {
      setTimeout(() => {
        toggleForm(); // Switch to login form
      }, 1000);
    }

  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value
    };

    const res = await fetch(`${backendUrl}/adminlogin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    const msgEl = document.getElementById('loginMessage');
    msgEl.style.color = "green";
    msgEl.textContent = data.message || data.error;
    msgEl.style.color = data.message ? "green" : "red";


    // Redirect to homepage after 2 seconds
    if (data.message === "Admin Login successfully") {
      sessionStorage.setItem("isLoggedIn", "true");  // set login flag
      sessionStorage.setItem("username", data.username);  // store username
      setTimeout(() => {
        closeModal(); // Close modal  
      }, 2000);

      window.location.reload(); // Reload the page to show the homepage

    }
  });

});


const isLoggedIn = sessionStorage.getItem("isLoggedIn");
const username = sessionStorage.getItem("username"); // get username from session storage

// Redirect to login page if not logged in
if (isLoggedIn === "true" && username) {
  document.getElementById("loginModal").style.display = "none"; // Hide login modal if logged in
  document.body.classList.remove("modal-open"); // Remove blur effect

  // Show user info and hide login button
  document.getElementById("loginButton").classList.add("hidden");
  document.getElementById("logoutBtn").classList.remove("hidden");
  document.getElementById("userInfo").classList.remove("hidden");
  document.getElementById("userInfo").textContent = `${username}'s`; // Display username

}

function confirmLogout() {
  return confirm("Are you sure you want to log out?");
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.clear(); // clear login data


  // Reset UI without reloading the page 

  document.getElementById("logoutBtn").classList.add("hidden");
  document.getElementById("userInfo").classList.add("hidden");
  document.getElementById("loginButton").classList.remove("hidden");

  window.location.reload(); // Reload the page to show the homepage
});


// Pet add image label update
const fileInput = document.getElementById('fileInput');
const fileLabel = document.querySelector('.file-label');

if (fileInput && fileLabel) {
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      fileLabel.textContent = fileInput.files[0].name;
    }
  });
}


function loadAdoptionRequests() {
  const container = document.getElementById("adoption-requests");
  if (!container) return;


  fetch('/api/adoptionapplications')
    .then(res => res.json())
    .then(requests => {
      container.innerHTML = ''; // Clear previous content

      if (requests.length === 0) {
        container.innerHTML = "<p class='no-requests'>No adoption requests.</p>";
      } else {
        requests.forEach(req => {
          const card = document.createElement('div');
          card.className = 'request-card';

          card.innerHTML = `
            <p><strong>Name:</strong><br> ${req.applicantName}</p>
            <p><strong>Email:</strong><br> ${req.email}</p>
            <p><strong>Phone:</strong><br> ${req.phone}</p>
            <p><strong>Address:</strong><br> ${req.address}</p>
            <p><strong>Reason:</strong><br> ${req.reason}</p>
            <p><strong>Household Agreement:</strong><br> ${req.household_agreement}</p>
           <button class="approve-btn">Approve</button>
           <button class="reject-btn">Reject</button>
          `;

          // Approve and Reject button logic
          card.querySelector(".approve-btn").onclick = () => Status(req._id, "approved", card);
          card.querySelector(".reject-btn").onclick = () => Status(req._id, "rejected", card);

          container.appendChild(card);
        });
      }
    }).catch(err => {
      console.error('Error fetching pet requests:', err);
      container.innerHTML = "<p class='error'>Failed to load adoption application requests:</p>";
    });

}


// Update status of a pet (approve/reject)

function Status(id, status, card) {
  fetch(`/api/approveapplication/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }) // Optional for future-proofing
  })
    .then(res => {
      if (res.ok) {
        card.remove();
        window.location.reload();
      } else {
        alert(`Error ${status} request`);
      }
    });
}


function loadAdoptionHistory() {
  const container = document.getElementById("adoption-history");
  if (!container) return;

  fetch('/api/adoptionapplications/approved')
    .then(res => res.json())
    .then(applications => {
      container.innerHTML = '';

      if (applications.length === 0) {
        container.innerHTML = "<p class='no-requests'>No approved adoption requests.</p>";
      } else {
        applications.forEach(app => {
          const card = document.createElement("div");
          card.className = "request-card";

          card.innerHTML = `
            <p><strong>Name:</strong><br> ${app.applicantName}</p>
            <p><strong>Email:</strong><br> ${app.email}</p>
            <p><strong>Phone:</strong><br> ${app.phone}</p>
            <p><strong>Address:</strong><br> ${app.address}</p>
            <p><strong>Reason:</strong><br> ${app.reason}</p>
            <p><strong>Household Agreement:</strong><br> ${app.household_agreement}</p>
              <div class="card-buttons">
                <button class="delete-btn">Delete</button>
              </div>
            </div>
          `;

          // button logic
          card.querySelector(".delete-btn").onclick = () => deleteapplication(app._id, card);

          container.appendChild(card);
        });
      }
    })
    .catch(err => {
      console.error('Error loading approved pets:', err);
    });
}


function deleteapplication(id, card) {
  fetch(`/api/approvedadoptions/${id}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (res.ok) {
        card.remove();
        window.location.reload();
      } else {
        alert("Failed to delete pet.");
      }
    })
    .catch(err => {
      console.error("Delete failed:", err);
    });
}




// Load post pet requests from server
function loadPetRequests() {
  const container = document.getElementById("post-pet-requests");
  if (!container) return;

  fetch('/api/pet-requests')
    .then(res => res.json())
    .then(requests => {
      container.innerHTML = ''; // Clear any old content

      if (requests.length === 0) {
        container.innerHTML = "<p class='no-requests'>No post pet requests.</p>";
      } else {
        requests.forEach(req => {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
            <div class="pet-card">
              <img src="${req.image}" alt="Pet Image" width="200" />
              <div class="card-title"><h3>${req.name}</h3></div>
              <p>Species:<br>${req.species}</p>
              <p>Age:<br>${req.age}</p>
              <p>Breed:<br>${req.breed}</p> 
              <p>Gender:<br>${req.gender}</p>
              <p>Description:<br>${req.description}</p>
              <div class="card-status">Status:<br>${req.status}</div>
              <div class="card-date">Submitted At:<br>${new Date(req.submitedAt || Date.now()).toLocaleDateString()}</div>
              <div class="card-buttons">
                <button class="approve-btn">Approve</button>
                <button class="reject-btn">Reject</button>
              </div>
            </div>
          `;

          // Approve and Reject button logic
          card.querySelector(".approve-btn").onclick = () => updateStatus(req._id, "approved", card);
          card.querySelector(".reject-btn").onclick = () => updateStatus(req._id, "rejected", card);

          container.appendChild(card);
        });
      }
    })
    .catch(err => {
      console.error('Error fetching pet requests:', err);
      container.innerHTML = "<p class='error'>Failed to load requests.</p>";
    });

}

// Update status of a pet (approve/reject)
function updateStatus(id, status, card) {
  fetch(`/api/pet-requests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).then(res => {
    if (res.ok) {
      card.remove(); // Remove card from UI
      window.location.reload();
    } else {
      alert('Failed to update status.');
    }
  }).catch(err => {
    console.error('Error updating status:', err);
  });
}


function loadApprovedPets() {
  const container = document.getElementById("approved-pets");
  if (!container) return;

  fetch('/api/pet-requests/approved')
    .then(res => res.json())
    .then(pets => {
      container.innerHTML = '';

      if (pets.length === 0) {
        container.innerHTML = "<p class='no-requests'>No approved pets.</p>";
      } else {
        pets.forEach(pet => {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
            <div class="pet-card">
             <img src="${pet.image}" alt="Pet Image" width="200" />
              <div class="card-title"><h3>${pet.name}</h3></div>
              <p>Species:<br>${pet.species}</p>
              <p>Age:<br>${pet.age}</p>
              <p>Breed:<br>${pet.breed}</p>
              <p>Gender:<br>${pet.gender}</p>
              <p>Description:<br>${pet.description}</p>
              <div class="card-status">Status:<br>${pet.status}</div>
              <div class="card-date">Approved At:<br>${new Date(pet.updatedAt || Date.now()).toLocaleDateString()}</div>
              <div class="card-buttons">
                <button class="remove-btn">Remove</button>
                <button class="delete-btn">Delete</button>
              </div>
            </div>
          `;

          // button logic
          card.querySelector(".remove-btn").onclick = () => removePet(pet._id, card);
          card.querySelector(".delete-btn").onclick = () => deletePet(pet._id, card);

          container.appendChild(card);
        });
      }
    })
    .catch(err => {
      console.error('Error loading approved pets:', err);
    });
}


function deletePet(id, card) {
  fetch(`/api/approved-pets/${id}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (res.ok) {
        card.remove();
        window.location.reload();
      } else {
        alert("Failed to delete pet.");
      }
    })
    .catch(err => {
      console.error("Delete failed:", err);
    });
}

function removePet(id, card) {
  fetch(`/api/approved-pets/${id}`, {
    method: 'PATCH', // Use PATCH to update status
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'pending' }), // Change status to pending
  })
    .then(res => {
      if (res.ok) {
        card.remove();
        window.location.reload();
        // Move the pet card back to "Post Pet Request" section
        const petCard = button.closest('.pet-card');
        const postPetSection = document.getElementById('post-pet-requests');
        postPetSection.appendChild(petCard);
      } else {
        alert('Failed to remove pet.');
      }
    })
    .catch(err => {
      console.error("Error:", err);
    });

}


// Load post pet requests from server
function loadVolunteerRequests() {
  const container = document.getElementById("volunteer-requests");
  if (!container) return;

  fetch('/api/volunteerapplications')
    .then(res => res.json())
    .then(requests => {
      container.innerHTML = ''; // Clear any old content

      if (requests.length === 0) {
        container.innerHTML = "<p class='no-requests'>No volunteer application requests.</p>";
      } else {
        requests.forEach(req => {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
            <div class="request-card">
              <p>Volunteer Name:<h3>${req.name}</h3></p>
              <p>Dob:<br>${req.dob}</p>
              <p>Phone no:<br>${req.phone}</p>
              <p>Email:<br>${req.email}</p> 
              <p>Address:<br>${req.address}</p>
              <p>Days to Volunteer:<br>${req.days}</p>
              <p>Hours to Volunteer:<br>${req.hours}</p>
              <p>Experience:<br>${req.experience}</p>
              <p>Tasks:<br>${req.tasks}</p>
              <p>Health:<br>${req.health}</p>
              <p>WhyVolunteer:<br>${req.whyVolunteer}</p>
              <p>PreviousVolunteer:<br>${req.previousVolunteer}</p>
              <div class="card-status">Status:<br>${req.status}</div>
              <div class="card-date">Submitted At:<br>${new Date(req.submitedAt || Date.now()).toLocaleDateString()}</div>
              <div class="card-buttons">
                <button class="approve-btn">Approve</button>
                <button class="reject-btn">Reject</button>
              </div>
            </div>
          `;

          // Approve and Reject button logic
          card.querySelector(".approve-btn").onclick = () => update(req._id, "approved", card);
          card.querySelector(".reject-btn").onclick = () => update(req._id, "rejected", card);

          container.appendChild(card);
        });
      }
    })
    .catch(err => {
      console.error('Error fetching pet requests:', err);
      container.innerHTML = "<p class='error'>Failed to load requests.</p>";
    });

}

function update(id, status, card) {
  fetch(`/api/volunteerapplications/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {

        if (card) {
          card.remove();
          window.location.reload();
        }

      } else {
        alert(`Failed to update status: ${data.error}`);
      }
    })
    .catch(err => {
      console.error('Status update failed:', err);
    });
}

