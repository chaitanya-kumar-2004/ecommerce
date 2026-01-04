/********************************
 * GLOBAL VARIABLES
 ********************************/
let authForm, registerForm, orderForm, dashboard, homeSection;
let token = null;

/********************************
 * SECTION SWITCHER
 ********************************/
function showSection(section) {
  // Hide both Home and Dashboard first
  homeSection.style.display = "none";
  dashboard.style.display = "none";

  // Then show the desired section
  if (section === homeSection) {
    homeSection.style.display = "grid";
  } else if (section === dashboard) {
    dashboard.style.display = "block";
  }
}

/********************************
 * NAVBAR UPDATE (NOW CONTROLS HEADER LOGOUT BUTTON)
 ********************************/
function updateNavbar() {
  const signUp = document.querySelector(".sign-up");
  const signIn = document.querySelector(".sign-in");
  // Target the #logout element, now an <a> tag in the header
  const logoutBtn = document.getElementById("logout"); 

  if (!signUp || !signIn || !logoutBtn) return;

  if (token) {
    // Hide SignUp/SignIn and show Logout when user is logged in
    signUp.style.display = "none";
    signIn.style.display = "none";
    // Display the logout button in the header
    logoutBtn.style.display = "inline-block"; 
  } else {
    // Show SignUp/SignIn and hide Logout when user is logged out
    signUp.style.display = "inline-block";
    signIn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
}

/********************************
 * DOM READY (ENTRY POINT)
 ********************************/
document.addEventListener("DOMContentLoaded", () => {
  /* ===== DOM ELEMENTS ===== */
  authForm = document.getElementById("auth-form");
  registerForm = document.getElementById("register-form");
  orderForm = document.getElementById("order-form");
  dashboard = document.getElementById("dashboard");
  homeSection = document.getElementById("Home");

  /* ===== MOBILE HEADER DROPDOWN ===== */
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.querySelector(".navbar");
  const headerBtn = document.querySelector(".header-btn");

  if (menuToggle && navbar && headerBtn) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("active");
      headerBtn.classList.toggle("active");
    });
  }

  document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
      if (navbar) navbar.classList.remove("active");
      if (headerBtn) headerBtn.classList.remove("active");
    });
  });

  /* ==================================== */
  /* ===== FORM SWITCHING LOGIC (HOME) ===== */
  /* ==================================== */

  // Switch from Sign In to Sign Up
  const showRegisterLink = document.getElementById("show-register");
  if (showRegisterLink) {
    showRegisterLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (authForm) authForm.style.display = "none";
      if (registerForm) registerForm.style.display = "block";
    });
  }

  // Switch from Sign Up to Sign In
  const showLoginLink = document.getElementById("show-login");
  if (showLoginLink) {
    showLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (authForm) authForm.style.display = "block";
      if (registerForm) registerForm.style.display = "none";
    });
  }
  
  /* ===== PLACE NEW ORDER BUTTON LOGIC (DASHBOARD) ===== */
  const placeNewOrderBtn = document.getElementById("place-new-order");
  if (placeNewOrderBtn) {
    placeNewOrderBtn.addEventListener("click", () => {
      // Show Home section
      showSection(homeSection);
      
      // Show the order form and hide auth forms on the home screen
      if (authForm) authForm.style.display = "none";
      if (registerForm) registerForm.style.display = "none";
      if (orderForm) orderForm.style.display = "block";
    });
  }

  /* ===== SCROLL REVEAL ===== */
  if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
      distance: "60px",
      duration: 2500,
      delay: 400,
      reset: true
    });

    sr.reveal(".text", { origin: "top", delay: 200 });
    sr.reveal(".form-container form", { origin: "left", delay: 800 });
    sr.reveal(".heading", { origin: "top", delay: 800 });
    sr.reveal(".service-container .box", { origin: "top", delay: 600 });
    sr.reveal(".products-container .box", { origin: "top", delay: 600 });
    sr.reveal(".about-container .about-text", { origin: "top", delay: 800 });
    sr.reveal(".reviews-container", { origin: "top", delay: 800 });
    sr.reveal(".newsletter .box", { origin: "bottom", delay: 400 });
  }

  updateNavbar();
});

/********************************
 * SIGNUP
 ********************************/
document.getElementById("signup-form")?.addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      // On successful registration, switch back to the login form
      if (authForm) authForm.style.display = "block";
      if (registerForm) registerForm.style.display = "none";
      // Clear form fields
      document.getElementById("signup-form").reset();
    }
  } catch (err) {
    console.error(err);
    alert("Signup failed");
  }
});

/********************************
 * LOGIN
 ********************************/
document.getElementById("login-form")?.addEventListener("submit", async e => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      token = data.token;
      
      // 1. Hide the authentication forms
      if (authForm) authForm.style.display = "none";
      if (registerForm) registerForm.style.display = "none";
      
      // 2. Display the main dashboard section
      showSection(dashboard); 

      // 3. Ensure the order form (part of Home section) is hidden
      if (orderForm) orderForm.style.display = "none";
      
      // Clear login fields
      document.getElementById("login-form").reset();

      fetchOrders(); 
      updateNavbar(); // Update to show Logout in header
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
});

/********************************
 * LOGOUT
 ********************************/
document.getElementById("logout")?.addEventListener("click", (e) => {
  e.preventDefault();
  token = null;
  
  // Show the home section
  showSection(homeSection);
  
  // Reset visibility to the default state (showing authForm)
  if (authForm) authForm.style.display = "block";
  if (registerForm) registerForm.style.display = "none";
  if (orderForm) orderForm.style.display = "none"; 

  // Clear orders display
  const ordersDiv = document.getElementById("user-orders");
  if (ordersDiv) ordersDiv.innerHTML = "";
  
  updateNavbar(); // Update to hide Logout and show SignIn/SignUp
});

/********************************
 * FETCH ORDERS
 ********************************/
async function fetchOrders() {
  const ordersDiv = document.getElementById("user-orders");
  if (!ordersDiv) return;

  ordersDiv.innerHTML = "<p>Loading your orders.....</p>"; 

  try {
    const res = await fetch("http://localhost:5000/api/order/my-orders", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 401 || res.status === 403) {
      alert("Session expired. Please login again.");
      token = null;
      showSection(homeSection);
      if (authForm) authForm.style.display = "block";
      updateNavbar();
      return;
    }

    const orders = await res.json();

    if (!orders || orders.length === 0) {
      ordersDiv.innerHTML = "<p>No orders found.</p>";
      return;
    }

    ordersDiv.innerHTML =
      "<h3>Your Orders</h3>" +
      orders
        .map(
          order => `
          <div class="order-item" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
            <p><strong>Product:</strong> ${order.product}</p>
            <p><strong>Quantity:</strong> ${order.quantity}</p>
            <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
          </div>
        `
        )
        .join("");
  } catch (err) {
    console.error(err);
    ordersDiv.innerHTML = "<p>Error loading orders</p>";
  }
}

/********************************
 * PLACE ORDER
 ********************************/
document.getElementById("place-order-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!token) {
    alert("Please login to place an order");
    return;
  }

  const form = e.target;

  const orderData = {
    product: form.product.value,
    quantity: form.quantity.value,
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    message: form.message.value
  };

  try {
    const res = await fetch("http://localhost:5000/api/order/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(`Order failed: ${data.message || 'Server error'}`);
      return;
    }

    alert(data.message);

    form.reset();
    
    // After placing a new order, switch back to the Dashboard to show the new order
    showSection(dashboard);
    fetchOrders(); 

  } catch (err) {
    console.error("Order error:", err);
    alert("Failed to communicate with the order service.");
  }
});