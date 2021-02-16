
export default class Car {
    constructor(canvasID, carColor) {
        this.ctx = document.getElementById(canvasID).getContext('2d')
        this.coord = { x: 250, y: 250 }
        this.carColor = carColor
        this.height = 30
        this.width = 60
        this.rotate = 0
        this.isDriving = false
    }
    create(removing) {
        //the purpose of this variable is not leave a small trail of car pieces
        let biggerCar = removing ? 1 : 0
        let carShape = new Path2D()
        carShape.rect(this.coord.x - (this.width / 2) - biggerCar,
            this.coord.y - (this.height / 2) - biggerCar,
            this.width + biggerCar * 2,
            this.height + biggerCar * 2
        )
        //translate functions are neccesary for rotation as the rotate function rotates around the top left corner
        this.ctx.translate(this.coord.x, this.coord.y)
        this.ctx.rotate(Math.PI * 2 / 360 * this.rotate)
        this.ctx.translate(-this.coord.x, -this.coord.y)

        this.ctx.fillStyle = removing ? 'white' : this.carColor
        this.ctx.fill(carShape)
        this.ctx.stroke()
    }
    remove() {
        this.create(true)
    }
    turn(amount) {
        this.rotate = amount
    }
    move(amount) {
        this.remove()
        this.coord.x += amount
        this.create()
    }
    animate() {
        if (this.isDriving) {
            this.move(3)
            this.stopID = window.requestAnimationFrame(() => this.animate())
        }
    }
    drive() {
        this.isDriving = !this.isDriving
        this.animate()
    }
}
