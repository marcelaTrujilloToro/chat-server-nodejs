const { checkJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { userConnected, userDisconnected } = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', (client) => {
  console.log('Cliente conectado');

  const [valid, uid] = checkJWT(client.handshake.headers['x-token']);

  //verificar autenticacion
  if (!valid) {
    return client.disconnect();
  }

  //Cliente autenticado
  userConnected(uid);

  client.on('disconnect', () => {
    userDisconnected(uid);
    console.log('Cliente desconectado');
  });

  //   client.on('mensaje', (payload) => {
  //     console.log('Mensaje', payload);

  //     io.emit('mensaje', { admin: 'Nuevo mensaje' });
  //   });
});
