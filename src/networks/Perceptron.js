import {
  Network, Layer, Trainer
} from 'synaptic'

export default class Perceptron extends Network {

  constructor(options) {
    super()

    const {
      hiddenInputCount,
      inputCount, outputCount
    } = options

    // Create the layers
    const input = new Layer(inputCount)
    const output = new Layer(outputCount)
    const hiddenLayer = new Layer(hiddenInputCount)

    // Connect the layers
    input.project(hiddenLayer)
    hiddenLayer.project(output)

    // Set the layers to the network
    const hidden = [ hiddenLayer ]
    this.set({ input, hidden, output })
  }

}
