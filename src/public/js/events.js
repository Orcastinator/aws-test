// CONSTANTES
const W = 1500;
const H = 700;
const P = 50;
const ROWS = H/P;
const COLS = W/P;

// VARIABLES GENERALES
var contenido = document.querySelector(".contenido");

// CLASES
class FetchClick{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.code = 'clickBlock';
    }
}

// EVENT LISTENERS
contenido.addEventListener('click', clickBlock);

function clickBlock(e){
    socket.emit("001", 'La puta que te parió');
    let x = Math.trunc(((e.pageX/P)*P) - (($(".contenido").offset().left/P)*P)); 
    let y = Math.trunc(((e.pageY/P)*P) - (($(".contenido").offset().top/P)*P));
    let relX = Math.trunc(x/P) * P;
    let relY = Math.trunc(y/P) * P; 

    let obj = new FetchClick(relX, relY);
    let objJson = JSON.stringify(obj);
    
    fetch('http://192.168.100.239:3000/clickBlock', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: objJson
    }, ).then(x => x.json()).then(y => respuesta(y));
    
}

function respuesta(y){
    console.log(y);
}