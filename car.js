
export default class Car {
    constructor(canvasID, carColor) {
        this.ctx = document.getElementById(canvasID).getContext('2d')
        this.coord = { x: 250, y: 250 }
        this.carColor = carColor
        this.height = 80
        this.width = 150
        this.degrees = 0
        this.turnRate = 0
        this.isDriving = false
        this.radius = Math.sqrt((this.height / 2) ** 2 + (this.width / 2) ** 2)
    }

    getX = (degrees) => this.radius * Math.sin((Math.PI * 2) / 360 * degrees)
    getY = (degrees) => this.radius * Math.cos((Math.PI * 2) / 360 * degrees)

    create() {
        this.degrees += this.turnRate
        let carShape = new Path2D()
        carShape.moveTo(this.coord.x + this.getX(this.degrees), this.coord.y - this.getY(this.degrees))
        carShape.lineTo(this.coord.x + this.getX(this.degrees+90), this.coord.y - this.getY(this.degrees+90))
        carShape.lineTo(this.coord.x + this.getX(this.degrees+180), this.coord.y - this.getY(this.degrees+180))
        carShape.lineTo(this.coord.x + this.getX(this.degrees+270), this.coord.y - this.getY(this.degrees+270))

        this.ctx.fillStyle = this.carColor
        this.ctx.fill(carShape)
        this.ctx.stroke()
    }
    remove() {
        let removeRange = 1
        let tempColor = this.carColor
        this.carColor = 'white'
        this.coord.x -= removeRange
        this.coord.y -= removeRange
        this.height += removeRange * 5
        this.width += removeRange
        this.create()
        this.carColor = tempColor
        this.coord.x += removeRange
        this.coord.y += removeRange
        this.height -= removeRange * 5
        this.width -= removeRange
    }
    turn(amount) {
        this.turnRate = amount
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

    test() {
        this.remove()
        this.degrees += 10
        this.create()

    }
}
