
import Car from './car.js'

let c = new Car('theCanvas', 'green')

c.create()

document.getElementById('driveBtn').addEventListener('click', () => c.drive())

document.getElementById('leftBtn')
    .addEventListener('click', () => { c.turn(-0.4) })

document.getElementById('forwardBtn')
    .addEventListener('click', () => { c.turn(0) })

document.getElementById('rightBtn')
    .addEventListener('click', () => { c.turn(0.4) })

document.getElementById('testBtn').addEventListener('click', () => {
    c.test()
})

