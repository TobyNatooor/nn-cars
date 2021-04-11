
import Canvas from './canvas.js'
import Car from './car.js'
import Obstacles from './obstacles.js'
import NeuralNetwork from './nn.js'

const CANVASID = 'theCanvas'
const CARPOPULATION = 30
let cars = []
let deadCars = 0
let bestCar = { score: 0 }
let index = 0
let stopID

let cvs = new Canvas({
    canvasID: CANVASID,
})
let obstacles = new Obstacles({
    canvasID: CANVASID,
})
function createCarPopulation(bestCarWeights) {
    cars = []
    for (let i = 0; i < CARPOPULATION; i++) {
        let car = new Car({
            canvasID: CANVASID,
            obstacles: obstacles.data,
            brain: new NeuralNetwork(5, 8, 2, bestCarWeights),
            x: cvs.canvas.width / 4,
            y: cvs.canvas.height / 4.7,
            height: cvs.canvas.width / 105,
            width: cvs.canvas.width / 65,
            index: i,
        })
        cars.push(car)
    }
}
createCarPopulation()

function getBestCar() {
    let bestScore = 0
    for (const car of cars) {
        if (car.brainInterval > bestScore) {
            bestScore = car.brainInterval
            index = car.index
        }
    }
    let weights
    if (bestScore > bestCar.score) {
        weights = cars[index].brain.model.getWeights()

        let weightCopies = []
        for (const i in weights) {
            weightCopies[i] = weights[i].clone()
        }
        for (const i in bestCar.weights) {
            bestCar.weights[i].dispose()
        }

        bestCar = { weights: weightCopies, score: bestScore }
    }
}

function disposeCarBrains() {
    for (let car of cars) {
        car.brain.dispose()
    }
}

function animate() {
    cvs.clear()
    deadCars = 0
    for (let car of cars) {
        car.drive()
        car.useBrain()
        if (car.isDead) deadCars++
        if (deadCars == CARPOPULATION) {
            console.log(tf.memory().numTensors)
            getBestCar()
            disposeCarBrains()
            createCarPopulation(bestCar.weights)
        }
    }
    obstacles.draw()
    window.requestAnimationFrame(animate)
}
animate()
