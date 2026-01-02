


document.addEventListener("DOMContentLoaded", ()=> {

  const sr = ScrollReveal({  // Fixed "ScrollRevel" typo
      distance: '60px',
      duration: 2500,
      delay: 400,
      reset: true
  });

  sr.reveal('.text', { delay: 200, origin: 'top' });
  sr.reveal('.form-container form', { delay: 800, origin: 'left' });
  sr.reveal('.heading', { delay: 800, origin: 'top' });
  sr.reveal('.service-container .box', { delay: 600, origin: 'top' });
  sr.reveal('.products-container .box', { delay: 600, origin: 'top' });
  sr.reveal('.about-container .about-text', { delay: 800, origin: 'top' });
  sr.reveal('.reviews-container', { delay: 800, origin: 'top' });
  sr.reveal('.newsletter .box', { delay: 400, origin: 'bottom'});
});

let token = null;


document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  try {
  const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, name }),
  });
  if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  alert(data.message);
  if (response.ok) {
  authForm.style.display = 'block';
  registerForm.style.display = 'none';
  orderForm.style.display = 'none';
  }
  } catch (error) {
  console.error('Error during signup:', error);
  alert(`An error occurred during signup: ${error.message}`);
  }
 });

 document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
  const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  if (data.token) {
  token = data.token;
  showSection(dashboard);
  fetchOrders();
  updateNavbar();
  } else {
  alert(data.message);
  }
  } catch (error) {
  console.error('Error during login:', error);
  alert(`An error occurred during login: ${error.message}`);
  }
 });
 
 document.getElementById('logout').addEventListener('click', () => {
  token = null;
  showSection(homeSection);
  authForm.style.display = 'block';
  registerForm.style.display = 'none';
  orderForm.style.display = 'none';
  updateNavbar();
 });

 // Define a function to get the user’s order history (like checking their purchase receipts)
