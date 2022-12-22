
export default class Car {
    constructor({ cvs, obstacles, color, speed, height, width, x, y, brain, framesPerDecision }) {
        this.canvas = cvs.canvas
        this.ctx = cvs.ctx
        this.color = color ? color : `rgb(${(Math.random() * 255).toFixed()}, 
                                          ${(Math.random() * 255).toFixed()}, 
                                          ${(Math.random() * 255).toFixed()})`
        this.height = height
        this.width = width
        this.brain = brain
        this.coord = {
            x: x,
            y: y,
        }
        this.speed = speed
        this.obstacles = obstacles
        this.framesPerDecision = framesPerDecision
        this.isDead = false
        this.degrees = 0
        this.turnRate = 2
        this.turnSpeed = 0
        this.score = 0
        this.radius = Math.sqrt((this.height / 2) ** 2 + (this.width / 2) ** 2)
        this.angle = Math.acos((this.width / 2) / this.radius) / (Math.PI / 180)
        // left, left-forward, forward, right-forward, right
        this.inputAngles = [0, 45, 90, 135, 180]
        this.inputDistances = []
        for (let i = 0; i < this.inputAngles.length; i++)
            this.inputDistances.push(0)
    }

    getCoords(radius, degrees) {
        let radians = degrees * Math.PI / 180
        return {
            x: this.coord.x + radius * Math.sin(radians),
            y: this.coord.y - radius * Math.cos(radians),
        }
    }

    draw() {
        this.degrees += this.turnSpeed

        this.ctx.beginPath()
        let coordsBackRight = this.getCoords(this.radius, this.degrees - 90 - this.angle)
        let coordsBackLeft = this.getCoords(this.radius, this.degrees - 90 + this.angle)
        let coordsFrontLeft = this.getCoords(this.radius, this.degrees + 90 - this.angle)
        let coordsFrontRight = this.getCoords(this.radius, this.degrees + 90 + this.angle)
        this.ctx.moveTo(coordsBackRight.x, coordsBackRight.y)     // back right
        this.ctx.lineTo(coordsBackLeft.x, coordsBackLeft.y)       // back left
        this.ctx.lineTo(coordsFrontLeft.x, coordsFrontLeft.y)     // front left
        this.ctx.lineTo(coordsFrontRight.x, coordsFrontRight.y)   // front right

        this.ctx.fillStyle = this.color
        this.ctx.fill()
    }

    coordHitObstacle(coord) {
        for (let i = 0; i < this.obstacles.squares.length; i++) {
            if (this.obstacles.squares[i].x < coord.x && coord.x < this.obstacles.squares[i].x + this.obstacles.squares[i].width &&
                this.obstacles.squares[i].y < coord.y && coord.y < this.obstacles.squares[i].y + this.obstacles.squares[i].height) {
                return true
            }
        }
        return false
    }

    hasHitObstacle() {
        if (this.coordHitObstacle(this.getCoords(this.radius, this.degrees + 90 - this.angle)) ||   // front left car coord 
            this.coordHitObstacle(this.getCoords(this.radius, this.degrees + 90 + this.angle))      // front right car coord
        ) {
            return true
        }
        return false
    }

    drive() {
        if (this.isDead) {
            return
        } else if (this.hasHitObstacle()) {
            this.isDead = true
        } else {
            let radians = this.degrees * Math.PI / 180
            this.coord.x += Math.cos(radians) * this.speed
            this.coord.y += Math.sin(radians) * this.speed
            this.updateDistanceToObstacle()
        }
    }

    drawDistances() {
        for (let i = 0; i < this.inputDistances.length; i++) {
            let lineEndCoords = this.getCoords(this.inputDistances[i], this.degrees + this.inputAngles[i])
            this.ctx.beginPath()
            this.ctx.moveTo(this.coord.x, this.coord.y)
            this.ctx.lineTo(lineEndCoords.x, lineEndCoords.y)
            this.ctx.stroke()
        }
    }

    updateDistanceToObstacle() {
        for (let i = 0; i < this.inputDistances.length; i++) {
            this.inputDistances[i] = 0
            let distanceFound = false
            while (!distanceFound) {
                this.inputDistances[i] += 10
                if (this.coordHitObstacle(this.getCoords(this.inputDistances[i], this.degrees + this.inputAngles[i]))) {
                    while (this.coordHitObstacle(this.getCoords(this.inputDistances[i], this.degrees + this.inputAngles[i]))) {
                        this.inputDistances[i] -= 1
                    }
                    distanceFound = true
                }
            }
        }
    }

    useBrain() {
        this.score++
        if (this.score % this.framesPerDecision != 0) {
            return
        }

        const prediction = this.brain.predict(this.inputDistances)
        if (prediction[0] < 0.5) {
            this.turnSpeed = -this.turnRate
        } else {
            this.turnSpeed = this.turnRate
        }
    }
}
