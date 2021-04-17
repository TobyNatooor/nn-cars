
import Car from './car.js'
import CarBrain from './carBrain.js'

export default class CarPopulation {
    constructor({ cvs, obstaclesData, carPopulation = 30 }) {
        this.cvs = cvs
        this.canvas = cvs.canvas
        this.ctx = this.canvas.getContext('2d')
        this.cars = []
        this.obstaclesData = obstaclesData
        this.carPopulation = carPopulation
        this.deadCars = 0
        this.bestCar = { score: 0 }
        this.index = 0

        this.createCarPopulation()
    }

    createCarPopulation(bestCarWeights) {
        this.cars = []
        for (let i = 0; i < this.carPopulation; i++) {
            let car = new Car({
                cvs: this.cvs,
                obstacles: this.obstaclesData,
                brain: new CarBrain(5, 8, 2, bestCarWeights),
                x: this.canvas.width / 4,
                y: this.canvas.height / 4.7,
                height: this.canvas.width / 105,
                width: this.canvas.width / 65,
                index: i,
            })
            this.cars.push(car)
        }
    }

    getBestCar() {
        let bestScore = 0
        for (const car of this.cars) {
            if (car.brainInterval > bestScore) {
                bestScore = car.brainInterval
                this.index = car.index
            }
        }
        let weights
        if (bestScore > this.bestCar.score) {
            weights = this.cars[this.index].brain.model.getWeights()

            let weightCopies = []
            for (const i in weights) {
                weightCopies[i] = weights[i].clone()
            }
            for (const i in this.bestCar.weights) {
                this.bestCar.weights[i].dispose()
            }

            this.bestCar = { weights: weightCopies, score: bestScore }
        }
    }

    disposeCarBrains() {
        for (let car of this.cars) {
            car.brain.dispose()
        }
    }

    drive() {
        this.deadCars = 0
        for (let car of this.cars) {
            car.drive()
            car.useBrain()
            if (car.isDead) this.deadCars++
            if (this.deadCars == this.carPopulation) {
                console.log(tf.memory().numTensors)
                this.getBestCar()
                this.disposeCarBrains()
                this.createCarPopulation(this.bestCar.weights)
            }
        }
    }

}
