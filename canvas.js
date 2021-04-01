
export default class Canvas {
    constructor({ canvasID }) {
        this.canvasID = canvasID
        this.canvas = document.getElementById(this.canvasID)
        this.ctx = this.canvas.getContext('2d')
        this.canvas.width = window.innerWidth * 0.9
        this.canvas.height = window.innerHeight * 0.9
    }

    getMouseCoordsEL() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect()
            this.mouseCoords = {
                x: (e.clientX - rect.left).toFixed(),
                y: (e.clientY - rect.top).toFixed()
            }
        })
    }
    
    showMouseCoords(color) {
        if (this.mouseCoords) {
            this.ctx.fillStyle = color;
            this.ctx.font = "30px Arial";
            this.ctx.fillText(`X: ${this.mouseCoords.x} Y: ${this.mouseCoords.y}`, 0, this.canvas.height - 5)
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}
