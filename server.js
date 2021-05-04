const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
// Always require and configure near the top
require('dotenv').config();

// connect to the database
require('./config/database');

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));

// Middleware to verify token and assign user object of payload to req.user.
// Be sure to mount before routes
app.use(require('./config/checkToken'));

//api routes will go here
// app.use('/api/users', require('./routes/api/users'))
const ensureLoggedIn = require('./config/ensureLoggedIn');
app.use('/api/users', require('./routes/api/users'))
app.use('/api/messages', ensureLoggedIn, require('./routes/api/messages'))


// The following "catch all" route (note the *) is necessary
app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Configure to use port 3001 instead of 3000 during development to avoid collision with React's dev server
const port = process.env.PORT || 3001;
app.listen(port, function () {
	console.log(`Express app running on port ${port}`);
});

// setup the port our backend app will run on
const PORT = 3030;
const NEW_MESSAGE_EVENT = "new-message-event";

// const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
  cors: true,
  origins:["localhost:3000"]
});

app.use(cors());

// Hardcoding a room name here. This is to indicate that you can do more by creating multiple rooms as needed.
const room = "general"


io.on("connection", (socket) => {
	console.log('connected to socket.io')
	
	socket.join(room);

  socket.on(NEW_MESSAGE_EVENT, (data) => {
    io.in(room).emit(NEW_MESSAGE_EVENT, data);
  });

  socket.on("disconnect", () => {
    socket.leave(room);
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
