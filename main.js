
import Canvas from './canvas.js'
import Car from './car.js'
import Obstacles from './obstacles.js'

let cvs = new Canvas({
    canvasID: 'theCanvas',
})
let obstacles = new Obstacles({
    canvasID: cvs.canvasID,
})
let car = new Car({
    canvasID: cvs.canvasID,
    obstacles: obstacles.data,
    color: 'green',
})

cvs.getMouseCoordsEL()
obstacles.addSquare(0, 0, cvs.canvas.width, 100, 'blue')
obstacles.addSquare(0, cvs.canvas.height - 100, cvs.canvas.width, 100, 'blue')
obstacles.addSquare(0, 0, 100, cvs.canvas.height, 'blue')
obstacles.addSquare(cvs.canvas.width - 100, 0, 100, cvs.canvas.height, 'blue')
obstacles.addSquare(cvs.canvas.width / 6, cvs.canvas.height / 3, cvs.canvas.width / 1.5, cvs.canvas.height / 3, 'blue')

// button control
document.getElementById('driveBtn').addEventListener('click', () => { car.speed ? car.speed = 0 : car.speed = 5 })
document.getElementById('forwardBtn').addEventListener('click', () => { car.turnSpeed = 0 })
document.getElementById('leftBtn').addEventListener('click', () => { car.turnSpeed = -2 })
document.getElementById('rightBtn').addEventListener('click', () => { car.turnSpeed = 2 })
document.getElementById('testBtn').addEventListener('click', () => { car.test() })

// keyboard control
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case "Space": { car.speed ? car.speed = 0 : car.speed = 5 } break
        case "KeyW": { car.turnSpeed = 0 } break
        case "KeyA": { car.turnSpeed = -2 } break
        case "KeyD": { car.turnSpeed = 2 } break
        case "KeyX": { car.test() } break
        default: break
    }
})

function animate() {
    cvs.clear()
    car.drive()
    car.distanceToObstacle()
    obstacles.draw()
    cvs.showMouseCoords('white')
    let stopID = window.requestAnimationFrame(animate)
}
animate()
