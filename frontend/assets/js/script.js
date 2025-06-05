function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = "none";
    });

    // Show selected section
    document.getElementById(sectionId).style.display = "block";

    // Save selected section in localStorage
    localStorage.setItem("selectedSection", sectionId);

    // Highlight selected button in the navbar
    document.querySelectorAll('nav button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`nav button[data-section="${sectionId}"]`).classList.add('active');

}

// Ensure the correct section is visible on page load
document.addEventListener("DOMContentLoaded", function () {
    let savedSection = localStorage.getItem("selectedSection");

    if (savedSection) {
        showSection(savedSection); // Show the last selected section
    }
    else {
        showSection('home'); // Default to home if nothing is saved
    }
});

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

        const res = await fetch(`${backendUrl}/register`, {
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

        const res = await fetch(`${backendUrl}/login`, {
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
        if (data.message === "User Login successfully") {
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






// Adoptly  section

document.getElementById("pet-filter").addEventListener("change", function () {
    let selectedType = this.value; // Get selected value (dog, cat, or all)
    let pets = document.querySelectorAll(".pet-card");
    let noPetsMessage = document.getElementById("noPetsMessage");
    let hasPets = false;

    pets.forEach(pet => {
        if (selectedType === "all" || pet.getAttribute("data-type") === selectedType) {
            pet.style.display = "block"; // Show matched pets
            hasPets = true;
        } else {
            pet.style.display = "none"; // Hide unmatched pets
        }
    });

    // Show "No pets available" message if no pets are found
    noPetsMessage.style.display = hasPets ? "none" : "block";

});






// volunteer section

document.addEventListener("DOMContentLoaded", function () {
    // Get the current page URL
    let currentPage = window.location.pathname.split("/").pop();

    // Get all nav links
    let navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {
        let linkPage = link.getAttribute("href");

        // Compare and add 'active' class to the matching link
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });


    document.getElementById("volunteerForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch("/api/volunteerapplications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok) {
                document.getElementById('volunteerMessage').textContent = "Volunteer Application submitted successfully !";
                document.getElementById('volunteerMessage').style.color = "green";

                setTimeout(() => {
                    document.getElementById('volunteerMessage').textContent = "";
                    document.getElementById('volunteerForm').reset();
                }, 3000);
            } else {
                document.getElementById('volunteerMessage').textContent = result.error || "Failed to submit.";
            }
        } catch (err) {
            console.error('Error:', err);
            document.getElementById('volunteerMessage').textContent = "Failed to submit volunteer application. ";
            document.getElementById('volunteerMessage').style.color = "red";
        }
    });

});

//Services Section


function showserviceSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.service-section').forEach(section => {
        section.style.display = "none";
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }


    // Save selected service section in localStorage
    localStorage.setItem("selectedserviceSection", sectionId);

}

function closeserviceSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'none';
    }
}



//  post pet image section

const petImage = document.getElementById('petImageInput');
const fileLabel = document.querySelector('.file-label');

petImage.addEventListener('change', () => {
    if (petImage.files.length > 0) {
        fileLabel.textContent = petImage.files[0].name;
    } else {
        fileLabel.textContent = 'Choose a file'; // fallback label
    }
});


// post pet submission

const form = document.getElementById('petForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('petname').value.trim();
    const species = document.getElementById('petspecies').value.trim();
    const age = document.getElementById('petAge').value.trim();
    const breed = document.getElementById('petBreed').value.trim();
    const gender = document.getElementById('petGender').value.trim();
    const image = document.getElementById('petImageInput').files[0]; // ✅ Correct file object
    const description = document.getElementById('petDescription').value.trim();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('species', species);
    formData.append('age', age);
    formData.append('breed', breed);
    formData.append('gender', gender);
    formData.append('description', description);
    formData.append('petImage', image); // ✅ Must match backend multer field name

    const res = await fetch('http://localhost:5000/api/pet-requests', {
        method: 'POST',
        body: formData // ✅ Do NOT set Content-Type
    });

    const messageEl = document.getElementById('petpostmessage');

    if (res.ok) {
        messageEl.textContent = "Pet post request submitted successfully!";
        messageEl.style.color = "green";

        setTimeout(() => {
            messageEl.textContent = "";
            form.reset();
        }, 3000);
    } else {
        messageEl.textContent = "Something went wrong.";
        messageEl.style.color = "red";
    }

});



window.addEventListener('DOMContentLoaded', () => {
    fetch('/api/pet-requests/approved')
        .then(res => res.json())
        .then(pets => {
            const list = document.getElementById('petList');
            pets.filter(p => p.status === 'approved').forEach(pet => {
                list.innerHTML += `
          <div class="pet-card" data-type ="${pet.species}" >
            <img src="${pet.image}" alt="${pet.name}" width="200" />
              <div class="card-title"><h3>${pet.name}</h3></div>
              <p>Species:${pet.species}</p>
              <p>Age:${pet.age}</p>
              <p>Breed:${pet.breed}</p>
              <p>Gender:${pet.gender}</p>
              <p>Description:${pet.description}</p>

             <button class="adopt-now" onclick="openProfilePopup('../src/Adoptionapplication.html?petId=${pet._id}')">Adopt Now

                </button>
          </div>
        `;
            });
        });
});

// FAQ Section
document.addEventListener("DOMContentLoaded", function () {
    const faqDetails = document.querySelectorAll(".faq details");

    faqDetails.forEach(detail => {
        detail.addEventListener("click", function () {
            faqDetails.forEach(item => {
                if (item !== detail) {
                    item.removeAttribute("open");
                }
            });
        });
    });
});

// profiles popup section

function openProfilePopup(profileUrl) {
    document.getElementById("profileIframe").src = profileUrl;
    document.getElementById("profileModal").style.display = "flex";
}

function closeProfilePopup() {
    document.getElementById("profileModal").style.display = "none";
    document.getElementById("profileIframe").src = "";
}







