import fs from 'fs'
import path from 'path'

import { Trainer, Network } from 'synaptic'
import RecurrentNetwork from '../src/networks/Recurrent'
import existingModel from '../models/hello.json'

const SOF = '\x01'
const EOF = '\x00'

// Build a unique list of characters in the data set
console.log('Building charspace...')
const charspace = 'helo'.split('')
charspace.unshift(SOF) // Start
charspace.push(EOF) // End

console.log('Encoding chars...')
const encodedChars = charspace.map((char, index) => {
  const encodedChar = new Array(charspace.length).fill(0)
  encodedChar[index] = 1
  return encodedChar
})

// const trainingCases = [{
//   input:  [1, 0, 0, 0, 0, 0],
//   output: [0, 1, 0, 0, 0, 0]
// }, {
//   input:  [0, 1, 0, 0, 0, 0],
//   output: [0, 0, 1, 0, 0, 0]
// }, {
//   input:  [0, 0, 1, 0, 0, 0],
//   output: [0, 0, 0, 1, 0, 0]
// }, {
//   input:  [0, 0, 0, 1, 0, 0],
//   output: [0, 0, 0, 1, 0, 0]
// }, {
//   input:  [0, 0, 0, 1, 0, 0],
//   output: [0, 0, 0, 0, 1, 0]
// }, {
//   input:  [0, 0, 0, 0, 1, 0],
//   output: [0, 0, 0, 0, 0, 1]
// }]

console.log('Creating RecurrentNetwork...')
// const characterNetwork = Network.fromJSON(existingModel)
const characterNetwork = new RecurrentNetwork({
  inputCount: charspace.length,
  outputCount: charspace.length,
  hiddenInputCount: charspace.length,
  hiddenLayerCount: 32
})

// console.log('Building Trainer...')
// const trainer = new Trainer(characterNetwork)

// const speechTrainer = function () {
//   const trainingConfig = {
//     log: true,
//     // rate: .3,
//     // error: .005,
//     shuffle: false,
//     iterations: 999999,
//     cost: Trainer.cost.MSE
//     // cost: Trainer.cost.CROSS_ENTROPY
//   }
//   return this.train(trainingCases, trainingConfig)
// }

// console.log('Training...')
// console.log('Trained', speechTrainer.call(trainer))

// const outputPath = path.join(__dirname, '..', 'models')
// const outputFile = path.resolve(path.join(outputPath, 'hello.json'))
// fs.writeFile(outputFile, JSON.stringify(characterNetwork, null, 2))

const startingChar = SOF
const expectedLength = 7
console.log('Building a', expectedLength, 'char array starting with', startingChar)

const generatedCharacters = (new Array(expectedLength)).fill('')
generatedCharacters.forEach((char, index) => {
  let previousChar = generatedCharacters[index - 1]
  if (previousChar == null) previousChar = startingChar

  const previousEncodedChar = encodedChars[charspace.indexOf(previousChar)]

  const probabilities = characterNetwork.activate(previousEncodedChar)
  const highestProbability = probabilities.reduce((memo, probability) => {
    return probability > memo ? probability : memo
  }, 0)

  const mostProbableNextEncodedCharIndex = probabilities.indexOf(highestProbability)
  const mostProbableNextEncodedChar = encodedChars[mostProbableNextEncodedCharIndex]
  const mostProbableNextCharIndex = encodedChars.indexOf(mostProbableNextEncodedChar)
  const mostProbableNextChar = charspace[mostProbableNextCharIndex]

  // console.log({
  //   mostProbableNextEncodedCharIndex,
  //   mostProbableNextEncodedChar,
  //   mostProbableNextCharIndex,
  //   mostProbableNextChar
  // })

  generatedCharacters[index] = mostProbableNextChar
})

console.log(generatedCharacters)
