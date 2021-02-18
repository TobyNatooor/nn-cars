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
        this.obstacleColor = [190, 110, 110]
    }

    getX = (degrees) => this.coord.x + (this.radius * Math.sin((Math.PI * 2) / 360 * degrees))
    getY = (degrees) => this.coord.y - (this.radius * Math.cos((Math.PI * 2) / 360 * degrees))

    create() {
        this.degrees += this.turnRate
        this.radius = Math.sqrt((this.height / 2) ** 2 + (this.width / 2) ** 2)
        this.angel = (Math.acos((this.width / 2) / this.radius) * 2) / (Math.PI / 180)
        let carShape = new Path2D()
        carShape.moveTo(this.getX(this.degrees - 90 - this.angel / 2), this.getY(this.degrees - 90 - this.angel / 2))
        carShape.lineTo(this.getX(this.degrees - 90 + this.angel / 2), this.getY(this.degrees - 90 + this.angel / 2))
        carShape.lineTo(this.getX(this.degrees + 90 - this.angel / 2), this.getY(this.degrees + 90 - this.angel / 2))
        carShape.lineTo(this.getX(this.degrees + 90 + this.angel / 2), this.getY(this.degrees + 90 + this.angel / 2))

        this.ctx.fillStyle = this.carColor
        this.ctx.fill(carShape)

        // this.ctx.arc(
        //     this.getX(this.degrees + 100 - this.angel / 2),
        //     this.getY(this.degrees + 90 - this.angel / 2),
        //     2, 0, 2 * Math.PI
        // )

        this.ctx.stroke()
    }
    remove() {
        let removeRange = 3
        let tempColor = this.carColor
        this.carColor = 'white'
        this.height += removeRange
        this.width += removeRange
        this.create()
        this.carColor = tempColor
        this.height -= removeRange
        this.width -= removeRange
    }
    isObstacleInfront() {
        let leftRGB = this.ctx.getImageData(
            this.getX(this.degrees + 100 - this.angel / 2),
            this.getY(this.degrees + 90 - this.angel / 2),
            1, 1).data
        let rightRGB = this.ctx.getImageData(
            this.getX(this.degrees + 80 + this.angel / 2),
            this.getY(this.degrees + 90 + this.angel / 2),
            1, 1).data
        if (rightRGB[0] == this.obstacleColor[0] &&
            rightRGB[1] == this.obstacleColor[1] &&
            rightRGB[2] == this.obstacleColor[2]) {
            return true
        }
        else if (leftRGB[0] == this.obstacleColor[0] &&
            leftRGB[1] == this.obstacleColor[1] &&
            leftRGB[2] == this.obstacleColor[2]) {
            return true
        } else {
            return false
        }
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
        if (this.isObstacleInfront()) {
            window.alert("Obstacle hit!")
        }
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
        let square = new Path2D()
        square.rect(300, 200, 100, 100)
        this.ctx.fillStyle = `rgb(${this.obstacleColor[0]} ${this.obstacleColor[1]} ${this.obstacleColor[2]})`
        this.ctx.fill(square)
        this.ctx.stroke()
    }
}
