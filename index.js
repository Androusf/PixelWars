const express = require('express')
const cors = require('cors')

const app = express()
http://LAPTOP-PIPE.local:8080
app.use(express.static('public'))
app.use(cors())
app.use(express.json())

const jugadores = []

class Jugador {
    constructor(id){
        this.id = id
    }
    asiganarElementor(elementor){
        this.elementor = elementor
    }

    actualizarPosicion(x, y) {
        this.x = x
        this.y = y
    }
    asiganarAtaques (ataques){
        this.ataques = ataques
    }
}

class Elementor {
    constructor(nombre){
        this.nombre = nombre
    }
}

app.get('/unirse', (req, res) => {
    const id = `${Math.random()}`

    const jugador = new Jugador (id)

    jugadores.push(jugador)

    res.setHeader('Access-Control-Allow-Origin', '*')

    res.send(id)
}) 

app.post('/elementor/:jugadorId', (req, res) => {
    const jugadorId = req.params.jugadorId || ''
    const nombre = req.body.elementor || ''
    const elementor = new Elementor(nombre)

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
    
    if(jugadorIndex >= 0) {
        jugadores[jugadorIndex].asiganarElementor(elementor)
    }

    console.log(jugadores)
    console.log(jugadorId)
    res.end()
})
app.post('/elementor/:jugadorId/posicion', (req,res) => {
    const jugadorId = req.params.jugadorId || ''
    const x = req.body.x || 0
    const y = req.body.y || 0

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
    
    if(jugadorIndex >= 0) {
        jugadores[jugadorIndex].actualizarPosicion(x, y)
    }

    const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id)

    res.send({
        enemigos
    })
})

app.post('/elementor/:jugadorId/ataques', (req, res) => {
    const jugadorId = req.params.jugadorId || ''
    const ataques = req.body.ataques || []

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
    
    if(jugadorIndex >= 0) {
        jugadores[jugadorIndex].asiganarAtaques(ataques)
    }

    
    res.end()
})

app.get('/elementor/:jugadorId/ataques', (req, res) => {
    const jugadorId = req.params.jugadorId || ''
    const jugador = jugadores.find((jugador) => jugador.id === jugadorId)
    res.send({
        ataques: jugador.ataques || []
    })
})

app.listen(8080, () => {
    console.log('Server started')
})