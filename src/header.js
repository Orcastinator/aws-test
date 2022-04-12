// CONSTANTES
const GLOBAL = {
    W: 1500,
    H: 700,
    P: 50
};

// CLASES
class Ground{
    constructor(x, y, state, id){
        this.size = GLOBAL.P;
        this.x = x;
        this.y = y;
        this.id = id;
        this.state = state;
        this.buildable = true;
    }
}
exports.Ground = Ground;
exports.GLOBAL = GLOBAL;