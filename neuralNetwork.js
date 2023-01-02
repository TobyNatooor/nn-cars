export default class NeuralNetwork {
    constructor(shape, weights = false, biases = false) {
        this.shape = shape
        this.weights = []
        this.biases = []

        for (let i = 0; i < this.shape.length - 1; i++) {
            this.weights.push([])
            for (let j = 0; j < this.shape[i + 1]; j++) {
                this.weights[i].push([])
                for (let k = 0; k < this.shape[i]; k++) {
                    if (weights) {
                        this.weights[i][j].push(weights[i][j][k])
                    } else {
                        this.weights[i][j].push(Math.random())
                    }
                }
            }
        }
        for (let i = 0; i < this.shape.length - 1; i++) {
            this.biases.push([])
            for (let j = 0; j < this.shape[i + 1]; j++) {
                if (biases) {
                    this.biases[i].push(biases[i][j])
                } else {
                    this.biases[i].push(Math.random())
                }
            }
        }
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x))
    }

    softmax(array) {
        let sum = 0, newArray = []
        for (let i = 0; i < array.length; i++) {
            sum += array[i]
        }
        for (let i = 0; i < array.length; i++) {
            newArray.push(array[i] / sum)
        }
        return newArray
    }

    getOutput(input) {
        let activations = [this.softmax(input)] // [input]
        // console.log(activations);
        for (let i = 0; i < this.shape.length - 1; i++) {
            activations.push([])
            for (let j = 0; j < this.shape[i + 1]; j++) {
                let activation = this.biases[i][j]
                for (let k = 0; k < this.shape[i]; k++) {
                    activation += activations[i][k] * this.weights[i][j][k]
                }
                activations[i + 1].push(this.sigmoid(activation))
            }
        }
        return this.softmax(activations[activations.length - 1])
    }

    mutate(rate, amount) {
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                for (let k = 0; k < this.weights[i][j].length; k++) {
                    if (Math.random() < rate) {
                        this.weights[i][j][k] += Math.random() * amount
                    }
                }
            }
        }
        for (let i = 0; i < this.biases.length; i++) {
            for (let j = 0; j < this.biases[i].length; j++) {
                if (Math.random() < rate) {
                    this.biases[i][j] += Math.random() * amount
                }
            }
        }
    }
}