const express = require('express');
const cors = require('cors');
const mongoDB = require('../backend/db'); 
const CreateUser = require('../backend/Routes/CreateUser');
const DisplayData = require('./Routes/DisplayData');
const OrderData = require('./Routes/OrderData');

const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const startServer = async () => {
  await mongoDB(); 

  app.use('/api', CreateUser);

  app.use('/api', DisplayData);

  app.use('/api', OrderData);

  app.get('/', (req, res) => {
    res.send("Hello World");
    
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startServer();
