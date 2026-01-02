// Import Express framework for building the server
const express = require('express');
 
// Create an Express Router instance for modular routing
const router = express.Router();
 
// Import jsonwebtoken for JWT verification
const jwt = require('jsonwebtoken');
 
// Import Order model for database operations
const Order = require('../models/order');
 
// Import database connection (e.g., MySQL)
const db = require('../config/db');
 
// Middleware to authenticate requests using JWT
const authenticateToken = (req, res, next) => {
	// Extract token from Authorization header (Bearer <token>)
	const token = req.headers['authorization']?.split(' ')[1];
 
	// Return 401 if no token is provided
	if (!token) {
    	return res.status(401).json({ message: 'Access denied' });
	}
 
	// Verify token using JWT_SECRET
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    	// Return 403 if token is invalid
    	if (err) {
            return res.status(403).json({ message: 'Invalid token' });
    	}
 
    	// Attach decoded user data (e.g., id) to req.user
    	req.user = user;
 
    	// Proceed to the next middleware/route handler
    	next();
	});
};
 
// Route to place a new order (POST /place-order)
router.post('/place-order', authenticateToken, async (req, res) => {
	try {
    	// Create order data object from req.user and req.body
    	const orderData = {
            user_id: req.user.id, // From authenticated user
            product: req.body.product,
            quantity: req.body.quantity,
        	name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message,
    	};
 
    	// Log order data for debugging
        console.log('Saving order:', orderData);
 
    	// Save order to database using Order model
    	await Order.create(orderData);
 
    	// Return 201 for successful order creation
        res.status(201).json({ message: 'Order placed successfully' });
	} catch (error) {
    	// Log error and return 500 for server errors
        console.error('Error during order placement:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
	}
});
 
// Route to fetch authenticated user's orders (GET /my-orders)
router.get('/my-orders', authenticateToken, async (req, res) => {
	try {
 	   // Query database for orders belonging to the authenticated user
    	const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ?', [req.user.id]);
 
    	// Return orders as JSON
        res.json(orders);
	} catch (error) {
    	// Log error and return 500 for server errors
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
	}
});
 
// Export the router to be used in the main application
module.exports = router;

