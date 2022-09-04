import Canvas from './canvas.js'
import Obstacles from './obstacles.js'
import CarPopulation from './carPopulation.js'

const CANVASID = 'theCanvas'
let stopID, canvas, obstacles, carPopulation
let carPopulationRange = document.querySelector('#carPopulation')
let canvasHeightRange = document.querySelector('#canvasHeight')
let canvasWidthRange = document.querySelector('#canvasWidth')
let carSpeedRange = document.querySelector('#carSpeed')
let decisionPerIntervalRange = document.querySelector('#decisionPerInterval')
let displayCarVisionCheckbox = document.querySelector('#displayCarVision')
let displayMouseCoordsCheckbox = document.querySelector('#displayMouseCoords')

function animate() {
    canvas.clear()
    obstacles.draw()
    carPopulation.drive(displayCarVisionCheckbox.checked)
    if (displayMouseCoordsCheckbox.checked) canvas.showMouseCoords("black")
    stopID = window.requestAnimationFrame(animate)
}

function start() {
    canvas = new Canvas({
        canvasID: CANVASID,
        canvasHeight: canvasHeightRange.value,
        canvasWidth: canvasWidthRange.value,
    })
    obstacles = new Obstacles({
        cvs: canvas,
    })
    carPopulation = new CarPopulation({
        cvs: canvas,
        carPopulation: carPopulationRange.value,
        obstaclesData: obstacles.data,
        carSpeed: carSpeedRange.value,
        decisionPerInterval: decisionPerIntervalRange.value,
        isDrawingDistance: displayCarVisionCheckbox.checked,
    })
    animate()
}
start()

document.querySelector('#restartButton').addEventListener('click', () => {
    cancelAnimationFrame(stopID)
    carPopulation.disposeCarBrains()
    start()
})

carPopulationRange.addEventListener('input', () => {
    document.querySelector('#carPopulationLabel').innerHTML = `Car population (${carPopulationRange.value})`
})
canvasHeightRange.addEventListener('input', () => {
    document.querySelector('#canvasHeightLabel').innerHTML = `Canvas height (${canvasHeightRange.value})`
})
canvasWidthRange.addEventListener('input', () => {
    document.querySelector('#canvasWidthLabel').innerHTML = `Canvas width (${canvasWidthRange.value})`
})
carSpeedRange.addEventListener('input', () => {
    document.querySelector('#carSpeedLabel').innerHTML = `Car speed (${carSpeedRange.value})`
})
decisionPerIntervalRange.addEventListener('input', () => {
    document.querySelector('#decisionPerIntervalLabel').innerHTML = `Decision per frame (${decisionPerIntervalRange.value})`
})
