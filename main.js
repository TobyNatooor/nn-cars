
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

// button control
document.getElementById('driveBtn').addEventListener('click', () => { car.speed = 5 })
document.getElementById('leftBtn').addEventListener('click', () => { car.turnSpeed = -5 })
document.getElementById('rightBtn').addEventListener('click', () => { car.turnSpeed = 5 })
document.getElementById('forwardBtn').addEventListener('click', () => { car.turnSpeed = 0 })
document.getElementById('testBtn').addEventListener('click', () => { car.test() })

// keyboard control
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case "KeyW": { car.turnSpeed = 0 } break
        case "KeyA": { car.turnSpeed = -5 } break
        case "KeyD": { car.turnSpeed = 5 } break
        case "Space": { car.speed = 5 } break
        case "KeyX": { car.test() } break
        default: break
    }
})

function animate() {
    cvs.clear()
    car.drive()
    obstacles.draw()
    let stopID = window.requestAnimationFrame(animate)
}
animate()
