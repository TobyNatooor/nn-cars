
export default class CarBrain {
    constructor(inputNodes, hiddenNodes, outputNodes, mutationRate, bestCarWeights = false, isFirstCar = false) {
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
                this.mutate(mutationRate, mutationAmount)
            }
        }
    }

    mutate(rate, amount) {
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
                        values[j] = w + Math.random() * amount
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
        return this.model.predict(inputTensor).dataSync()
    })

    dispose() {
        this.model.dispose()
    }
}
