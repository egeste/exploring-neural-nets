import {
  Network, Layer
} from 'synaptic'

export default class Recurrent extends Network {

  constructor(options) {
    super(...arguments)

    const {
      inputCount, outputCount,
      hiddenLayerCount, hiddenInputCount
    } = options

    // Create & connect the layers
    const input = new Layer(inputCount)
    const output = new Layer(outputCount)

    const hidden = [] // Iterate to produce these
    for(var i = 0; i < hiddenLayerCount; i++) {
      const hiddenLayer = new Layer(hiddenInputCount)

      // Since we're a recurrent network, project to ourselves
      hiddenLayer.project(hiddenLayer)

      const previousHiddenLayer = hidden[i - 1]
      const isLastLayer = (i >= (hiddenLayerCount - 1))
      const isFirstLayer = !previousHiddenLayer

      if (isFirstLayer) input.project(hiddenLayer)

      if (!previousHiddenLayer) input.project(hiddenLayer)
      else previousHiddenLayer.project(hiddenLayer)

      if (isLastLayer) hiddenLayer.project(output)

      hidden.push(hiddenLayer)
    }

    // Set the layers
    this.set({ input, hidden, output })
  }

}
