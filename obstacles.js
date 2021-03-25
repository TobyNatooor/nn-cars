
export default class Obstacles {
    constructor({ canvasID }) {
        this.canvas = document.getElementById(canvasID)
        this.ctx = this.canvas.getContext('2d')
        this.test = 0
        this.coords = []
    }
    getCoords(e) {
        if (this.test > 2) {
            this.canvas.removeEventListener('click', (e) => this.getCoords(e))
        }
        const rect = this.canvas.getBoundingClientRect()
        let x = (e.clientX - rect.left).toFixed()
        let y = (e.clientY - rect.top).toFixed()
        console.log(x, y, this.test)
        this.test++
    }
    click() {
        this.canvas.addEventListener('click', (e) => this.getCoords(e))
    }
    square(x, y, color) {
        this.coords.push(x, y)
        this.ctx.beginPath()
        this.ctx.rect(x, y, 50, 50)
        this.ctx.fillStyle = color
        this.ctx.fill()
        this.ctx.stroke()
    }
}
