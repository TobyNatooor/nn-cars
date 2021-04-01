
import Canvas from './canvas.js'
import Car from './car.js'
import Obstacles from './obstacles.js'
import NeuralNetwork from './nn.js'

let cvs = new Canvas({
    canvasID: 'theCanvas',
})
let obstacles = new Obstacles({
    canvasID: cvs.canvasID,
})

const carPopulation = 5
let cars
function createCarPopulation(numOfCars) {
    cars = []
    for (let i = 0; i < numOfCars; i++) {
        let car = new Car({
            canvasID: cvs.canvasID,
            obstacles: obstacles.data,
            brain: new NeuralNetwork(3, 5, 2),
            x: cvs.canvas.width / 4,
            y: cvs.canvas.height / 4,
        })
        cars.push(car)
    }
}
createCarPopulation(carPopulation)

cvs.getMouseCoordsEL()
obstacles.addSquare(0, 0, cvs.canvas.width, 100, 'blue')
obstacles.addSquare(0, cvs.canvas.height - 100, cvs.canvas.width, 100, 'blue')
obstacles.addSquare(0, 0, 100, cvs.canvas.height, 'blue')
obstacles.addSquare(cvs.canvas.width - 100, 0, 100, cvs.canvas.height, 'blue')
obstacles.addSquare(cvs.canvas.width / 6, cvs.canvas.height / 3, cvs.canvas.width / 1.5, cvs.canvas.height / 3, 'blue')

// // button control
// document.getElementById('driveBtn').addEventListener('click', () => { car.driveSwitch() })
// document.getElementById('forwardBtn').addEventListener('click', () => { car.turnForward() })
// document.getElementById('leftBtn').addEventListener('click', () => { car.turnLeft() })
// document.getElementById('rightBtn').addEventListener('click', () => { car.turnRight() })
// document.getElementById('testBtn').addEventListener('click', () => { car.test() })

// keyboard control
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case "Space": { car.driveSwitch() } break
        case "KeyW": { car.turnForward() } break
        case "KeyA": { car.turnLeft() } break
        case "KeyD": { car.turnRight() } break
        case "KeyX": { car.test() } break
        default: break
    }
})

let deadCars = 0
function animate() {
    deadCars = 0
    cvs.clear()
    for (const car of cars) {
        car.drive()
        car.useBrain()
        if (car.isDead) deadCars++
        if (deadCars == carPopulation) createCarPopulation(carPopulation)
    }
    obstacles.draw()
    cvs.showMouseCoords('white')
    let stopID = window.requestAnimationFrame(animate)
}
animate()
