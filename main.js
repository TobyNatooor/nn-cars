
import Canvas from './canvas.js'
import Obstacles from './obstacles.js'
import CarPopulation from './carPopulation.js'

const CANVASID = 'theCanvas'
let stopID

let cvs = new Canvas({
    canvasID: CANVASID,
})
let obstacles = new Obstacles({
    cvs: cvs,
})
let carPop = new CarPopulation({
    cvs: cvs,
    CarPopulation: 30,
    obstaclesData: obstacles.data,
})

function animate() {
    cvs.clear()
    carPop.drive()
    obstacles.draw()
    stopID = window.requestAnimationFrame(animate)
}
animate()
