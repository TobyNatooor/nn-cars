
export default class Obstacles {
    constructor({ canvasID }) {
        this.canvas = document.getElementById(canvasID)
        this.ctx = this.canvas.getContext('2d')
        this.test = 0
        this.data = []

        this.createSquareArena()
    }

    addSquare(x, y, width, height, color) {
        this.data.push({ x: x, y: y, width: width, height: height, color: color })
    }

    draw() {
        this.data.forEach(obstacle => {
            this.ctx.beginPath()
            this.ctx.rect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
            this.ctx.closePath()
            this.ctx.fillStyle = obstacle.color
            this.ctx.fill()
        })
    }

    createSquareArena() {
        this.addSquare(0, 0, this.canvas.width, 100, 'blue')
        this.addSquare(0, this.canvas.height - 100, this.canvas.width, 100, 'blue')
        this.addSquare(0, 0, 100, this.canvas.height, 'blue')
        this.addSquare(this.canvas.width - 100, 0, 100, this.canvas.height, 'blue')
        this.addSquare(this.canvas.width / 6, this.canvas.height / 3, this.canvas.width / 1.5, this.canvas.height / 3, 'blue')
    }
}
