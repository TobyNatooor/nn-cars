import Canvas from './canvas.js'
import Obstacles from './obstacles.js'
import CarPopulation from './carPopulation.js'

const carPopulationRange            = document.querySelector('#carPopulation')
const carSpeedRange                 = document.querySelector('#carSpeed')
const mutationRateRange             = document.querySelector('#mutationRate')
const displayCarVisionCheckbox      = document.querySelector('#displayCarVision')
const displayMouseCoordsCheckbox    = document.querySelector('#displayMouseCoords')
const generationLabel               = document.querySelector('#generation')
const mutationAmountRange           = document.querySelector('#mutationAmount')
const hiddenNeuronsRange            = document.querySelector('#hiddenNeurons')
const inputsRange                   = document.querySelector('#inputs')
const CANVASID                      = 'theCanvas'

let stopID, canvas, obstacles, carPopulation
let isAnimating = true

function animate() {
    canvas.clear()
    obstacles.draw()
    carPopulation.livingCars((car) => {
        car.dieIfHitObstacle(obstacles.data)
        car.updateDistanceToObstacles(obstacles.data)
        car.useBrain()
        car.drive()
        car.draw()
        if (displayCarVisionCheckbox.checked) car.drawDistances()
    })

    if (carPopulation.isDead()) {
        carPopulation.newGeneration()
        generationLabel.innerHTML = `Generation: ${carPopulation.generation}`
    }
    if (displayMouseCoordsCheckbox.checked) canvas.showMouseCoords("black")

    stopID = window.requestAnimationFrame(animate)
}

function start() {
    canvas = new Canvas({ canvasID: CANVASID, })
    obstacles = new Obstacles({ cvs: canvas, })
    carPopulation = new CarPopulation({
        cvs: canvas,
        obstacles: obstacles.data,
        isDrawingDistance: displayCarVisionCheckbox.checked,
        carPopulation: parseInt(carPopulationRange.value),
        carSpeed: parseFloat(carSpeedRange.value),
        hiddenNeurons: parseInt(hiddenNeuronsRange.value),
        mutationRate: parseFloat(mutationRateRange.value),
        mutationAmount: parseFloat(mutationAmountRange.value),
        inputAmount: parseFloat(inputsRange.value),
    })
    generationLabel.innerHTML = `Generation: ${carPopulation.generation}`
    animate()
}
start()

document.querySelector('#restartButton').addEventListener('click', () => {
    if (isAnimating) {
        cancelAnimationFrame(stopID)
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

document.querySelector('#killAllButton').addEventListener('click', () => {
    carPopulation.newGeneration()
    generationLabel.innerHTML = `Generation: ${carPopulation.generation}`
})

document.querySelector('#carPopulationLabel').innerText = `Car population (${carPopulationRange.value})`
carPopulationRange.addEventListener('input', () => {
    document.querySelector('#carPopulationLabel').innerText = `Car population (${carPopulationRange.value})`
})
document.querySelector('#carSpeedLabel').innerText = `Car speed (${carSpeedRange.value})`
carSpeedRange.addEventListener('input', () => {
    document.querySelector('#carSpeedLabel').innerText = `Car speed (${carSpeedRange.value})`
})
document.querySelector('#mutationRateLabel').innerText = `Mutation rate (${mutationRateRange.value})`
mutationRateRange.addEventListener('input', () => {
    document.querySelector('#mutationRateLabel').innerText = `Mutation rate (${mutationRateRange.value})`
})
document.querySelector('#mutationAmountLabel').innerText = `Mutation amount (${mutationAmountRange.value})`
mutationAmountRange.addEventListener('input', () => {
    document.querySelector('#mutationAmountLabel').innerText = `Mutation amount (${mutationAmountRange.value})`
})
document.querySelector('#hiddenNeuronsLabel').innerText = `Hidden neurons (${hiddenNeuronsRange.value})`
hiddenNeuronsRange.addEventListener('input', () => {
    document.querySelector('#hiddenNeuronsLabel').innerText = `Hidden neurons (${hiddenNeuronsRange.value})`
})
document.querySelector('#inputsLabel').innerText = `Distance inputs (${inputsRange.value})`
inputsRange.addEventListener('input', () => {
    document.querySelector('#inputsLabel').innerText = `Distance inputs (${inputsRange.value})`
})
