
export default class Car {
    constructor(canvasID, carColor) {
        this.ctx = document.getElementById(canvasID).getContext('2d')
        this.coord = { x: 250, y: 250 }
        this.carColor = carColor
        this.height = 80
        this.width = 150
        this.degrees = 62
        this.turnRate = 0
        this.isDriving = false
        this.radius = Math.sqrt((this.height / 2) ** 2 + (this.width / 2) ** 2)
    }

    getX = (degrees) => this.coord.x + (this.radius * Math.sin((Math.PI * 2) / 360 * degrees))
    getY = (degrees) => this.coord.y - (this.radius * Math.cos((Math.PI * 2) / 360 * degrees))

    create() {
        this.degrees = (this.degrees % 360) + this.turnRate
        if (this.degrees < 0) this.degrees = 359.9

        this.radius = Math.sqrt((this.height / 2) ** 2 + (this.width / 2) ** 2)
        let angel = (Math.acos(((this.width / 2)) / this.radius) * 2) / (Math.PI / 180)
        let carShape = new Path2D()
        carShape.moveTo(this.getX(this.degrees + 0), this.getY(this.degrees + 0))
        carShape.lineTo(this.getX(this.degrees + angel), this.getY(this.degrees + angel))
        carShape.lineTo(this.getX(this.degrees + 180), this.getY(this.degrees + 180))
        carShape.lineTo(this.getX(this.degrees + 180 + angel), this.getY(this.degrees + 180 + angel))

        //this.ctx.arc(this.coord.x, this.coord.y, this.radius, 0, 2 * Math.PI)

        this.ctx.fillStyle = this.carColor
        this.ctx.fill(carShape)
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
    turn(amount) {
        this.turnRate = amount
    }
    move(amount) {
        this.remove()
        let xAmount
        if (62 > this.degrees) {
            xAmount = ((2 / -180) * (62 - this.degrees) + 1) * amount
            console.log((62 - this.degrees).toFixed(2), this.degrees.toFixed())
        }
        else if (62 <= this.degrees && this.degrees < 242) {
            xAmount = ((2 / -180) * (this.degrees - 62) + 1) * amount
            console.log((this.degrees - 62).toFixed(2), this.degrees.toFixed())
        }
        else if (this.degrees >= 242) {
            xAmount = ((2 / -180) * ((this.degrees - 62)-(((this.degrees - 62) % 180))) + 1) * amount
            console.log(((this.degrees - 62)-((this.degrees - 62) % 180)).toFixed(2), this.degrees.toFixed())
        }

        // console.log(`xAmount:${xAmount.toFixed(2)}`)
        // console.log(`Degrees:${this.degrees.toFixed(2)}`)

        // let yAmount
        this.coord.x += xAmount
        // this.coord.y += yAmount
        this.create()
    }
    animate() {
        if (this.isDriving) {
            this.move(1)
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
