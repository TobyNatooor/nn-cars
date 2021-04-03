
import Canvas from './canvas.js'
import Car from './car.js'
import Obstacles from './obstacles.js'
import NeuralNetwork from './nn.js'

const canvasID = 'theCanvas'
const carPopulation = 35
let cars = []
let deadCars = 0
let stopID
let index = 0
let bestCar = { score: 0 }

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
    for (let car of cars) {
        if (car.brainInterval > bestScore) {
            bestScore = car.brainInterval
            index = car.index
        }
    }
    let weights
    if (bestScore > bestCar.score) {
        weights = cars[index].brain.getWeights()

        let weightCopies = [];
        for (let i = 0; i < weights.length; i++) {
            weightCopies[i] = weights[i].clone();
        }
        for (let i in bestCar.weights) {
            bestCar.weights[i].dispose()
        }
        document.getElementById('highscore').innerHTML += `<li>${bestScore}</li>`
        bestCar = { weights: weightCopies, score: bestScore }
    }
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
            getBestCar()
            // document.getElementById('weightsList').innerHTML = ``
            // for (let weight of bestCar.weights) {
            //     for (let tensor of weight.dataSync()) {
            //         document.getElementById('weightsList').innerHTML += `<li>${tensor}</li>`
            //     }
            // }
            disposeCarBrains()
            createCarPopulation(bestCar.weights)
        }
    }
    obstacles.draw()
    //cvs.showMouseCoords('white')
    window.requestAnimationFrame(main)
}
main()
