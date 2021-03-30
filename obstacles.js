
export default class Obstacles {
    constructor({ canvasID }) {
        this.canvas = document.getElementById(canvasID)
        this.ctx = this.canvas.getContext('2d')
        this.test = 0
        this.data = []
    }
    square(x, y, width, height, color) {
        this.data.push({ x: x, y: y, width: width, height: height })

        this.ctx.beginPath()
        this.ctx.rect(x, y, width, height)
        this.ctx.closePath()

        this.ctx.fillStyle = color
        this.ctx.fill()

        // this.ctx.strokeStyle = color
        // this.ctx.stroke()
    }
}
