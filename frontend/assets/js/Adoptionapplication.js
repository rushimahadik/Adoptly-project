
// Handle form submission
document.getElementById('adoptionForm').addEventListener('submit', async (e) => {
  e.preventDefault();
   
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());



  try {
    const res = await fetch('/api/adoptionapplications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      document.getElementById('submissionMessage').textContent = "Adoption Application submitted successfully!";
      document.getElementById('submissionMessage').style.color = "green"; // Change message color to green document.getElementById('profileModal').style.display = 'none';

      setTimeout(() => {
        document.getElementById('submissionMessage').textContent = ""; // Clear message after 1.5 seconds
        document.getElementById('adoptionForm').reset(); // Reset the form after submission
      }, 3000);
    } else {
      document.getElementById('submissionMessage').textContent = result.error || "Failed to submit.";
    }

  } catch (err) {
    console.error('Error:', err);
    document.getElementById('submissionMessage').textContent = "Failed to submit adoption application.";
    document.getElementById('submissionMessage').style.color = "red";
  }
});

// Get petId from the URL
const urlParams = new URLSearchParams(window.location.search);
const petId = urlParams.get('petId');

// Set it into the form
if (petId) {
  document.getElementById('petId').value = petId;
}
