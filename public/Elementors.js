const sectionReiniciar = document.getElementById('reiniciar')
const botonElementorJugador = document.getElementById('boton-elementor')
const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
const botonReiniciar = document.getElementById('boton-reiniciar')

const sectionSeleccionarElementor = document.getElementById('seleccionar-elementor')
const spanElementorJugador = document.getElementById('elementor-jugador')

const spanElementorEnemigo = document.getElementById('elementor-enemigo')

const spanVidasJugador = document.getElementById('victorias-jugador')
const spanVidasEnemigo = document.getElementById('victorias-enemigo')

const sectionMensajes = document.getElementById('resultado')
const ataqueEnemigoDiv = document.getElementById('ataque-enemigo')
const ataqueJugadorDiv = document.getElementById('ataque-jugador')
const contenedorAtaques = document.getElementById('contenedor-ataques')

const contenedorTarjetas = document.getElementById('contenedor-tarjetas')

const sectionVerMapa = document.getElementById('ver-mapa')
const mapa = document.getElementById('mapa')

let jugadorId = null
let enemigoId = null
let elementors = []
let elementorsEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionDeElementors
let inputRaven 
let inputSmog 
let inputKmber 
let elementorJugador
let elementorJugadorObjeto
let ataquesElementor
let ataquesElementorEnemigo
let botonFuego 
let botonAgua 
let botonTierra 
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let vidasJugador = 3
let vidasEnemigo = 3
let lienzo = mapa.getContext('2d')
let intervalo
let mapaBackground = new Image ()
mapaBackground.src = './assets/map.png'
let altura
let anchoMapa = window.innerWidth - 20
const anchoMaximoMapa = 350

if (anchoMapa > anchoMaximoMapa) {
    anchoMapa = anchoMaximoMapa -20
}

altura = anchoMapa * 600 / 800

mapa.width = anchoMapa
mapa.height = altura

class Elementor {
    constructor(nombre, foto, vida, fotoMapa, id = null) {
        this.id= id
        this.nombre = nombre
        this.foto = foto
        this.vida= vida
        this.ataques = []
        this.ancho= 40
        this.alto = 40
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y= aleatorio(0, mapa.height -  this.alto)
        this.mapaFoto = new Image ()
        this.mapaFoto.src = fotoMapa
        this.velocidadX= 0
        this.velocidadY = 0
    }
    pintarElementor () {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
    
        )
    }
}

let raven = new Elementor('Raven', './assets/Raven.png', 5, './assets/RavenCara.png')

let smog = new Elementor ('Smog', './assets/Smog.png', 5, './assets/SmogCara.png')

let kmber = new Elementor ('K-mber', './assets/K-mber.png', 5, './assets/K-mberCara.png')

const ravenAtaques = [
    {nombre: '💧',id: 'boton-agua'},
    {nombre: '💧',id: 'boton-agua'},
    {nombre: '💧',id: 'boton-agua'},
    {nombre: '🔥',id: 'boton-fuego'},
    {nombre: '🌿',id: 'boton-tierra'},
]


raven.ataques.push(...ravenAtaques)

const smogAtaques = [
    {nombre: '🌿',id: 'boton-tierra'},
    {nombre: '🌿',id: 'boton-tierra'},
    {nombre: '🌿',id: 'boton-tierra'},
    {nombre: '💧',id: 'boton-agua'},
    {nombre: '🔥',id: 'boton-fuego'},
]

smog.ataques.push(...smogAtaques)

const kmberAtaques = [
    {nombre: '🔥',id: 'boton-fuego'},
    {nombre: '🔥',id: 'boton-fuego'},
    {nombre: '🔥',id: 'boton-fuego'},
    {nombre: '💧',id: 'boton-agua'},
    {nombre: '🌿',id: 'boton-tierra'},
]

kmber.ataques.push(...kmberAtaques)

elementors.push (raven, smog, kmber)

