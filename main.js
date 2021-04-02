
import Canvas from './canvas.js'
import Car from './car.js'
import Obstacles from './obstacles.js'
import NeuralNetwork from './nn.js'

const canvasID = 'theCanvas'
const carPopulation = 20
let cars = []
let deadCars = 0
let stopID
let running = false
let index = 0
let bestScore = 0
let bestCarWeights

let cvs = new Canvas({
    canvasID: canvasID,
})
let obstacles = new Obstacles({
    canvasID: canvasID,
})
function createCarPopulation(bestCarWeights) {
    cars = []
    for (let i = 0; i < carPopulation; i++) {
        let car = new Car({
            canvasID: canvasID,
            obstacles: obstacles.data,
            brain: new NeuralNetwork(3, 5, 2, bestCarWeights),
            x: cvs.canvas.width / 4,
            y: cvs.canvas.height / 4,
            index: i,
        })
        cars.push(car)
    }
}
createCarPopulation()

cvs.canvas.addEventListener('click', () => {
    if (running) window.cancelAnimationFrame(stopID)
    else main()
    running = !running
})

function getBestCarWeights() {
    for (let car of cars) {
        if (car.brainInterval > bestScore) {
            bestScore = car.brainInterval
            index = car.index
        }
    }
    let weights = cars[index].brain.getWeights()
    let weightCopies = [];
    for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
        //weights[i].dispose()
    }
    return weightCopies
}

function disposeCarBrains() {
    for (let car of cars) {
        car.brain.dispose()
    }
}

function main() {
    cvs.clear()
    deadCars = 0
    for (let car of cars) {
        car.drive()
        car.useBrain()
        if (car.isDead) deadCars++
        if (deadCars == carPopulation) {
            console.log(tf.memory().numTensors)
            bestCarWeights = getBestCarWeights()
            disposeCarBrains()
            createCarPopulation(bestCarWeights)
            for (let i in bestCarWeights) {
                bestCarWeights[i].dispose()
            }
        }
    }
    obstacles.draw()
    cvs.showMouseCoords('white')
    stopID = window.requestAnimationFrame(main)
}
if (running) main()

