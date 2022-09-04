
export default class Car {
    constructor({ cvs, obstacles, color, speed, height = 25, width = 40, x = 100, y = 100, brain, index, decisionPerInterval }) {
        this.canvas = cvs.canvas
        this.ctx = cvs.ctx
        this.color = color ? color : `rgb(${(Math.random() * 255).toFixed()}, ${(Math.random() * 255).toFixed()}, ${(Math.random() * 255).toFixed()})`
        this.obstacles = obstacles
        this.height = height
        this.width = width
        this.brain = brain
        this.index = index
        this.interval = 0
        this.decisionPerInterval = decisionPerInterval
        this.coord = {
            x: x,
            y: y,
            startX: x,
            startY: y
        }
        this.speed = speed
        this.degrees = 0
        this.turnSpeed = 0
        this.isDead = false
        this.radius = Math.sqrt((this.height / 2) ** 2 + (this.width / 2) ** 2)
        this.angel = (Math.acos((this.width / 2) / this.radius) * 2) / (Math.PI / 180)
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

        this.ctx.fillStyle = this.color
        this.ctx.fill()
    }

    driveSwitch() {
        this.speed ? this.speed = 0 : this.speed = 5
    }
    turnForward() {
        this.turnSpeed = 0
    }
    turnLeft() {
        this.turnSpeed = -2
    }
    turnRight() {
        this.turnSpeed = 2
    }

    isObstacle(x, y) {
        let hit = false
        this.obstacles.squares.forEach(obstacle => {
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

    drive(isDrawingDistance) {
        if (!this.isDead) {
            if (this.hasHitObstacle()) {
                this.isDead = true
            } else {
                let xAmount = (Math.cos(2 * Math.PI * (this.degrees / 360))) * this.speed
                let yAmount = (Math.sin(2 * Math.PI * (this.degrees / 360))) * this.speed
                this.coord.x += xAmount
                this.coord.y += yAmount
                this.create()
                this.distanceToObstacle(isDrawingDistance)
            }
        }
    }

    drawDistance(direction) {
        this.ctx.beginPath()
        this.ctx.moveTo(this.coord.x, this.coord.y)
        this.ctx.lineTo(
            this.getX(direction.distance, this.degrees + direction.degrees),
            this.getY(direction.distance, this.degrees + direction.degrees)
        )
        this.ctx.stroke()
    }

    distanceToObstacle(isDrawingDistance) {
        this.distances = [
            { degrees: 0, distance: 0 }, // left
            { degrees: 45, distance: 0 }, // left / forward
            { degrees: 90, distance: 0 }, // forward
            { degrees: 135, distance: 0 }, // right / forward
            { degrees: 180, distance: 0 }, // right
        ]
        this.distances.forEach(direction => {
            let increment = 20
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
            if(isDrawingDistance) this.drawDistance(direction)
        })
    }

    useBrain() {
        this.interval++
        if (this.interval % this.decisionPerInterval == 0) {
            let data = []
            for (let distance of this.distances) {
                data.push(distance.distance / this.canvas.width)
            }
            const prediction = this.brain.predict(data)

            if (prediction[0] > 0.5) {
                this.turnLeft()
            } else {
                this.turnRight()
            }
        }
    }
}
