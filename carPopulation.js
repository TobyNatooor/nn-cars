import Car from './car.js'
import CarBrain from './carBrain.js'

export default class CarPopulation {
    constructor({ cvs, obstaclesData, carPopulation, carSpeed, framesPerDecision, mutationRate, populationNumberElement }) {
        this.cvs = cvs
        this.ctx = cvs.ctx
        this.carSpeed = carSpeed
        this.carPopulation = carPopulation
        this.obstaclesData = obstaclesData
        this.framesPerDecision = framesPerDecision
        this.mutationRate = mutationRate
        this.populationNumberElement = populationNumberElement

        this.cars = []
        this.populationNumber = 0
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
            this.cars[i].drawDistances()
        }
    }

    createCarPopulation(bestCarWeights = false) {
        this.cars = []
        for (let i = 0; i < this.carPopulation; i++) {
            let isFirstCar = (i == 0)

            let car = new Car({
                cvs: this.cvs,
                obstacles: this.obstaclesData,
                brain: new CarBrain(5, 1, 2, this.mutationRate, bestCarWeights, isFirstCar),
                speed: this.carSpeed,
                x: this.cvs.canvas.width * 0.25,
                y: this.cvs.canvas.height * 0.2,
                height: this.cvs.canvas.width * 0.008,
                width: this.cvs.canvas.width * 0.015,
                index: i,
                framesPerDecision: this.framesPerDecision,
                mutationRate: this.mutationRate,
            })
            this.cars.push(car)
        }

        this.cars[0].color = "rgb(255, 0, 0)"
        this.populationNumber++
        this.populationNumberElement.innerHTML = `Population number: ${this.populationNumber}`
    }

    getBestCar() {
        let bestCarI = 0
        let newBestCarFound = false
        for (let i = 0; i < this.cars.length; i++) {
            if (this.bestCar.score < this.cars[i].score) {
                this.bestCar.score = this.cars[i].score
                bestCarI = this.cars[i].index
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

    drive() {
        let deadCars = 0
        for (let i = 0; i < this.cars.length; i++) {
            if (this.cars[i].isDead) {
                deadCars++
            } else {
                this.cars[i].useBrain()
                this.cars[i].drive()
            }
        }
        if (deadCars == this.carPopulation) {
            this.bestCar = this.getBestCar()
            this.disposeCarBrains()
            this.createCarPopulation(this.bestCar.weights)

            console.log('numTensors: ', tf.memory().numTensors)
        }
    }
}
