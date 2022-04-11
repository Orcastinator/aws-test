
// FUNCIONES

// >> Dibuja el terreno por primera vez recibiendo el array por fetch.
// >> Crea un interval que llama periódicamente a drawScreen para refrescar la pantalla del usuario
function createDrawInterval(){
    fetch('http://192.168.100.239:3000/drawScreen').then(x => x.json()).then(r => drawInit(r));
    setInterval(drawScreen, 60);
}

// Recibe un array con los rectángulos y su información para pintar en la pantalla
function drawScreen(){
    fetch('http://192.168.100.239:3000/drawScreen').then(x => x.json()).then(arr => askDrawScreen(arr));
    fetch('http://192.168.100.239:3000/fruits').then(x => x.json()).then(f => printFruits(f));
}

function drawInit (arr){
    var contenido = document.querySelector(".contenido");
    for (i=0;i<arr.length;i++){
        var aux = document.createElement('div');
        aux.classList.add("ground");
        aux.style.left = arr[i].x + 'px';
        aux.style.top = arr[i].y + 'px';
        contenido.appendChild(aux);
    }
}

function askDrawScreen(arr) {
    let arrAux = Array.from(document.querySelectorAll('.ground'));
    for (i=0;i<arr.length;i++){
        let n = arrAux[i].className.lastIndexOf(" ");
        let aux = arrAux[i].className.slice(n+1, arrAux[i].className.length); // Toma la última clase que es la que define el estado real del block

        if (arr[i].state != aux){
            if (arr[i].state == 'ground'){ // Si el terreno ha cambiado a ground, simplemente se elimina la clase específica
                arrAux[i].classList.remove(aux);
                console.log("Terreno pasa a ground.");
            }
            else if (aux == 'ground'){ // Si el elemento pasa de ground a algo específico, simplemente se añade la nueva clase
                arrAux[i].classList.add(arr[i].state);
                console.log("Terreno pasa de ground a ", arr[i].state);
            }
            else { // Si el elemento ya tenía una clase específica, se sustituye por la actual
                arrAux[i].classList.replace(aux, arr[i].state);
                console.log("Terreno pasa de "+aux+" a ", arr[i].state);
            }
        }
    }
}

function printFruits(f){
    let h = document.getElementById('aux');
    h.style.paddingLeft = "40px";
    h.innerHTML = "<h2> Fruits obtained -> "+f+"</h2>";
}


