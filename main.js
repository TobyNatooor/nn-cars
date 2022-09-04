
import Canvas from './canvas.js'
import Obstacles from './obstacles.js'
import CarPopulation from './carPopulation.js'

const CANVASID = 'theCanvas'
let stopID
let carPopulation = document.querySelector('#carPopulation')
let canvasHeight = document.querySelector('#canvasHeight')
let canvasWidth = document.querySelector('#canvasWidth')
let carSpeed = document.querySelector('#carSpeed')


function start() {
    let canvas = new Canvas({
        canvasID: CANVASID,
        canvasHeight: canvasHeight.value,
        canvasWidth: canvasWidth.value,
    })
    let obstacles = new Obstacles({
        cvs: canvas,
    })
    let carPop = new CarPopulation({
        cvs: canvas,
        CarPopulation: carPopulation.value,
        obstaclesData: obstacles.data,
        carSpeed: carSpeed.value,
    })

    function animate() {
        canvas.clear()
        carPop.drive()
        obstacles.draw()
        canvas.showMouseCoords("black")
        stopID = window.requestAnimationFrame(animate)
    }
    animate()
}
start()

document.querySelector('#restartButton').addEventListener('click', () => {
    cancelAnimationFrame(stopID)
    start()
})

carPopulation.addEventListener('input', () => {
    document.querySelector('#carPopulationLabel').innerHTML = `Car population (${carPopulation.value})`
})
canvasHeight.addEventListener('input', () => {
    document.querySelector('#canvasHeightLabel').innerHTML = `Canvas height (${canvasHeight.value})`
})
canvasWidth.addEventListener('input', () => {
    document.querySelector('#canvasWidthLabel').innerHTML = `Canvas width (${canvasWidth.value})`
})
carSpeed.addEventListener('input', () => {
    document.querySelector('#carSpeedLabel').innerHTML = `Car speed (${carSpeed.value})`
})