//juego
function iniciarJuego(){

    elementors.forEach((elementor) => {
        opcionDeElementors = `
        <input type = "radio" name = "elementor" id =${elementor.nombre} />
        <label class= 'tarjeta-de-elementor' for = ${elementor.nombre} >
            <p>${elementor.nombre}</p>
            <img src=${elementor.foto} alt=${elementor.nombre}>
        </label>
        `
        contenedorTarjetas.innerHTML+=opcionDeElementors
        inputRaven = (document.getElementById('Raven'))
        inputSmog = (document.getElementById('Smog'))
        inputKmber = (document.getElementById('K-mber'))

    })
    
    sectionSeleccionarAtaque.style.display = 'none'
    sectionReiniciar.style.display = 'none'
    sectionVerMapa.style.display = 'none'
    
    botonElementorJugador.addEventListener('click', seleccionarElementorJugador)

    botonReiniciar.addEventListener('click', reiniciarJuego)

    unirseAlJuego()
}

function unirseAlJuego () {
    fetch('http://192.168.1.6:8080/unirse')
        .then(function (res) {
            if(res.ok) {
                res.text()
                    .then(function(respuesta){
                        console.log(respuesta)
                        jugadorId = respuesta
                    })
            }
        })
}

function seleccionarElementorJugador(){
    if(inputRaven.checked){
        spanElementorJugador.innerHTML = inputRaven.id
        elementorJugador = inputRaven.id
    }
    
    else if(inputSmog.checked){
        spanElementorJugador.innerHTML = inputSmog.id
        elementorJugador = inputSmog.id
    }

    else if(inputKmber.checked){
        spanElementorJugador.innerHTML = inputKmber.id
        elementorJugador = inputKmber.id
    }
    else{
        alert('¡¡Selecciona un elementor!!')
        return
    }
    sectionSeleccionarElementor.style.display = 'none'  

    seleccionarElementor(elementorJugador)

    extraerAtaques(elementorJugador)
    
    sectionVerMapa.style.display = 'flex'
    
    iniciarMapa()
    
    botonElementorJugador.disabled = true

}

function seleccionarElementor (elementorJugador) {
    fetch(`http://192.168.1.6:8080/elementor/${jugadorId}`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            elementor: elementorJugador
        })
    })
}

function extraerAtaques(elementorJugador) {
    let ataques 
    for (let i = 0; i < elementors.length; i++) {
        if (elementorJugador === elementors[i].nombre) {
            ataques = elementors[i].ataques
        }
        
    }
    
    mostrarAtaques(ataques)
}

function mostrarAtaques (ataques) {
    
    ataques.forEach((ataque) => {
        ataquesElementor = `
        <button id = ${ataque.id} class='boton-ataque BAtaque'>${ataque.nombre}</button> 
        `
        contenedorAtaques.innerHTML += ataquesElementor
    })

    botonFuego = document.getElementById('boton-fuego')
    botonAgua = document.getElementById('boton-agua')
    botonTierra = document.getElementById('boton-tierra')
    botones = document.querySelectorAll('.BAtaque')

}

function secuenciaAtaque() {
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            if (e.target.textContent === '🔥') {
                ataqueJugador.push('FUEGO')
                console.log(ataqueJugador)
                boton.style.background = '#112f58' 
                boton.disabled = true
            } else if (e.target.textContent === '💧') {
                ataqueJugador.push('AGUA')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'
                boton.disabled = true
            } else {
                ataqueJugador.push('TIERRA')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'
                boton.disabled = true
            }
            if (ataqueJugador.length === 5) {
                enviarAtaques()
            }
            
        })
    })
    
}

function enviarAtaques () {
    fetch(`http://192.168.1.6:8080/elementor/${jugadorId}/ataques`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })

    intervalo = setInterval (obtenerAtaques, 50)
}

function obtenerAtaques () {
    fetch(`http://192.168.1.6:8080/elementor/${enemigoId}/ataques`)
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function ({ ataques }) {
                        if (ataques.length === 5) {
                            ataqueEnemigo = ataques
                                combate()
                        }
                    }) 
            }
        })
}

