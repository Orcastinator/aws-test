const express = require('express');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');
const header = require('./header');
const mysql = require('mysql2');
require('dotenv').config();

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

// BBDD
const poolDB = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_BBDD,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// FUNCIONALIDAD SERVIDOR
// VARIABLES GLOBALES
var arrTo = new Array();
var to;
var fruits = 0;

function clickBlock(b, arr){
    for (i=0;i<arr.length;i++){
        if (arr[i].block_pos_x === b.x && arr[i].block_pos_y === b.y){
            switch (arr[i].block_state){
                case "ground":
                    arr[i].block_state = "plowed";
                    to = setTimeout(toGround, 3000, i, arr);
                    arrTo[arr[i].block_id] = to;
                break;
                case "plowed":
                    arr[i].block_state = "seeded";
                    clearTimeout(arrTo[arr[i].block_id]);
                    to = setTimeout(toGrowed, 5000, i, arr);
                    arrTo[arr[i].block_id] = to;
                break;
                case "growed":
                    arr[i].block_state = "plowed";
                    clearTimeout(arrTo[arr[i].block_id]);
                    fruits++;
                    to = setTimeout(toGround, 3000, i, arr);
                    arrTo[arr[i].block_id] = to;
                break;
                case "dead":
                    arr[i].block_state = "ground";
                    clearTimeout(arrTo[arr[i].block_id]);
                break;
                default:
            }  
            poolDB.execute("UPDATE block SET block_state='"+arr[i].block_state+"' WHERE block_id = "+arr[i].block_id+"");
            let obj = {a: arr, o: i};
            io.sockets.emit('updateBlock', obj);
        }
    }
}

// FUNCIONES TIMEOUTS
function toGround(i, arr){
    arr[i].block_state = "ground";
    poolDB.execute("UPDATE block SET block_state='"+arr[i].block_state+"' WHERE block_id = "+arr[i].block_id+"");
    let obj = {a: arr, o: i};
    io.sockets.emit('updateBlock', obj);
}
function toGrowed(i, arr){
    arr[i].block_state = "growed";
    poolDB.execute("UPDATE block SET block_state='"+arr[i].block_state+"' WHERE block_id = "+arr[i].block_id+"");
    let obj = {a: arr, o: i};
    io.sockets.emit('updateBlock', obj);
    to = setTimeout(toDead, 7000, i, arr);
    arrTo[arr[i].block_id] = to;
}
function toDead(i, arr){
    arr[i].block_state = "dead";
    poolDB.execute("UPDATE block SET block_state='"+arr[i].block_state+"' WHERE block_id = "+arr[i].block_id+"");
    let obj = {a: arr, o: i};
    io.sockets.emit('updateBlock', obj);
}

// WEB SOCKETS 
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('New user -> '+socket.id);
    poolDB.execute("SELECT * FROM block", (err, arr) => {
        io.to(socket.id).emit('drawInit', arr)
    ;});

    socket.on('clickBlock', (obj) => {
        poolDB.execute("SELECT * FROM block", (err, arr) => {
            clickBlock(obj, arr);
        ;});
    });
});