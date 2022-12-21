
export default class Car {
    constructor({ cvs, obstacles, color, speed, height = 25, width = 40, x = 100, y = 100, brain, index, framesPerDecision }) {
        this.canvas = cvs.canvas
        this.ctx = cvs.ctx
        this.color = color ? color : `rgb(${(Math.random() * 255).toFixed()}, 
                                          ${(Math.random() * 255).toFixed()}, 
                                          ${(Math.random() * 255).toFixed()})`
        this.framesPerDecision = framesPerDecision
        this.obstacles = obstacles
        this.height = height
        this.width = width
        this.brain = brain
        this.index = index
        this.speed = speed
        this.coord = {
            x: x,
            y: y,
        }
        this.isDead = false
        this.degrees = 0
        this.turnSpeed = 0
        this.score = 0
        this.radius = Math.sqrt((this.height / 2) ** 2 + (this.width / 2) ** 2)
        this.angle = Math.acos((this.width / 2) / this.radius) / (Math.PI / 180)
        this.distances = [
            { degrees: 0, distance: 0 },    // left
            { degrees: 45, distance: 0 },   // left / forward
            { degrees: 90, distance: 0 },   // forward
            { degrees: 135, distance: 0 },  // right / forward
            { degrees: 180, distance: 0 },  // right
        ]
    }

    getX = (radius, degrees) => this.coord.x + (radius * Math.sin((Math.PI * 2) / 360 * degrees))
    getY = (radius, degrees) => this.coord.y - (radius * Math.cos((Math.PI * 2) / 360 * degrees))

    draw() {
        this.degrees += this.turnSpeed

        this.ctx.beginPath()
        let degreesBackRight = this.degrees - 90 - this.angle
        let degreesBackLeft = this.degrees - 90 + this.angle
        let degreesFrontLeft = this.degrees + 90 - this.angle
        let degreesFrontRight = this.degrees + 90 + this.angle
        this.ctx.moveTo(this.getX(this.radius, degreesBackRight), this.getY(this.radius, degreesBackRight))     // back right
        this.ctx.lineTo(this.getX(this.radius, degreesBackLeft), this.getY(this.radius, degreesBackLeft))       // back left
        this.ctx.lineTo(this.getX(this.radius, degreesFrontLeft), this.getY(this.radius, degreesFrontLeft))     // front left
        this.ctx.lineTo(this.getX(this.radius, degreesFrontRight), this.getY(this.radius, degreesFrontRight))   // front right

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
        if (this.coordHitObstacle({ // front left coord
            x: this.getX(this.radius, this.degrees + 100 - this.angle),
            y: this.getY(this.radius, this.degrees + 90 - this.angle)
        }) ||
            this.coordHitObstacle({ // front right coord
                x: this.getX(this.radius, this.degrees + 80 + this.angle),
                y: this.getY(this.radius, this.degrees + 90 + this.angle)
            })) {
            return true
        }
        return false
    }

    drive() {
        if (this.isDead) {
            return
        }
        else if (this.hasHitObstacle()) {
            this.isDead = true
        } else {
            this.coord.x += (Math.cos(2 * Math.PI * (this.degrees / 360))) * this.speed
            this.coord.y += (Math.sin(2 * Math.PI * (this.degrees / 360))) * this.speed
            this.distanceToObstacle()
        }
    }

    drawDistances() {
        for (let i = 0; i < this.distances.length; i++) {
            this.ctx.beginPath()
            this.ctx.moveTo(this.coord.x, this.coord.y)
            this.ctx.lineTo(
                this.getX(this.distances[i].distance, this.degrees + this.distances[i].degrees),
                this.getY(this.distances[i].distance, this.degrees + this.distances[i].degrees))
            this.ctx.stroke()
        }
    }

    distanceToObstacle() {
        for (let i = 0; i < this.distances.length; i++) {
            this.distances[i].distance = 0
            let distanceFound = false
            while (!distanceFound) {
                this.distances[i].distance += 10
                if (this.coordHitObstacle({
                    x: this.getX(this.distances[i].distance, this.degrees + this.distances[i].degrees),
                    y: this.getY(this.distances[i].distance, this.degrees + this.distances[i].degrees)
                })) {
                    while (this.coordHitObstacle({
                        x: this.getX(this.distances[i].distance, this.degrees + this.distances[i].degrees),
                        y: this.getY(this.distances[i].distance, this.degrees + this.distances[i].degrees)
                    })) {
                        this.distances[i].distance -= 1
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

        let data = []
        for (let i = 0; i < this.distances.length; i++) {
            data.push(this.distances[i].distance)
        }
        const prediction = this.brain.predict(data)
        if (prediction[0] > 0.5) {
            this.turnSpeed = -2
        } else {
            this.turnSpeed = 2
        }
    }
}
