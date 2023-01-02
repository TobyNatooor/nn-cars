
export default class Car {
    constructor({ cvs, obstacles, speed, height, width, x, y, brain, inputAngles }) {
        this.canvas = cvs.canvas
        this.ctx = cvs.ctx
        this.color = `rgb(${(Math.random() * 255).toFixed()}, 
                          ${(Math.random() * 255).toFixed()}, 
                          ${(Math.random() * 255).toFixed()})`
        this.height = height
        this.width = width
        this.brain = brain
        this.coord = { x: x, y: y, }
        this.speed = speed
        this.obstacles = obstacles
        this.isDead = false
        this.degrees = 0
        this.turnRate = 2
        this.turnSpeed = 0
        this.score = 0
        this.radius = Math.sqrt((this.height / 2) ** 2 + (this.width / 2) ** 2)
        this.angle = Math.acos((this.width / 2) / this.radius) / (Math.PI / 180)
        this.inputAngles = inputAngles
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

    coordHitObstacles(coord, obstacles) {
        for (let i = 0; i < obstacles.squares.length; i++) {
            if (obstacles.squares[i].x < coord.x && coord.x < obstacles.squares[i].x + obstacles.squares[i].width &&
                obstacles.squares[i].y < coord.y && coord.y < obstacles.squares[i].y + obstacles.squares[i].height) {
                return true
            }
        }
        return false
    }

    dieIfHitObstacle(obstacles) {
        if (this.coordHitObstacles(this.getCoords(this.radius, this.degrees + 90 - this.angle), obstacles) ||   // front left car coord 
            this.coordHitObstacles(this.getCoords(this.radius, this.degrees + 90 + this.angle), obstacles)      // front right car coord
        ) {
            this.isDead = true
        }
    }

    drive() {
        if (this.isDead) {
            return
        } else {
            let radians = this.degrees * Math.PI / 180
            this.coord.x += Math.cos(radians) * this.speed
            this.coord.y += Math.sin(radians) * this.speed
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

    updateDistanceToObstacles(obstacles) {
        for (let i = 0; i < this.inputDistances.length; i++) {
            this.inputDistances[i] = 0
            let distanceFound = false
            while (!distanceFound) {
                this.inputDistances[i] += 10
                if (this.coordHitObstacles(this.getCoords(this.inputDistances[i], this.degrees + this.inputAngles[i]), obstacles)) {
                    while (this.coordHitObstacles(this.getCoords(this.inputDistances[i], this.degrees + this.inputAngles[i]), obstacles)) {
                        this.inputDistances[i] -= 1
                    }
                    distanceFound = true
                }
            }
        }
    }

    useBrain() {
        this.score++
        const prediction = this.brain.getOutput(this.inputDistances)
        if (prediction[0] < 0.5) {
            this.turnSpeed = -this.turnRate
        } else {
            this.turnSpeed = this.turnRate
        }
    }
}
