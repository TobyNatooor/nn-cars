
export default class Canvas {
    constructor({ canvasID }) {
        this.canvasID = canvasID
        this.canvas = document.getElementById(this.canvasID)
        this.ctx = this.canvas.getContext('2d')
        this.canvas.width = 1000
        this.canvas.height = 1000
    }

    mouseCoords() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect()
            let x = (e.clientX - rect.left).toFixed()
            let y = (e.clientY - rect.top).toFixed()
            this.ctx.clearRect(0, this.canvas.height - 30, 230, 30)
            this.ctx.fillStyle = "black";
            this.ctx.font = "30px Arial";
            this.ctx.fillText(`X: ${x} Y: ${y}`, 0, this.canvas.height - 5)
        })
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}
