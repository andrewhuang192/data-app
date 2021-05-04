var io = require('socket.io')();
console.log('working')

io.on('connection', function (socket) {
  console.log('Connected to socket.io')
    socket.on('add-message', function (data) {
      io.emit('add-message', data);
    });

});

module.exports = io;
