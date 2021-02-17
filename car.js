
export default class Car {
    constructor(canvasID, carColor) {
        this.ctx = document.getElementById(canvasID).getContext('2d')
        this.coord = { x: 250, y: 250 }
        this.carColor = carColor
        this.height = 80
        this.width = 150
        this.numOne = 10
        this.numTwo = 20
        this.isDriving = false
        this.radius = Math.sqrt((this.height / 2) ** 2 + (this.width / 2) ** 2)
    }
    halfWidth(point) {
        switch (point) {
            case 1:
                return Math.sqrt((this.radius ** 2 - (((this.height / 2) - this.numTwo)) ** 2))
                break
            case 2:
                return Math.sqrt((this.radius ** 2 - (((this.height / 2) + this.numTwo)) ** 2))
                break
            case 3:
                return Math.sqrt((this.radius ** 2 - (((this.height / 2) - this.numTwo)) ** 2))
                break
            case 4:
                return Math.sqrt((this.radius ** 2 - (((this.height / 2) + this.numTwo)) ** 2))
                break
        }
    }
    halfHeight(point) {
        switch (point) {
            case 1:
                return Math.sqrt((this.radius ** 2 - (((this.width / 2) + this.numOne)) ** 2))
                break
            case 2:
                return Math.sqrt((this.radius ** 2 - (((this.width / 2) - this.numOne)) ** 2))
                break
            case 3:
                return Math.sqrt((this.radius ** 2 - (((this.width / 2) + this.numOne)) ** 2))
                break
            case 4:
                return Math.sqrt((this.radius ** 2 - (((this.width / 2) - this.numOne)) ** 2))
                break
        }
    }
    create() {
        let carShape = new Path2D()
        carShape.moveTo(this.coord.x + this.halfWidth(1), this.coord.y - this.halfHeight(1))
        carShape.lineTo(this.coord.x - this.halfWidth(2), this.coord.y - this.halfHeight(2))
        carShape.lineTo(this.coord.x - this.halfWidth(3), this.coord.y + this.halfHeight(3))
        carShape.lineTo(this.coord.x + this.halfWidth(4), this.coord.y + this.halfHeight(4))

        //translate functions are neccesary for rotation as the rotate function rotates around the top left corner
        this.ctx.translate(this.coord.x, this.coord.y)
        this.ctx.rotate(Math.PI * 2 / 360 * this.numOne)
        this.ctx.translate(-this.coord.x, -this.coord.y)

        this.ctx.arc(this.coord.x, this.coord.y, this.radius, 0, 2 * Math.PI)
        this.ctx.arc(this.coord.x, this.coord.y, (this.height / 2), 0, 2 * Math.PI)

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
        this.numOne = amount
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
        // setInterval(() => {
        //     console.log(`X:${this.coord.x} Y: ${this.coord.y}`)
        // }, 1000)

        //this.ctx.beginPath()
        this.ctx.rect(20, 20, 100, 100)
        this.ctx.stroke()
        console.log("test")
    }
}
