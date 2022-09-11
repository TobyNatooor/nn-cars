import Canvas from './canvas.js'
import Obstacles from './obstacles.js'
import CarPopulation from './carPopulation.js'

const canvasHeightRange = document.querySelector('#canvasHeight')
const canvasWidthRange = document.querySelector('#canvasWidth')
const carPopulationRange = document.querySelector('#carPopulation')
const carSpeedRange = document.querySelector('#carSpeed')
const framesPerDecisionRange = document.querySelector('#framesPerDecision')
const mutationRateRange = document.querySelector('#mutationRate')
const displayCarVisionCheckbox = document.querySelector('#displayCarVision')
const displayMouseCoordsCheckbox = document.querySelector('#displayMouseCoords')
const populationNumberElement = document.querySelector('#populationNumber')
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
        mutationRate: mutationRateRange.value,
        populationNumberElement: populationNumberElement,
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

document.querySelector('#startStopButton').addEventListener('click', () => {
    if (isAnimating) {
        cancelAnimationFrame(stopID)
        isAnimating = false
    } else {
        animate()
        isAnimating = true
    }
    document.querySelector('#startStopButton').innerText = isAnimating ? "Stop" : "Start"
})

document.querySelector('#canvasHeightLabel').innerText = `Canvas height (${canvasHeightRange.value})`
canvasHeightRange.addEventListener('input', () => {
    document.querySelector('#canvasHeightLabel').innerText = `Canvas height (${canvasHeightRange.value})`
})
document.querySelector('#canvasWidthLabel').innerText = `Canvas width (${canvasWidthRange.value})`
canvasWidthRange.addEventListener('input', () => {
    document.querySelector('#canvasWidthLabel').innerText = `Canvas width (${canvasWidthRange.value})`
})
document.querySelector('#carPopulationLabel').innerText = `Car population (${carPopulationRange.value})`
carPopulationRange.addEventListener('input', () => {
    document.querySelector('#carPopulationLabel').innerText = `Car population (${carPopulationRange.value})`
})
document.querySelector('#carSpeedLabel').innerText = `Car speed (${carSpeedRange.value})`
carSpeedRange.addEventListener('input', () => {
    document.querySelector('#carSpeedLabel').innerText = `Car speed (${carSpeedRange.value})`
})
document.querySelector('#framesPerDecisionLabel').innerText = `Frames per decision (${framesPerDecisionRange.value})`
framesPerDecisionRange.addEventListener('input', () => {
    document.querySelector('#framesPerDecisionLabel').innerText = `Frames per decision (${framesPerDecisionRange.value})`
})
document.querySelector('#mutationRateLabel').innerText = `Mutation rate (${mutationRateRange.value})`
mutationRateRange.addEventListener('input', () => {
    document.querySelector('#mutationRateLabel').innerText = `Mutation rate (${mutationRateRange.value})`
})
