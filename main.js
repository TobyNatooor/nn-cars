
import Canvas from './canvas.js'
import Car from './car.js'
import Obstacles from './obstacles.js'
import NeuralNetwork from './nn.js'

const canvasID = 'theCanvas'
const carPopulation = 20
let cars = []
let deadCars = 0
let stopID
let index = 0
let bestScore = 0
let bestCar = {}

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
            height: cvs.canvas.width / 95,
            width: cvs.canvas.width / 55,
            index: i,
        })
        cars.push(car)
    }
}
createCarPopulation()

function getBestCar() {
    for (let car of cars) {
        if (car.brainInterval > bestScore) {
            bestScore = car.brainInterval
            index = car.index
        }
    }
    if (bestCar.score > bestScore) {
        console.log(bestCar.score)
        return { weights: bestCar.weights, score: bestCar.score }
    }
    let weights = cars[index].brain.getWeights()
    let weightCopies = [];
    for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
    }
    console.log(bestScore)
    return { weights: weightCopies, score: bestScore }
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
            //console.log(tf.memory().numTensors)
            bestCar = getBestCar()
            document.getElementById('weightsList').innerHTML = ``
            for (let weight of bestCar.weights) {
                for (let tensor of weight.dataSync()) {
                    document.getElementById('weightsList').innerHTML += `<li>${tensor}</li>`
                }
            }
            disposeCarBrains()
            createCarPopulation(bestCar.weights)
            for (let i in bestCar.weights) {
                bestCar.weights[i].dispose()
            }
        }
    }
    obstacles.draw()
    //cvs.showMouseCoords('white')
    window.requestAnimationFrame(main)
}
main()
