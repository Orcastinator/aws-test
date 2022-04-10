const datos = require('../public/js/fx');
const express = require('express');
const router = express.Router();

// CONSTANTES
const W = 1500;
const H = 700;
const P = 50;
const ROWS = H/P;
const COLS = W/P;

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

// VARIABLES GLOBALES
var arrTo = new Array();
var to;
var fruits = 0;

router.get('/', (req, res) => {
    res.render('index.html');
});

router.post('/clickBlock', (req, res) => {
    clickBlock(req.body);
    res.send(JSON.stringify({prop: 'ok', id: req.body.id}));
});

router.get('/drawScreen', (req, res) => {
    res.send(JSON.stringify(arrBlocks));
});

router.get('/fruits', (req, res) => {
    res.send(JSON.stringify(fruits));
});

module.exports = router;

// FUNCIONES SERVIDOR
function clickBlock(b){
    for (i=0;i<arrBlocks.length;i++){
        if (arrBlocks[i].x === b.x && arrBlocks[i].y === b.y){
            switch (arrBlocks[i].state){
                case "ground":
                    arrBlocks[i].state = "plowed";
                    arrBlocks[i].buildable = false;
                    to = setTimeout(toGround, 3000, arrBlocks[i]);
                    arrTo[arrBlocks[i].id] = to;
                break;
                case "plowed":
                    arrBlocks[i].state = "seeded";
                    clearTimeout(arrTo[arrBlocks[i].id]);
                    to = setTimeout(toGrowed, 5000, arrBlocks[i]);
                    arrTo[arrBlocks[i].id] = to;
                break;
                case "growed":
                    arrBlocks[i].state = "plowed";
                    clearTimeout(arrTo[arrBlocks[i].id]);
                    fruits++;
                    arrBlocks[i].buildable = false;
                    to = setTimeout(toGround, 3000, arrBlocks[i]);
                    arrTo[arrBlocks[i].id] = to;
                break;
                case "dead":
                    clearTimeout(arrTo[arrBlocks[i].id]);
                    arrBlocks[i].state = "ground";
                break;
                default:
            }
            
        }
    }
}

// FUNCIONES TIMEOUTS
function toGround(b){
    b.state = "ground";
}
function toGrowed(b){
    b.state = "growed";
    to = setTimeout(toDead, 7000, b);
    arrTo[b.id] = to;
}
function toDead(b){
    b.state = "dead";
}
