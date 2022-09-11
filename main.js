import Canvas from './canvas.js'
import Obstacles from './obstacles.js'
import CarPopulation from './carPopulation.js'

const carPopulationRange = document.querySelector('#carPopulation')
const canvasHeightRange = document.querySelector('#canvasHeight')
const canvasWidthRange = document.querySelector('#canvasWidth')
const carSpeedRange = document.querySelector('#carSpeed')
const framesPerDecisionRange = document.querySelector('#framesPerDecision')
const displayCarVisionCheckbox = document.querySelector('#displayCarVision')
const displayMouseCoordsCheckbox = document.querySelector('#displayMouseCoords')
const CANVASID = 'theCanvas'

let stopID, canvas, obstacles, carPopulation
let isAnimating = true

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
        framesPerDecision: framesPerDecisionRange.value,
        isDrawingDistance: displayCarVisionCheckbox.checked,
    })
    animate()
}
start()

document.querySelector('#restartButton').addEventListener('click', () => {
    if (isAnimating) {
        cancelAnimationFrame(stopID)
        carPopulation.disposeCarBrains()
    } 
    start()
    isAnimating = true
})

document.querySelector('#stopButton').addEventListener('click', () => {
    cancelAnimationFrame(stopID)
    carPopulation.disposeCarBrains()
    isAnimating = false
})

document.querySelector('#carPopulationLabel').innerHTML = `Car population (${carPopulationRange.value})`
carPopulationRange.addEventListener('input', () => {
    document.querySelector('#carPopulationLabel').innerHTML = `Car population (${carPopulationRange.value})`
})
document.querySelector('#canvasHeightLabel').innerHTML = `Canvas height (${canvasHeightRange.value})`
canvasHeightRange.addEventListener('input', () => {
    document.querySelector('#canvasHeightLabel').innerHTML = `Canvas height (${canvasHeightRange.value})`
})
document.querySelector('#canvasWidthLabel').innerHTML = `Canvas width (${canvasWidthRange.value})`
canvasWidthRange.addEventListener('input', () => {
    document.querySelector('#canvasWidthLabel').innerHTML = `Canvas width (${canvasWidthRange.value})`
})
document.querySelector('#carSpeedLabel').innerHTML = `Car speed (${carSpeedRange.value})`
carSpeedRange.addEventListener('input', () => {
    document.querySelector('#carSpeedLabel').innerHTML = `Car speed (${carSpeedRange.value})`
})
document.querySelector('#framesPerDecisionLabel').innerHTML = `Frames per decision (${framesPerDecisionRange.value})`
framesPerDecisionRange.addEventListener('input', () => {
    document.querySelector('#framesPerDecisionLabel').innerHTML = `Frames per decision (${framesPerDecisionRange.value})`
})
