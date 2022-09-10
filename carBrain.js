
export default class CarBrain {
    constructor(inputNodes, hiddenNodes, outputNodes, bestCarWeights = false, isFirstCar = false) {
        this.model = tf.sequential({
            layers: [
                tf.layers.dense({
                    units: hiddenNodes,
                    inputShape: [inputNodes],
                    activation: 'sigmoid'
                }),
                tf.layers.dense({
                    units: outputNodes,
                    activation: 'softmax'
                })
            ]
        })
        if (bestCarWeights != false) {
            this.model.setWeights(bestCarWeights)
            if (!isFirstCar) {
                this.mutate(0.2)
            }
        }
    }

    randomGaussian() {
        let y1, x1, x2, w
        do {
            x1 = Math.random(2) - 1
            x2 = Math.random(2) - 1
            w = x1 * x1 + x2 * x2
        } while (w >= 1)
        w = Math.sqrt(-2 * Math.log(w) / w)
        y1 = x1 * w
        return y1
    }

    mutate(rate) {
        tf.tidy(() => {
            const weights = this.model.getWeights()
            const mutatedWeights = []
            for (let i = 0; i < weights.length; i++) {
                let tensor = weights[i]
                let shape = weights[i].shape
                let values = tensor.dataSync().slice()
                for (let j = 0; j < values.length; j++) {
                    if (Math.random() < rate) {
                        let w = values[j]
                        values[j] = w + this.randomGaussian()
                    }
                }
                let newTensor = tf.tensor(values, shape)
                mutatedWeights[i] = newTensor
            }
            this.model.setWeights(mutatedWeights)
        })
    }

    predict = (input) => tf.tidy(() => {
        const inputTensor = tf.tensor2d([input])
        const prediction = this.model.predict(inputTensor).dataSync()
        return prediction
    })

    dispose() {
        this.model.dispose()
    }
}
