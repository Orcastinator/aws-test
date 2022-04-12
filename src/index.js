
const express = require('express');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');

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
// CONSTANTES
const W = 1500;
const H = 700;
const P = 50;
const ROWS = H/P;
const COLS = W/P;

// VARIABLES GLOBALES
var arrTo = new Array();
var to;
var fruits = 0;

// CLASES
class Ground{
    constructor(x, y, state, id){
        this.size = P;
        this.x = x;
        this.y = y;
        this.id = id;
        this.state = state;
        this.buildable = true;
    }
}

// ARRAY DINÁMICO
var arrBlocks = [];
var cont = 1;
for (i=0;i<COLS;i++){
    for(j=0;j<ROWS;j++){
            arrBlocks.push(new Ground(i*P, j*P, 'ground', cont++));
        
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