function seleccionarElementorEnemigo(enemigo) {
    spanElementorEnemigo.innerHTML = enemigo.nombre
    ataquesElementorEnemigo = enemigo.ataques
    secuenciaAtaque () 
}



function ataqueAleatorioEnemigo() {
    let ataqueAleatorio = aleatorio(0,ataquesElementorEnemigo.length -1)
    
    if (ataqueAleatorio == 0 || ataqueAleatorio == 1) {
        ataqueEnemigo.push('FUEGO')
    } else if (ataqueAleatorio == 3 || ataqueAleatorio == 4) {
        ataqueEnemigo.push('AGUA')
    } else {
        ataqueEnemigo.push('TIERRA')
    }
    console.log(ataqueEnemigo)
    iniciarPelea()
    
}

function iniciarPelea (){
    if (ataqueJugador.length === 5) {
        combate()
    }
}

function indexAmbosRivales (jugador, enemigo) {
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function combate () {
    clearInterval(intervalo)

    for (let index = 0; index < ataqueJugador.length; index++) {
        if(ataqueJugador[index] === ataqueEnemigo[index]) {
            indexAmbosRivales (index, index)
            crearMensaje('DRAW')

        } else if (ataqueJugador[index] === 'FUEGO' && ataqueEnemigo[index] === 'TIERRA') {
            indexAmbosRivales (index, index) 
            crearMensaje ('WIN')
            victoriasJugador ++ 
            spanVidasJugador.innerHTML = victoriasJugador
            
        } else if (ataqueJugador[index] === 'AGUA' && ataqueEnemigo[index] === 'FUEGO') {
            indexAmbosRivales (index, index) 
            crearMensaje ('WIN')
            victoriasJugador ++  
            spanVidasJugador.innerHTML = victoriasJugador
            
        } else if (ataqueJugador[index] === 'TIERRA' && ataqueEnemigo[index] === 'AGUA') {
            indexAmbosRivales (index, index) 
            crearMensaje ('WIN')
            victoriasJugador ++ 
            spanVidasJugador.innerHTML = victoriasJugador
            
        } else {
            indexAmbosRivales (index, index) 
            crearMensaje ('LOSE')
            victoriasEnemigo ++
            spanVidasEnemigo.innerHTML = victoriasEnemigo
        }
    
        revisarVictorias()
    }
}
            
         

function revisarVictorias() {
    if(victoriasJugador == victoriasEnemigo) { 
        crearMensajeFinal('DRAW')
    }
    else if(victoriasJugador > victoriasEnemigo){
        crearMensajeFinal('VICTORY 🎉')

    } else {
        crearMensajeFinal('DEFEAT 💀')
    }
   
}

function crearMensaje(resultado) {
    sectionMensajes.innerHTML = resultado;

    let nuevoAtaqueJugador = document.createElement('p');
    nuevoAtaqueJugador.innerHTML = indexAtaqueJugador;

    let nuevoAtaqueEnemigo = document.createElement('p');
    nuevoAtaqueEnemigo.innerHTML = indexAtaqueEnemigo;

    ataqueJugadorDiv.appendChild(nuevoAtaqueJugador);
    ataqueEnemigoDiv.appendChild(nuevoAtaqueEnemigo);
}


function crearMensajeFinal(resultadoFinal) {
    

    sectionMensajes.innerHTML = resultadoFinal
    

    sectionReiniciar.style.display = 'block'
}
function reiniciarJuego(){
    location.reload()

}

function aleatorio(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min)
}

