import Canvas from './canvas.js'
import Obstacles from './obstacles.js'
import CarPopulation from './carPopulation.js'

import {Asdom} from './node_modules/asdom/glue/index.js'
import {ECMAssembly} from './node_modules/ecmassembly/index.js'
import {instantiate} from './node_modules/@assemblyscript/loader/index.js'

async function main() {
	const asdom = new Asdom()
	const ecmassembly = new ECMAssembly()
	const {exports} = await instantiate(fetch('./build/untouched.wasm'), {
		...asdom.wasmImports,
		...ecmassembly.wasmImports,
	})
    asdom.wasmExports = exports
	ecmassembly.wasmExports = exports
	exports._start()
}
main()

const carPopulationRange            = document.querySelector('#carPopulation')
const carSpeedRange                 = document.querySelector('#carSpeed')
const framesPerDecisionRange        = document.querySelector('#framesPerDecision')
const mutationRateRange             = document.querySelector('#mutationRate')
const displayCarVisionCheckbox      = document.querySelector('#displayCarVision')
const displayMouseCoordsCheckbox    = document.querySelector('#displayMouseCoords')
const generationLabel               = document.querySelector('#populationNumber')
const mutationAmountRange           = document.querySelector('#mutationAmount')
const hiddenNeuronsRange            = document.querySelector('#hiddenNeurons')
const CANVASID = 'theCanvas'

let stopID, canvas, obstacles, carPopulation
let isAnimating = true

function animate() {
    canvas.clear()
    obstacles.draw()
    carPopulation.drive()
    carPopulation.draw()
    if (carPopulation.deadCars == carPopulation.carPopulation) generationLabel.innerHTML = `Generation: ${carPopulation.generation}`
    if (displayCarVisionCheckbox.checked) carPopulation.drawDistances()
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
        framesPerDecision: parseInt(framesPerDecisionRange.value),
        hiddenNeurons: parseInt(hiddenNeuronsRange.value),
        mutationRate: parseFloat(mutationRateRange.value),
        mutationAmount: parseFloat(mutationAmountRange.value),
    })
    generationLabel.innerHTML = `Generation: ${carPopulation.generation}`
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
document.querySelector('#framesPerDecisionLabel').innerText = `Frames per decision (${framesPerDecisionRange.value})`
framesPerDecisionRange.addEventListener('input', () => {
    document.querySelector('#framesPerDecisionLabel').innerText = `Frames per decision (${framesPerDecisionRange.value})`
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
