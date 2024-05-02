const express = require('express');
const cors =require('cors');

const userRoutes = require('./routes/userRoutes.js')


const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());


app.use('/users', userRoutes)

require('./connection.js')

app.listen(PORT, () => console.log(`server running on port ${PORT}`))