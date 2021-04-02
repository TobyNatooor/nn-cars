
import Canvas from './canvas.js'
import Car from './car.js'
import Obstacles from './obstacles.js'
import NeuralNetwork from './nn.js'

const canvasID = 'theCanvas'
const carPopulation = 1
let cars = []
let deadCars = 0
let stopID
let running = true

let cvs = new Canvas({
    canvasID: canvasID,
})
let obstacles = new Obstacles({
    canvasID: canvasID,
})
function createCarPopulation(numOfCars) {
    cars = []
    for (let i = 0; i < numOfCars; i++) {
        let car = new Car({
            canvasID: canvasID,
            obstacles: obstacles.data,
            brain: new NeuralNetwork(3, 5, 2),
            x: cvs.canvas.width / 4,
            y: cvs.canvas.height / 4,
        })
        cars.push(car)
    }
}
createCarPopulation(carPopulation)

cvs.canvas.addEventListener('click', () => {
    if (running) window.cancelAnimationFrame(stopID)
    else animate()
    running = !running
})

function animate() {
    cvs.clear()
    deadCars = 0
    for (const car of cars) {
        car.drive()
        car.useBrain()
        if (car.isDead) deadCars++
        if (deadCars == carPopulation) createCarPopulation(carPopulation)
    }
    obstacles.draw()
    cvs.showMouseCoords('white')
    stopID = window.requestAnimationFrame(animate)
}
if (running) animate()

