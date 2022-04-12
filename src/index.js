
const express = require('express');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');

// EXPRESS
const app = express();

// SETTINGS
app.set('PORT', 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ROUTES
app.use(require('./routes/'));

// STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// START SERVER
const server = app.listen(app.get('PORT'), () => {
    console.log("Server on "+app.get('PORT'));
});

// WEB SOCKETS 
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('New user');

    socket.on('001', (data) => {
        console.log(data);
    });
});


