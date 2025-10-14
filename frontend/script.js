const API_URL = "http://127.0.0.1:5000"; // change to EC2 URL later

// ---------------- LOGIN ----------------
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert("Please enter username and password");
        return;
    }

    fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alert("Login successful!");
            localStorage.setItem("username", username);
            window.location.href = "dashboard.html";
        } else {
            alert(data.message);
        }
    });
}

// ---------------- SIGNUP ----------------
function signup() {
    console.log("Signup button clicked!");
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (!username || !password || !confirm) {
        alert("Please fill all fields");
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match");
        return;
    }

    fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alert("Account created successfully!");
            localStorage.setItem("username", username);
            window.location.href = "dashboard.html";
        } else {
            alert(data.message);
        }
    });
}

// ---------------- SUBMIT THOUGHT ----------------
function submitThought() {
    const message = document.getElementById('thought').value;
    const username = localStorage.getItem("username");

    if (!username) {
        alert("You must be logged in to submit thoughts!");
        window.location.href = "index.html";
        return;
    }

    if (!message) {
        alert("Please write something before submitting");
        return;
    }

    fetch(`${API_URL}/submit`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, message })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alert("Thought submitted!");
            document.getElementById('thought').value = "";
        }
    });
}

// ---------------- HOME ----------------
function goHome() {
    window.location.href = "index.html";
}

// ---------------- LOGOUT ----------------
function logout() {
    localStorage.removeItem("username"); // clear login session
    alert("Logged out successfully!");
    window.location.href = "index.html";
}

// ---------------- DASHBOARD PAGE SETUP ----------------
document.addEventListener("DOMContentLoaded", function () {
    // Attach Home & Logout buttons (if present on the page)
    const homeBtn = document.getElementById("homeBtn");
    if (homeBtn) homeBtn.addEventListener("click", goHome);

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", logout);

    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) submitBtn.addEventListener("click", submitThought);

    const createBtn = document.getElementById("createBtn");
    if (createBtn) createBtn.addEventListener("click", signup);

    // Check if user is logged in before accessing dashboard
    const username = localStorage.getItem("username");
    if (window.location.href.includes("dashboard.html") && !username) {
        alert("You must login first!");
        window.location.href = "index.html";
    }
});
