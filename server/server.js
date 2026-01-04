require('dotenv').config();

const cors=require("cors")
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const express = require('express');

const app = express();

app.use(cors())

app.use(express.json());


app.use("/api/auth",authRoutes)
app.use("/api/order", orderRoutes);
app.get('/test', (req, res) => res.send('Hello World'));


app.post('/api/test' , (req,res)=>{
   console.log(req.body);

   res.json({message: 'Data received', data: req.body});
});

const db = require('./config/db');
app.get('/users', async (req, res) => {
   const [rows] = await db.query('SELECT * FROM users');
   res.json(rows);
});



app.listen(5000, () => console.log('Server running on port 5000'));

