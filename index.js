const express = require('express');
const path = require('path');
require('dotenv').config();

//DB config
require('./database/config').dbConnection();

// App de Express
const app = express();

//Lectura y parseo del body
app.use(express.json());

// Node Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');

// Path público
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

//Routas
app.use('/api/login', require('./routes/auth'));

app.use('/api/users', require('./routes/users'));

server.listen(process.env.PORT, '0.0.0.0', (err) => {
  if (err) throw new Error(err);

  console.log('Servidor corriendo en puerto', process.env.PORT);
});
