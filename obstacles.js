
export default class Obstacles {
    constructor({ cvs }) {
        this.canvas = cvs.canvas
        this.ctx = cvs.ctx
        this.data = { squares: [], pointblocks: [] }

        this.createSquareArena()
    }

    addSquare(x, y, width, height, color) {
        this.data.squares.push({ x: x, y: y, width: width, height: height, color: color })
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

    draw() {
        for (let i = 0; i < this.data.squares.length; i++) {
            this.ctx.beginPath()
            this.ctx.rect(
                this.data.squares[i].x,
                this.data.squares[i].y,
                this.data.squares[i].width,
                this.data.squares[i].height)
            this.ctx.closePath()
            this.ctx.fillStyle = this.data.squares[i].color
            this.ctx.fill()
        }
    }
}
