
export default class Car {
    constructor({ canvasID, obstacles, color, height, width, x, y }) {
        this.height = height ? height : 25
        this.width = width ? width : 40
        this.obstacles = obstacles
        this.carColor = color
        this.canvas = document.getElementById(canvasID)
        this.ctx = this.canvas.getContext('2d')
        this.coord = {
            x: x ? x : this.canvas.width / 2,
            y: y ? y : 230
        }
        this.speed = 0
        this.degrees = 0
        this.turnSpeed = 0
        this.isDriving = false
        this.radius = Math.sqrt((this.height / 2) ** 2 + (this.width / 2) ** 2)
        this.angel = (Math.acos((this.width / 2) / this.radius) * 2) / (Math.PI / 180)
        this.obstacleColor = [190, 110, 110]
    }

    getX = (radius, degrees) => this.coord.x + (radius * Math.sin((Math.PI * 2) / 360 * degrees))
    getY = (radius, degrees) => this.coord.y - (radius * Math.cos((Math.PI * 2) / 360 * degrees))

    create() {
        this.degrees += this.turnSpeed
        this.radius = Math.sqrt((this.height / 2) ** 2 + (this.width / 2) ** 2)
        this.angel = (Math.acos((this.width / 2) / this.radius) * 2) / (Math.PI / 180)

        this.ctx.beginPath()
        this.ctx.moveTo(this.getX(this.radius, this.degrees - 90 - this.angel / 2), this.getY(this.radius, this.degrees - 90 - this.angel / 2)) // back right
        this.ctx.lineTo(this.getX(this.radius, this.degrees - 90 + this.angel / 2), this.getY(this.radius, this.degrees - 90 + this.angel / 2)) // back left
        this.ctx.lineTo(this.getX(this.radius, this.degrees + 90 - this.angel / 2), this.getY(this.radius, this.degrees + 90 - this.angel / 2)) // front left
        this.ctx.lineTo(this.getX(this.radius, this.degrees + 90 + this.angel / 2), this.getY(this.radius, this.degrees + 90 + this.angel / 2)) // front right

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

    isObstacle(x, y) {
        let hit = false
        this.obstacles.forEach(obstacle => {
            if (obstacle.x < x && x < obstacle.x + obstacle.width &&
                obstacle.y < y && y < obstacle.y + obstacle.height) {
                hit = true
            }
        })
        return hit
    }

    hasHitObstacle() {
        let frontLeft = {
            x: this.getX(this.radius, this.degrees + 100 - this.angel / 2),
            y: this.getY(this.radius, this.degrees + 90 - this.angel / 2)
        }
        let frontRight = {
            x: this.getX(this.radius, this.degrees + 80 + this.angel / 2),
            y: this.getY(this.radius, this.degrees + 90 + this.angel / 2)
        }

        if (this.isObstacle(frontLeft.x, frontLeft.y) ||
            this.isObstacle(frontRight.x, frontRight.y)) {
            return true
        } else {
            return false
        }
    }

    drive() {
        if (this.hasHitObstacle()) {
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

    distanceToObstacle() {
        this.distances = [
            { degrees: 0, distance: 0 }, // left
            { degrees: 90, distance: 0 }, // forward
            { degrees: 180, distance: 0 }, // right
        ]
        this.distances.forEach(direction => {
            let increment = 10
            let distanceNotFound = true
            while (distanceNotFound) {
                direction.distance += increment
                if (this.isObstacle(
                    this.getX(direction.distance, this.degrees + direction.degrees),
                    this.getY(direction.distance, this.degrees + direction.degrees))) {
                    if (increment > 1) {
                        direction.distance -= increment
                        increment = 1
                    } else {
                        distanceNotFound = false
                    }
                }
            }
            this.ctx.beginPath()
            this.ctx.moveTo(this.coord.x, this.coord.y)
            this.ctx.lineTo(
                this.getX(direction.distance, this.degrees + direction.degrees),
                this.getY(direction.distance, this.degrees + direction.degrees)
            )
            this.ctx.stroke()
        })

    }

    test() {
        console.table([
            [this.distances[0].distance, this.distances[1].distance, this.distances[2].distance],
            ["left", "forward", "right"]
        ])
    }
}
