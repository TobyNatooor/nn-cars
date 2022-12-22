import Car from './car.js'
import CarBrain from './carBrain.js'

export default class CarPopulation {
    constructor({ cvs, obstacles, carPopulation, carSpeed, framesPerDecision, mutationRate, mutationAmount, hiddenNeurons }) {
        this.cvs = cvs
        this.ctx = cvs.ctx
        this.carSpeed = carSpeed
        this.obstacles = obstacles
        this.mutationRate = mutationRate
        this.mutationAmount = mutationAmount
        this.hiddenNeurons = hiddenNeurons
        this.carPopulation = carPopulation
        this.framesPerDecision = framesPerDecision

        this.cars = []
        this.deadCars = 0
        this.generation = 0
        this.bestCar = { weights: [], score: 0 }

        this.createCarPopulation()
    }

    disposeCarBrains() {
        for (let i = 0; i < this.cars.length; i++) {
            this.cars[i].brain.dispose()
        }
    }

    draw() {
        for (let i = 0; i < this.cars.length; i++) {
            if (!this.cars[i].isDead) {
                this.cars[i].draw()
            }
        }
    }

    drawDistances() {
        for (let i = 0; i < this.cars.length; i++) {
            if (!this.cars[i].isDead) {
                this.cars[i].drawDistances()
            }
        }
    }

    createCarPopulation(bestCarWeights = false) {
        this.cars = []
        let coord = {
            x: this.cvs.canvas.width * 0.25,
            y: this.cvs.canvas.height * 0.2
        }
        let height = (this.cvs.canvas.width * 0.01).toFixed()
        let width = (this.cvs.canvas.width * 0.02).toFixed()

        for (let i = 0; i < this.carPopulation; i++) {
            let isFirstCar = (i == 0)

            let car = new Car({
                cvs: this.cvs,
                obstacles: this.obstacles,
                brain: new CarBrain(5, this.hiddenNeurons, 2, this.mutationRate, bestCarWeights, isFirstCar, this.mutationAmount),
                speed: this.carSpeed,
                x: coord.x,
                y: coord.y,
                height: height,
                width: width,
                mutationRate: this.mutationRate,
                framesPerDecision: this.framesPerDecision,
            })
            this.cars.push(car)
        }

        this.cars[0].color = "rgb(0, 0, 0)"
        this.generation++
    }

    getBestCar() {
        let bestCarI = 0
        let newBestCarFound = false
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
        console.log("New highscore: ", this.cars[bestCarI].score);
        let weights, weightCopies = []

        weights = this.cars[bestCarI].brain.model.getWeights()

        if (this.bestCar.weights) {
            for (let i = 0; i < this.bestCar.weights.length; i++) {
                this.bestCar.weights[i].dispose()
            }
        }
        for (let i = 0; i < weights.length; i++) {
            weightCopies[i] = weights[i].clone()
        }
        return { weights: weightCopies, score: this.cars[bestCarI].score }
    }

    newGeneration() {
        this.bestCar = this.getBestCar()
        this.disposeCarBrains()
        this.createCarPopulation(this.bestCar.weights)

        console.log('numTensors: ', tf.memory().numTensors)
    }

    drive() {
        this.deadCars = 0
        for (let i = 0; i < this.cars.length; i++) {
            if (this.cars[i].isDead) {
                this.deadCars++
            } else {
                this.cars[i].useBrain()
                this.cars[i].drive()
            }
        }
        if (this.deadCars == this.carPopulation) {
            this.newGeneration()
        }
    }
}
