document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission
  
  // Get username and password from the form
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Add your authentication logic here (e.g., send a request to the server to verify credentials)
  // For example, you could use an AJAX request to send the credentials to a backend API
  
  // login authentication logic
  if (username === "admin1" && password === "abc123") {
    // Authentication successful, redirect to admin panel or perform necessary actions
    window.location.href = "admin.html"; // Redirect to admin.html
    // Redirect to admin panel
  } else {
    // Authentication failed, show error message or handle accordingly
    alert("Invalid username or password");
  }
});