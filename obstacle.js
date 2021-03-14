
export default class Obstacle {
    constructor(canvasID, color, x, y) {
        this.canvas = document.getElementById(canvasID)
        this.ctx = this.canvas.getContext('2d')
        
    }
}
