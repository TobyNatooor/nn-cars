
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
        this.bestCar = { score: 0 }
        this.bestCarScore = 0
        this.carSpeed = carSpeed
        this.decisionPerInterval = decisionPerInterval

        this.createCarPopulation()
    }

    createCarPopulation(bestCarWeights = false) {
        // console.log(bestCarWeights);
        // if (bestCarWeights) {
        //     for (const bestCarWeight of bestCarWeights) {
        //         console.log(bestCarWeight.dataSync());
        //     }
        // }
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
    }

    getBestCar() {
        let bestCarIndex, newBestCarFound = false
        for (let i = 0; i < this.cars.length; i++) {
            if (this.bestCarScore < this.cars[i].score) {
                this.bestCarScore = this.cars[i].score
                bestCarIndex = this.cars[i].index
                newBestCarFound = true
                console.log("New highscore: ", this.cars[i].score);
            }
        }
        if (!newBestCarFound) return this.bestCar

        let weights, weightCopies = []
        weights = this.cars[bestCarIndex].brain.model.getWeights()

        for (let i = 0; i < weights.length; i++) {
            weightCopies[i] = weights[i].clone()
        }
        if (this.bestCar.weights) {
            for (let i = 0; i < this.bestCar.weights.length; i++) {
                this.bestCar.weights[i].dispose()
            }
        }
        return { weights: weightCopies, score: this.bestCarScore }
    }

    disposeCarBrains() {
        for (const car of this.cars) {
            car.brain.dispose()
        }
    }

    drive(isDrawingDistance) {
        this.deadCars = 0
        for (const car of this.cars) {
            car.drive(isDrawingDistance)
            car.useBrain()
            if (car.isDead) this.deadCars++
            if (this.deadCars == this.carPopulation) {
                // console.log(tf.memory().numTensors)
                this.bestCar = this.getBestCar()
                console.log(this.bestCar);
                this.disposeCarBrains()
                this.createCarPopulation(this.bestCar.weights)
            }
        }
    }

}
