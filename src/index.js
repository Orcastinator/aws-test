
const express = require('express');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');
const header = require('./header');

// EXPRESS
const app = express();

// SETTINGS
app.set('PORT', process.env.PORT || 3000);
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

// FUNCIONALIDAD SERVIDOR
// VARIABLES GLOBALES
var arrTo = new Array();
var to;
var fruits = 0;

// ARRAY DINÁMICO
let i, j;
var arrBlocks = [];
var cont = 1;
let ROWS = header.GLOBAL.H/header.GLOBAL.P;
let COLS = header.GLOBAL.W/header.GLOBAL.P;
for (i=0;i<COLS;i++){
    for(j=0;j<ROWS;j++){
            arrBlocks.push(new header.Ground(i*header.GLOBAL.P, j*header.GLOBAL.P, 'ground', cont++));
        
    }
}

function clickBlock(b){
    for (i=0;i<arrBlocks.length;i++){
        if (arrBlocks[i].x === b.x && arrBlocks[i].y === b.y){
            switch (arrBlocks[i].state){
                case "ground":
                    arrBlocks[i].state = "plowed";
                    arrBlocks[i].buildable = false;
                    io.sockets.emit('updateScreen', arrBlocks);
                    to = setTimeout(toGround, 3000, arrBlocks[i]);
                    arrTo[arrBlocks[i].id] = to;
                break;
                case "plowed":
                    arrBlocks[i].state = "seeded";
                    io.sockets.emit('updateScreen', arrBlocks);
                    clearTimeout(arrTo[arrBlocks[i].id]);
                    to = setTimeout(toGrowed, 5000, arrBlocks[i]);
                    arrTo[arrBlocks[i].id] = to;
                break;
                case "growed":
                    arrBlocks[i].state = "plowed";
                    io.sockets.emit('updateScreen', arrBlocks);
                    clearTimeout(arrTo[arrBlocks[i].id]);
                    fruits++;
                    arrBlocks[i].buildable = false;
                    to = setTimeout(toGround, 3000, arrBlocks[i]);
                    arrTo[arrBlocks[i].id] = to;
                break;
                case "dead":
                    arrBlocks[i].state = "ground";
                    io.sockets.emit('updateScreen', arrBlocks);
                    clearTimeout(arrTo[arrBlocks[i].id]);
                break;
                default:
            }  
        }
    }

}

// FUNCIONES TIMEOUTS
function toGround(b){
    b.state = "ground";
    io.sockets.emit('updateScreen', arrBlocks);
}
function toGrowed(b){
    b.state = "growed";
    io.sockets.emit('updateScreen', arrBlocks);
    to = setTimeout(toDead, 7000, b);
    arrTo[b.id] = to;
}
function toDead(b){
    b.state = "dead";
    io.sockets.emit('updateScreen', arrBlocks);
}

// WEB SOCKETS 
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('New user -> '+socket.id);
    io.to(socket.id).emit('drawInit', arrBlocks);

    socket.on('clickBlock', (data) => {
        clickBlock(data);
        io.sockets.emit("updateScreen", arrBlocks);
    });
});