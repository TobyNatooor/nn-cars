
export default class NeuralNetwork {
    constructor(inputNodes, hiddenNodes, outputNodes) {
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
        //console.log(this.model.summary())
    }

    predict(input) {
        const inputTensor = tf.tensor2d([input])
        const prediction = this.model.predict(inputTensor).dataSync()
        return prediction
    }
}
