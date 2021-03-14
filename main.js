
import Car from './car.js'

let c = new Car({
    canvasID: 'theCanvas',
    color: 'green',
    width: 100,
    height: 40,
    x: 210,
    y: 210
})

c.create()

let carSpeed = 8
let carTurnRate = 2

// button control
document.getElementById('driveBtn').addEventListener('click', () => c.drive(carSpeed))
document.getElementById('leftBtn').addEventListener('click', () => { c.turn(-carTurnRate) })
document.getElementById('rightBtn').addEventListener('click', () => { c.turn(carTurnRate) })
document.getElementById('forwardBtn').addEventListener('click', () => { c.turn(0) })
document.getElementById('testBtn').addEventListener('click', () => { c.test() })

// keyboard control
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case "KeyW": { c.turn(0) } break
        case "KeyA": { c.turn(-carTurnRate) } break
        case "KeyD": { c.turn(carTurnRate) } break
        case "Space": { c.drive(carSpeed) } break
        case "KeyX": { c.test() } break
        default: break
    }
})

console.log(document.body.clientWidth, document.body.clientHeight)
