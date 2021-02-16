
import Car from './car.js'

let c = new Car('theCanvas', 'green')

c.create()

document.getElementById('driveBtn')
    .addEventListener('click', () => c.drive())

let leftBtn = document.getElementById('leftBtn')
leftBtn.addEventListener('mouseover', () => { c.turn(-1.5) })
leftBtn.addEventListener('mouseout', () => { c.turn(0) })

let rightBtn = document.getElementById('rightBtn')
rightBtn.addEventListener('mouseover', () => { c.turn(1.5) })
rightBtn.addEventListener('mouseout', () => { c.turn(0) })
