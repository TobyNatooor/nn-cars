
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
        const COLOR = 'rgb(45, 103, 173)'
        const BORDERWIDTH = this.canvas.width / 25

        this.addSquare(0, 0, this.canvas.width, BORDERWIDTH, COLOR)
        this.addSquare(0, 0, BORDERWIDTH, this.canvas.height, COLOR)
        this.addSquare(0, this.canvas.height - BORDERWIDTH, this.canvas.width, BORDERWIDTH, COLOR)
        this.addSquare(this.canvas.width - BORDERWIDTH, 0, BORDERWIDTH, this.canvas.height, COLOR)
        this.addSquare(this.canvas.width / 4, this.canvas.height / 3, this.canvas.width / 2, this.canvas.height / 3, COLOR)
    }
}
