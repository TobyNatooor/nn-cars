import { getCoordsFromPoint } from "./build/untouched.js";

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
        this.x = x
        this.y = y
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

    draw() {
        this.degrees += this.turnSpeed

        this.ctx.beginPath()
        this.ctx.moveTo(...getCoordsFromPoint(this.radius, this.degrees - 90 - this.angle, this.x, this.y)) // back right
        this.ctx.lineTo(...getCoordsFromPoint(this.radius, this.degrees - 90 + this.angle, this.x, this.y)) // back left
        this.ctx.lineTo(...getCoordsFromPoint(this.radius, this.degrees + 90 - this.angle, this.x, this.y)) // front left
        this.ctx.lineTo(...getCoordsFromPoint(this.radius, this.degrees + 90 + this.angle, this.x, this.y)) // front right

        this.ctx.fillStyle = this.color
        this.ctx.fill()
    }

    coordHitObstacle(coords) {
        for (let i = 0; i < this.obstacles.squares.length; i++) {
            if (this.obstacles.squares[i].x < coords[0] && coords[0] < this.obstacles.squares[i].x + this.obstacles.squares[i].width &&
                this.obstacles.squares[i].y < coords[1] && coords[1] < this.obstacles.squares[i].y + this.obstacles.squares[i].height) {
                return true
            }
        }
        return false
    }

    hasHitObstacle() {
        if (this.coordHitObstacle(getCoordsFromPoint(this.radius, this.degrees + 90 - this.angle, this.x, this.y)) ||   // front left car coord 
            this.coordHitObstacle(getCoordsFromPoint(this.radius, this.degrees + 90 + this.angle, this.x, this.y))      // front right car coord
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
            this.x += Math.cos(radians) * this.speed
            this.y += Math.sin(radians) * this.speed
            this.updateDistanceToObstacle()
        }
    }

    drawDistances() {
        for (let i = 0; i < this.inputDistances.length; i++) {
            let lineEndCoords = getCoordsFromPoint(this.inputDistances[i], this.degrees + this.inputAngles[i], this.x, this.y)
            this.ctx.beginPath()
            this.ctx.moveTo(this.coords[0], this.coords[1])
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
                if (this.coordHitObstacle(getCoordsFromPoint(this.inputDistances[i], this.degrees + this.inputAngles[i], this.x, this.y))) {
                    while (this.coordHitObstacle(getCoordsFromPoint(this.inputDistances[i], this.degrees + this.inputAngles[i], this.x, this.y))) {
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
