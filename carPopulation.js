import Car from './car.js'
import NeuralNetwork from './neuralNetwork.js'

export default class CarPopulation {
    constructor({ cvs, obstacles, carPopulation, carSpeed, mutationRate, mutationAmount, hiddenNeurons, inputAmount }) {
        this.cvs = cvs
        this.ctx = cvs.ctx
        this.carSpeed = carSpeed
        this.obstacles = obstacles
        this.mutationRate = mutationRate
        this.mutationAmount = mutationAmount
        this.hiddenNeurons = hiddenNeurons
        this.population = carPopulation

        this.bestCar
        this.cars = []
        this.generation = 0

        this.inputAngles = []
        for (let i = 0; i <= 180; i += 180/(inputAmount-1))
            this.inputAngles.push(i)
        
        this.createCarPopulation()
    }

    livingCars(callback) {
        for (let i = this.cars.length - 1; 0 <= i; i--) {
            if (!this.cars[i].isDead) {
                callback(this.cars[i])
            }
        }
    }

    createCarPopulation() {
        this.generation++

        this.cars = []
        const coord = {
            x: this.cvs.canvas.width * 0.25,
            y: this.cvs.canvas.height * 0.2
        }
        const height = (this.cvs.canvas.width * 0.01).toFixed()
        const width = (this.cvs.canvas.width * 0.02).toFixed()
        const shape = [this.inputAngles.length, this.hiddenNeurons, 2]
        
        for (let i = 0; i < this.population; i++) {
            let brain
            if (this.generation == 1) {
                brain = new NeuralNetwork(shape)
            } else if (i == 0 && this.generation != 1) {
                brain = this.bestCar.brain
            } else {
                brain = new NeuralNetwork(shape, this.bestCar.brain.weights, this.bestCar.brain.biases)
            }
            this.cars.push(new Car({
                cvs: this.cvs,
                obstacles: this.obstacles,
                brain: brain,
                speed: this.carSpeed,
                x: coord.x,
                y: coord.y,
                height: height,
                width: width,
                mutationRate: this.mutationRate,
                inputAngles: this.inputAngles
            }))
            if (i != 0) {
                this.cars[i].brain.mutate(this.mutationRate, this.mutationAmount)
            } else {
                this.cars[i].color = "rgb(0, 0, 0)"
            }
        }
    }

    getBestCar() {
        let bestCarI = 0
        let newBestCarFound = false
        if (!this.bestCar) {
            this.bestCar = this.cars[0]
        }
        for (let i = 0; i < this.cars.length; i++) {
            if (this.bestCar.score < this.cars[i].score) {
                this.bestCar.score = this.cars[i].score
                bestCarI = i
                newBestCarFound = true
            }
        }
        if (!newBestCarFound) {
            return this.bestCar
        }
        return this.cars[bestCarI]
    }

    newGeneration() {
        this.bestCar = this.getBestCar()
        this.createCarPopulation()
    }

    isDead() {
        for (let i = 0; i < this.cars.length; i++) {
            if (!this.cars[i].isDead) {
                return false
            }
        }
        return true
    }
}
