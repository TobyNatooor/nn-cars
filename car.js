
export default class Car {
    constructor({ canvasID, carColor }) {
        this.canvas = document.getElementById(canvasID)
        this.canvas.width = 500
        this.canvas.height = 500
        this.ctx = this.canvas.getContext('2d')
        this.coord = { x: 250, y: 250 }
        this.carColor = carColor
        this.height = 25
        this.width = 40
        this.degrees = 0
        this.turnRate = 0
        this.isDriving = false
        this.radius = Math.sqrt((this.height / 2) ** 2 + (this.width / 2) ** 2)
        this.angel = (Math.acos((this.width / 2) / this.radius) * 2) / (Math.PI / 180)
    }

    getX = (degrees) => this.coord.x + (this.radius * Math.sin((Math.PI * 2) / 360 * degrees))
    getY = (degrees) => this.coord.y - (this.radius * Math.cos((Math.PI * 2) / 360 * degrees))

    create() {
        this.degrees += this.turnRate
        this.radius = Math.sqrt((this.height / 2) ** 2 + (this.width / 2) ** 2)
        let carShape = new Path2D()
        carShape.moveTo(this.getX(this.degrees - 90 - this.angel / 2), this.getY(this.degrees - 90 - this.angel / 2))
        carShape.lineTo(this.getX(this.degrees - 90 + this.angel / 2), this.getY(this.degrees - 90 + this.angel / 2))
        carShape.lineTo(this.getX(this.degrees + 90 - this.angel / 2), this.getY(this.degrees + 90 - this.angel / 2))
        carShape.lineTo(this.getX(this.degrees + 90 + this.angel / 2), this.getY(this.degrees + 90 + this.angel / 2))

        this.ctx.fillStyle = this.carColor
        this.ctx.fill(carShape)

        //this.ctx.arc(this.coord.x, this.coord.y, this.radius, 0, 2 * Math.PI)

        let square = new Path2D()
        square.rect(300, 200, 100, 100)
        this.ctx.fillStyle = 'pink'
        this.ctx.fill(square)

        this.ctx.stroke()
    }
    remove() {
        let removeRange = 6
        let tempColor = this.carColor
        this.carColor = 'white'
        this.height += removeRange
        this.width += removeRange
        this.create()
        this.carColor = tempColor
        this.height -= removeRange
        this.width -= removeRange
    }
    getColorInFront() {
        console.log(this.ctx.getImageData(
            this.getX(this.degrees - 90 - this.angel / 2),
            this.getY(this.degrees - 90 - this.angel / 2),
            1, 1).data
        )
        console.log(this.ctx.getImageData(
            this.getX(this.degrees - 90 + this.angel / 2),
            this.getY(this.degrees - 90 + this.angel / 2),
            1, 1).data
        )
    }
    turn(amount) {
        this.turnRate = amount
    }
    move(amount) {
        this.remove()
        let xAmount = (Math.cos(2 * Math.PI * (this.degrees / 360))) * amount
        let yAmount = (Math.sin(2 * Math.PI * (this.degrees / 360))) * amount

        this.coord.x += xAmount
        this.coord.y += yAmount
        this.create()
    }
    animate() {
        this.move(0.3)
        this.stopID = window.requestAnimationFrame(() => this.animate())
    }
    drive() {
        this.isDriving = !this.isDriving
        if (this.isDriving) {
            this.animate()
        } else {
            window.cancelAnimationFrame(this.stopID)
        }
    }

    test() {
        this.getColorInFront()
    }
}