async function fetchOrders() {
  // Start a safe block to catch any problems while fetching orders
  try {
    // Ask the backend for the user’s orders, showing the token to prove they’re a member
    const response = await fetch('http://localhost:5000/api/order/my-orders', {
      // Send the token in the request header (like showing a membership card)
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    // Check if the backend says the token is invalid or expired (status 401 or 403)
    if (response.status === 401 || response.status === 403) {
      // Show a message telling the user their session is over
      alert('Session expired. Please log in again.');
      // Clear the token (throw away the membership card)
      token = null;
      // Show the main page (like going back to the shop’s entrance)
      showSection(homeSection);
      // Show the login form so they can sign in again
      authForm.style.display = 'block';
      // Hide the sign-up form (not needed now)
      registerForm.style.display = 'none';
      // Hide the order form (not needed now)
      orderForm.style.display = 'none';
      // Update the navigation bar to show sign-up/sign-in links
      updateNavbar();
      // Stop the function since they need to log in again
      return;
    }
    // Check if the backend says something else went wrong
    if (!response.ok) {
      // Create an error message with the status code
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Get the list of orders from the backend
    const orders = await response.json();
    // Find the area on the dashboard where orders will be shown
    const ordersDiv = document.getElementById('user-orders');
    // Check if there are no orders or the list is empty
    if (!orders || orders.length === 0) {
      // Show a message saying no orders were found
      ordersDiv.innerHTML = '<p>No orders found.</p>';
    } else {
      // Create a heading and list of orders to display
      ordersDiv.innerHTML = '<h3>Your Orders</h3>' + orders.map(order => `
        // Create a box for each order with its details
        <div>
          // Show the product name (like “Textile”)
          <p><strong>Product:</strong> ${order.product}</p>
          // Show how many items were ordered
          <p><strong>Quantity:</strong> ${order.quantity}</p>
          // Show the order date in a nice format
          <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
        </div>
      // Add a line between each order for clarity
      `).join('<hr>');
    }
  // If something goes wrong (like a network issue), handle the error
  } catch (error) {
    // Log the error for developers to debug
    console.error('Error fetching orders:', error);
    // Show an error message in the orders area
    document.getElementById('user-orders').innerHTML = `<p>Error loading orders: ${error.message}</p>`;
  }
}

// Listen for when someone submits the order form (like placing a new order for a handicraft)
// document.getElementById('place-order-form').addEventListener('submit', async (e) => {
//   // Stop the form from sending data the usual way (we handle it ourselves)
//   e.preventDefault();
//   // Collect all the form data (like product, quantity, name, etc.)
//   const formData = new FormData(e.target);
//   // Turn the form data into a simple object we can send
//   const orderData = Object.fromEntries(formData);

//   // Start a safe block to catch any problems while placing the order
//   try {
//     // Send the order details to the backend, including the token to prove they’re a member
//     const response = await fetch('http://localhost:5000/api/order/place-order', {
//       // Use POST to send new data (like submitting an order)
//       method: 'POST',
//       // Set headers to tell the backend we’re sending JSON and include the token
//       headers: {
//         // Tell the backend the data is in JSON format
//         'Content-Type': 'application/json',
//         // Show the token to prove the user is logged in
//         'Authorization': `Bearer ${token}`,
//       },
//       // Turn the order details into a JSON string to send
//       body: JSON.stringify(orderData),
//     });
//     // Check if the backend says something went wrong
//     if (!response.ok) {
//       // Create an error message with the status code
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     // Get the backend’s response (like a message saying “Order placed!”)
//     const data = await response.json();
//     // Show the user the message from the backend
//     alert(data.message);
//     // If the order was successful, update the UI
//     if (response.ok) {
//       // Show the dashboard to refresh the order list
//       showSection(dashboard);
//       // Get the updated order history to show the new order
//       fetchOrders();
//     }
//   // If something goes wrong (like a network issue), handle the error
//   } catch (error) {
//     // Log the error for developers to debug
//     console.error('Error during order placement:', error);
//     // Show the user a message saying the order failed
//     alert(`An error occurred during order placement: ${error.message}`);
//   }
// });
 
// Define a function to update the navigation bar based on whether the user is logged in
// function updateNavbar() {
//   // Get the “Sign Up” link from the navigation bar
//   const signUpLink = document.getElementById('sign-up-link');
//   // Get the “Sign In” link from the navigation bar
//   const signInLink = document.getElementById('sign-in-link');
//   // Check if the user has a token (membership card)
//   if (token) {
//     // If they’re logged in, hide the “Sign Up” link (they don’t need it)
//     signUpLink.style.display = 'none';
//     // Hide the “Sign In” link (they’re already signed in)
//     signInLink.style.display = 'none';
//   } else {
//     // If they’re not logged in, show the “Sign Up” link to invite them to join
//     signUpLink.style.display = 'inline';
//     // Show the “Sign In” link to let them log in
//     signInLink.style.display = 'inline';
//   }
// }

// Wait for the website to fully load before setting up the shop
document.addEventListener('DOMContentLoaded', () => {
  // Get the login form so we can control it later
  const authForm = document.getElementById('auth-form');
  // Get the sign-up form so we can control it later
  const registerForm = document.getElementById('register-form');
  // Get the order form so we can control it later
  const orderForm = document.getElementById('order-form');
  // Get the dashboard (VIP area) so we can show or hide it
  const dashboard = document.getElementById('dashboard');
  // Get the main page (home section) so we can show or hide it
  const homeSection = document.getElementById('Home');

  // Define a function to switch between the main page and dashboard
  function showSection(section) {
    // Show the main page (home section) if it’s selected, otherwise hide it
    homeSection.style.display = section === homeSection ? 'grid' : 'none';
    // Show the dashboard if it’s selected, otherwise hide it
    dashboard.style.display = section === dashboard ? 'block' : 'none';
  }

  // Update the navigation bar to set the initial state (show sign-up/sign-in links if not logged in)
  // updateNavbar();

  // Listen for when someone clicks the “Sign Up” link to show the sign-up form
  const reg =  document.getElementById('show-register');
  console.log('reg', reg);
  
  reg.addEventListener('click', (e) => {
    // Stop the link from acting like a normal link (we handle it ourselves)
    e.preventDefault();
    // Hide the login form
    authForm.style.display = 'none';
    // Show the sign-up form
    registerForm.style.display = 'block';
    // Hide the order form (not needed now)
    orderForm.style.display = 'none';
  });

  // Listen for when someone clicks the “Sign In” link to show the login form
  document.getElementById('show-login').addEventListener('click', (e) => {
    // Stop the link from acting like a normal link (we handle it ourselves)
    e.preventDefault();
    // Show the login form
    authForm.style.display = 'block';
    // Hide the sign-up form
    registerForm.style.display = 'none';
    // Hide the order form (not needed now)
    orderForm.style.display = 'none';
  });

  // Listen for when someone clicks the “Place New Order” button in the dashboard
  document.getElementById('place-new-order').addEventListener('click', () => {
    // Show the main page (home section)
    showSection(homeSection);
    // Hide the login form
    authForm.style.display = 'none';
    // Hide the sign-up form
    registerForm.style.display = 'none';
    // Show the order form so they can place a new order
    orderForm.style.display = 'block';
  });
});

