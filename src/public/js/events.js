// CONSTANTES
const W = 1500;
const H = 700;
const P = 50;
const ROWS = H/P;
const COLS = W/P;

// DOM
var contenido = document.querySelector(".contenido");

// EVENT LISTENERS
contenido.addEventListener('click', clickBlock);

function clickBlock(e){
    let x = Math.trunc(((e.pageX/P)*P) - (($(".contenido").offset().left/P)*P)); 
    let y = Math.trunc(((e.pageY/P)*P) - (($(".contenido").offset().top/P)*P));
    let relX = Math.trunc(x/P) * P;
    let relY = Math.trunc(y/P) * P; 

    let obj = {
        x: relX,
        y: relY
    };
    socket.emit("clickBlock", obj);
}

// SOCKETS

socket.on('drawInit', (data) => {
    drawInit(data);
});

socket.on('updateScreen', (data) => {
    updateScreen(data);
});

// FUNCIONES CLIENTE
function drawInit (arr){
    for (i=0;i<arr.length;i++){
        var aux = document.createElement('div');
        if (arr[i].state == 'ground'){
            console.log(arr[i].state);
            aux.classList.add(arr[i].state);
        }
        else {
            console.log(arr[i].state);
            aux.classList.add('ground');
            aux.classList.add(arr[i].state);
        }
        aux.style.left = arr[i].x + 'px';
        aux.style.top = arr[i].y + 'px';
        contenido.appendChild(aux);
    }
}

function updateScreen(arr) {
    let arrAux = Array.from(document.querySelectorAll('.ground'));
    console.log(arrAux.length);
    for (i=0;i<arr.length;i++){
        let n = arrAux[i].className.lastIndexOf(" ");
        let aux = arrAux[i].className.slice(n+1, arrAux[i].className.length); // Toma la última clase que es la que define el estado real del block

        if (arr[i].state != aux){
            if (arr[i].state == 'ground'){ // Si el terreno ha cambiado a ground, simplemente se elimina la clase específica
                arrAux[i].classList.remove(aux);
            }
            else if (aux == 'ground'){ // Si el elemento pasa de ground a algo específico, simplemente se añade la nueva clase
                arrAux[i].classList.add(arr[i].state);
            }
            else { // Si el elemento ya tenía una clase específica, se sustituye por la actual
                arrAux[i].classList.replace(aux, arr[i].state);
            }
        }
    }
}

function printFruits(f){
    let h = document.getElementById('aux');
    h.style.paddingLeft = "40px";
    h.innerHTML = "<h2> Fruits obtained -> "+f+"</h2>";
}