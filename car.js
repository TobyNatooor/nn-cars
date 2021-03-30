
export default class Car {
    constructor({ canvasID, obstacles, color, height, width, x, y }) {
        this.height = height ? height : 25
        this.width = width ? width : 40
        this.obstacles = obstacles
        this.carColor = color
        this.canvas = document.getElementById(canvasID)
        this.ctx = this.canvas.getContext('2d')
        this.coord = {
            x: x ? x : 250,
            y: y ? y : 250
        }
        this.speed = 0
        this.degrees = 0
        this.turnSpeed = 0
        this.isDriving = false
        this.radius = Math.sqrt((this.height / 2) ** 2 + (this.width / 2) ** 2)
        this.angel = (Math.acos((this.width / 2) / this.radius) * 2) / (Math.PI / 180)
        this.obstacleColor = [190, 110, 110]
    }

    getX = (degrees) => this.coord.x + (this.radius * Math.sin((Math.PI * 2) / 360 * degrees))
    getY = (degrees) => this.coord.y - (this.radius * Math.cos((Math.PI * 2) / 360 * degrees))

    create() {
        this.degrees += this.turnSpeed
        this.radius = Math.sqrt((this.height / 2) ** 2 + (this.width / 2) ** 2)
        this.angel = (Math.acos((this.width / 2) / this.radius) * 2) / (Math.PI / 180)

        this.ctx.beginPath()
        this.ctx.moveTo(this.getX(this.degrees - 90 - this.angel / 2), this.getY(this.degrees - 90 - this.angel / 2))
        this.ctx.lineTo(this.getX(this.degrees - 90 + this.angel / 2), this.getY(this.degrees - 90 + this.angel / 2))
        this.ctx.lineTo(this.getX(this.degrees + 90 - this.angel / 2), this.getY(this.degrees + 90 - this.angel / 2))
        this.ctx.lineTo(this.getX(this.degrees + 90 + this.angel / 2), this.getY(this.degrees + 90 + this.angel / 2))

        this.ctx.fillStyle = this.carColor
        this.ctx.fill()

        /*  */
        // // left
        // this.ctx.arc(
        //     this.getX(this.degrees + 100 - this.angel / 2),
        //     this.getY(this.degrees + 90 - this.angel / 2),
        //     2, 0, 2 * Math.PI
        // )
        // // right
        // this.ctx.arc(
        //     this.getX(this.degrees + 80 + this.angel / 2),
        //     this.getY(this.degrees + 90 + this.angel / 2),
        //     2, 0, 2 * Math.PI
        // )
        /*  */
    }

    isObstacleInfront() {
        let frontLeft = {
            x: this.getX(this.degrees + 100 - this.angel / 2),
            y: this.getY(this.degrees + 90 - this.angel / 2)
        }
        let frontRight = {
            x: this.getX(this.degrees + 80 + this.angel / 2),
            y: this.getY(this.degrees + 90 + this.angel / 2)
        }

        let hit = false
        this.obstacles.forEach(obstacle => {
            if (
                obstacle.x < frontLeft.x && frontLeft.x < obstacle.x + obstacle.width
                && obstacle.y < frontLeft.y && frontLeft.y < obstacle.y + obstacle.height
                || obstacle.x < frontRight.x && frontRight.x < obstacle.x + obstacle.width
                && obstacle.y < frontRight.y && frontRight.y < obstacle.y + obstacle.height
            ) {
                hit = true
            }
        })
        return hit
    }

    drive() {
        if (this.isObstacleInfront()) {
            console.log("obstacle hit!")
            location.reload()
        } else {
            let xAmount = (Math.cos(2 * Math.PI * (this.degrees / 360))) * this.speed
            let yAmount = (Math.sin(2 * Math.PI * (this.degrees / 360))) * this.speed

            this.coord.x += xAmount
            this.coord.y += yAmount
            this.create()
        }
    }

    test() {

    }
}
