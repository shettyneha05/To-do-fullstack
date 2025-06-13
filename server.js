const express = require('express'); //framework
const cors = require('cors');//allows requests acoross different ports
require('./db');//accessing db file
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

app.use(express.static('public'));

app.listen(process.env.PORT, () =>{
  console.log(`Server running on port ${process.env.PORT}`)
});