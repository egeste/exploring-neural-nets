import fs from 'fs'
import path from 'path'

import { Trainer, Network } from 'synaptic'
import RecurrentNetwork from '../src/networks/Recurrent'
import existingModel from '../models/hello.json'

const SOF = '\x01' // ^
const EOF = '\x00' // &

// Build a unique list of characters in the data set
console.log('Building charspace...')
const charspace = [SOF, 'h', 'e', 'l', 'o', EOF]

console.log('Encoding chars...')
const encodedChars = charspace.map((char, index) => {
  const encodedChar = new Array(charspace.length).fill(0)
  encodedChar[index] = 1
  return encodedChar
})

console.log('Creating RecurrentNetwork...')
const characterNetwork = RecurrentNetwork.fromJSON(existingModel)
// const characterNetwork = new RecurrentNetwork({
//   inputCount: charspace.length,
//   outputCount: charspace.length,
//   hiddenInputCount: charspace.length,
//   hiddenLayerCount: 128
// })

console.log('Building Trainer...')
const trainer = new Trainer(characterNetwork)

const helloTrainer = (function () {
  const trainingConfig = {
    log: 100,
    error: 0.05,
    shuffle: false,
    iterations: 2600,
    cost: Trainer.cost.MSE
  }

  // Am I training this right?
  const trainingCases = [{
  //        [^, h, e, l, o, &]
    input:  [1, 0, 0, 0, 0, 0],
    output: [0, 1, 0, 0, 0, 0]
  }, {
    input:  [0, 1, 0, 0, 0, 0],
    output: [0, 0, 1, 0, 0, 0]
  }, {
    input:  [0, 0, 1, 0, 0, 0],
    output: [0, 0, 0, 1, 0, 0]
  }, {
    input:  [0, 0, 0, 1, 0, 0],
    output: [0, 0, 0, 1, 0, 0]
  }, {
    input:  [0, 0, 0, 1, 0, 0],
    output: [0, 0, 0, 0, 1, 0]
  }, {
    input:  [0, 0, 0, 0, 1, 0],
    output: [0, 0, 0, 0, 0, 1]
  }]

  return this.train(trainingCases, trainingConfig)
}).bind(trainer)

console.log('Training...')
console.log('Trained', helloTrainer())

const outputPath = path.join(__dirname, '..', 'models')
const outputFile = path.resolve(path.join(outputPath, 'hello.json'))
fs.writeFile(outputFile, JSON.stringify(characterNetwork, null, 2), () => {
  let previousChar = SOF
  const output = []
  do {
    const previousEncodedCharIndex = charspace.indexOf(previousChar)
    const previousEncodedChar = encodedChars[previousEncodedCharIndex]

    const probabilities = characterNetwork.activate(previousEncodedChar)
    const highestProbability = probabilities.reduce((memo, probability) => {
      return probability > memo ? probability : memo
    }, 0)

    const mostProbableNextEncodedCharIndex = probabilities.indexOf(highestProbability)
    const mostProbableNextEncodedChar = encodedChars[mostProbableNextEncodedCharIndex]
    const mostProbableNextCharIndex = encodedChars.indexOf(mostProbableNextEncodedChar)
    const mostProbableNextChar = charspace[mostProbableNextCharIndex]

    previousChar = mostProbableNextChar
    output.push(mostProbableNextChar)

    console.log(JSON.stringify(output.join('')))
  } while (previousChar !== EOF)
})

