const db = require('../config/db');


const Order = {
    create: async (orderData) => {
        const [result] = await db.query(
            'INSERT INTO orders (user_id, product, quantity, name, email, phone, message) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                orderData.user_id,
                orderData.product,
                orderData.quantity,
                orderData.name,
                orderData.email,
                orderData.phone,
                orderData.message,
            ]
        );
        return result;
    },
};


module.exports = Order;

