
import Car from './car.js'

let c = new Car({
    canvasID: 'theCanvas',
    carColor: 'green'
})

c.create()

document.getElementById('driveBtn').addEventListener('click', () => c.drive(1))

document.getElementById('leftBtn')
    .addEventListener('click', () => { c.turn(-1) })

document.getElementById('forwardBtn')
    .addEventListener('click', () => { c.turn(0) })

document.getElementById('rightBtn')
    .addEventListener('click', () => { c.turn(1) })

document.getElementById('testBtn').addEventListener('click', () => {
    c.test()
})