function pintarCanvas() {
    elementorJugadorObjeto.x = elementorJugadorObjeto.x + elementorJugadorObjeto.velocidadX
    elementorJugadorObjeto.y = elementorJugadorObjeto.y + elementorJugadorObjeto.velocidadY
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
    elementorJugadorObjeto.pintarElementor()

    enviarPosicion(elementorJugadorObjeto.x, elementorJugadorObjeto.y)

    elementorsEnemigos.forEach(function (elementor) {
        elementor.pintarElementor()
        revisarColision(elementor)
    })

    if (elementorJugadorObjeto.velocidadX !==0 || elementorJugadorObjeto.velocidadY !==0) {
        revisarColision(ravenEnemigo)
        revisarColision(smogEnemigo)
        revisarColision(kmberEnemigo)
    }
}

function enviarPosicion(x, y) {
    fetch(`http://192.168.1.6:8080/elementor/${jugadorId}/posicion`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function(res){
        if(res.ok) {
            res.json()
            .then(function({ enemigos }) {
                console.log(enemigos)
                elementorsEnemigos = enemigos.map(function(enemigo){
                    let elementorEnemigo = null
                    const elementorNombre = enemigo.elementor.nombre || ''
                    if(elementorNombre === 'Raven') {
                        elementorEnemigo = new Elementor('Raven', './assets/Raven.png', 5, './assets/RavenCara.png', enemigo.id)
                    } else if (elementorNombre === 'Smog') {
                        elementorEnemigo = new Elementor ('Smog', './assets/Smog.png', 5, './assets/SmogCara.png', enemigo.id)
                    } else if (elementorNombre === 'K-mber') {
                        elementorEnemigo = new Elementor ('K-mber', './assets/K-mber.png', 5, './assets/K-mberCara.png', enemigo.id)
                    }

                    elementorEnemigo.x = enemigo.x
                    elementorEnemigo.y = enemigo.y

                    return elementorEnemigo
                })

            })
        }
    })
}

function moverDerecha () {
    elementorJugadorObjeto.velocidadX = 5
}

function moverIzquierda () {
    elementorJugadorObjeto.velocidadX = -5
}

function moverAbajo () {
    elementorJugadorObjeto.velocidadY = 5
}

function moverArriba () {
    elementorJugadorObjeto.velocidadY = -5
}

function detenerMovimiento () {
    elementorJugadorObjeto.velocidadX = 0
    elementorJugadorObjeto.velocidadY = 0
}

function PresionTecla (event) {
    switch (event.key) {
        case 'ArrowUp':
            moverArriba()
            break
        case 'ArrowDown':
            moverAbajo()
            break
        case 'ArrowLeft':
            moverIzquierda()
            break
        case 'ArrowRight':
            moverDerecha()
            break
    
        default:
            break;
    }
}

function iniciarMapa() {

    elementorJugadorObjeto = obtenerObjetoElementor (elementorJugador)
    intervalo = setInterval(pintarCanvas, 50)

    window.addEventListener('keydown', PresionTecla)

    window.addEventListener('keyup', detenerMovimiento)
}

function obtenerObjetoElementor() {
    for (let i = 0; i < elementors.length; i++) {
        if (elementorJugador === elementors[i].nombre) {
            return elementors[i]
        }       
    }
}

function revisarColision (enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaElementor = elementorJugadorObjeto.y
    const abajoElementor = elementorJugadorObjeto.y + elementorJugadorObjeto.alto
    const derechaElementor = elementorJugadorObjeto.x + elementorJugadorObjeto.ancho
    const izquierdaElementor = elementorJugadorObjeto.x

    if(
        abajoElementor < arribaEnemigo ||
        arribaElementor > abajoEnemigo ||
        derechaElementor < izquierdaEnemigo ||
        izquierdaElementor > derechaEnemigo
    ) {
        return 
    }

    if(enemigo.x == undefined || enemigo.y == undefined){
        return
    }
    
    detenerMovimiento ()
    clearInterval(intervalo)

    enemigoId = enemigo.id

    sectionSeleccionarAtaque.style.display = 'flex'
    sectionVerMapa.style.display = 'none'
    seleccionarElementorEnemigo(enemigo)
    
    
}

window.addEventListener('load', iniciarJuego)
