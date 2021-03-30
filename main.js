
import Canvas from './canvas.js'
import Car from './car.js'
import Obstacles from './obstacles.js'

let cvs = new Canvas({
    canvasID: 'theCanvas'
})
let obstacles = new Obstacles({
    canvasID: cvs.canvasID,
})
let car = new Car({
    canvasID: cvs.canvasID,
    color: 'green',
    obstacles: obstacles.data
})

obstacles.square(400, 250, 100, 200, 'red')
obstacles.square(600, 250, 100, 50, 'blue')
cvs.mouseCoords()
car.create()

let carSpeed = 3
let carTurnRate = 2

// button control
document.getElementById('driveBtn').addEventListener('click', () => car.drive(carSpeed))
document.getElementById('leftBtn').addEventListener('click', () => { car.turn(-carTurnRate) })
document.getElementById('rightBtn').addEventListener('click', () => { car.turn(carTurnRate) })
document.getElementById('forwardBtn').addEventListener('click', () => { car.turn(0) })
document.getElementById('testBtn').addEventListener('click', () => { car.test() })

// keyboard control
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case "KeyW": { car.turn(0) } break
        case "KeyA": { car.turn(-carTurnRate) } break
        case "KeyD": { car.turn(carTurnRate) } break
        case "Space": { car.drive(carSpeed) } break
        case "KeyX": { car.test() } break
        default: break
    }
})
