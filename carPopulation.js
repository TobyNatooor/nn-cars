import Car from './car.js'
import CarBrain from './carBrain.js'

export default class CarPopulation {
    constructor({ cvs, obstaclesData, carPopulation, carSpeed, decisionPerInterval }) {
        this.cvs = cvs
        this.canvas = cvs.canvas
        this.ctx = this.canvas.getContext('2d')
        this.cars = []
        this.obstaclesData = obstaclesData
        this.carPopulation = carPopulation
        this.deadCars = 0
        this.bestCar = { weights: [], score: 0 }
        this.carSpeed = carSpeed
        this.decisionPerInterval = decisionPerInterval

        this.createCarPopulation()
    }

    createCarPopulation(bestCarWeights = false) {
        this.cars = []
        for (let i = 0; i < this.carPopulation; i++) {
            let isFirstCar = (i == 0)
            let car = new Car({
                cvs: this.cvs,
                obstacles: this.obstaclesData,
                brain: new CarBrain(5, 8, 2, bestCarWeights, isFirstCar),
                speed: this.carSpeed,
                x: this.canvas.width / 4,
                y: this.canvas.height / 4.7,
                height: this.canvas.width / 105,
                width: this.canvas.width / 65,
                index: i,
                decisionPerInterval: this.decisionPerInterval,
            })
            this.cars.push(car)
        }
        this.cars[0].color = "rgb(255, 0, 0)"
    }

    getBestCar() {
        let bestCarIndex = 0
        let newBestCarFound = false
        let carIndexScore = []
        for (let i = 0; i < this.cars.length; i++) {
            carIndexScore.push({ index: this.cars[i].index, score: this.cars[i].score })
            if (this.bestCar.score < this.cars[i].score) {
                this.bestCar.score = this.cars[i].score
                bestCarIndex = this.cars[i].index
                newBestCarFound = true
            }
        }
        console.log("New highscore: ", this.cars[bestCarIndex].score);
        if (!newBestCarFound) {
            return this.bestCar
        } else {
            let weights, weightCopies = []
            weights = this.cars[bestCarIndex].brain.model.getWeights()

            if (this.bestCar.weights) {
                for (let i = 0; i < this.bestCar.weights.length; i++) {
                    this.bestCar.weights[i].dispose()
                }
            }
            for (let i = 0; i < weights.length; i++) {
                weightCopies[i] = weights[i].clone()
            }
            return { weights: weightCopies, score: this.cars[bestCarIndex].score }
        }
    }

    disposeCarBrains() {
        for (const car of this.cars) {
            car.brain.dispose()
        }
    }

    drive(isDrawingDistance) {
        this.deadCars = 0
        for (const car of this.cars) {
            if (car.isDead) {
                this.deadCars++
            } else {
                car.drive(isDrawingDistance)
                car.useBrain()
            }
            if (this.deadCars == this.carPopulation) {
                console.log('numTensors: ', tf.memory().numTensors)
                this.bestCar = this.getBestCar()
                this.disposeCarBrains()
                this.createCarPopulation(this.bestCar.weights)
            }
        }
    }

}
