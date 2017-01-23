import fs from 'fs'
import path from 'path'

import { Trainer, Network } from 'synaptic'
import RecurrentNetwork from '../src/networks/Recurrent'

import tweets from '../data/@egeste.json'
// import existingModel from '../models/@egeste.json'

const SOF = '\x01'
const EOF = '\x00'

// Build a unique list of characters in the data set
console.log('Building charspace...')
const charspace = Object.keys(tweets.reduce((memo, tweet) => {
  const chars = tweet.text.split('')
  chars.forEach(char => memo[char] = true)
  return memo
}, {}))

charspace.unshift(SOF) // Start
charspace.push(EOF) // End

console.log('Found', charspace.length, 'unique chars...')

console.log('Encoding chars...')
const encodedChars = charspace.map((char, index) => {
  const encodedChar = new Array(charspace.length).fill(0)
  encodedChar[index] = 1
  return encodedChar
})
console.log('Encoded', encodedChars.length, 'chars...')

console.log('Building training cases...')
const trainingCases = []
tweets.forEach(tweet => {
  const { text } = tweet
  const chars = text.split('')

  chars.unshift(SOF)
  chars.push(EOF)

  // Break the text down to training cases
  chars.forEach((inputChar, index) => {
    const nextChar = chars[index + 1] || EOF
    const input = encodedChars[charspace.indexOf(inputChar)]
    const output = encodedChars[charspace.indexOf(nextChar)]
    trainingCases.push({ input, output })
  })
})

console.log('Built', trainingCases.length, 'training cases...')

console.log('Creating RecurrentNetwork...')
// const characterNetwork = Network.fromJSON(existingModel)

const characterNetwork = new RecurrentNetwork({
  inputCount: charspace.length,
  outputCount: charspace.length,
  hiddenInputCount: charspace.length,
  hiddenLayerCount: 16
})

console.log('Building Trainer...')
const trainer = new Trainer(characterNetwork)

const speechTrainer = function () {
  const trainingConfig = {
    log: true,
    // rate: .3,
    // error: .005,
    shuffle: false,
    iterations: 100,
    cost: Trainer.cost.MSE
    // cost: Trainer.cost.CROSS_ENTROPY
  }
  return this.train(trainingCases, trainingConfig)
}

console.log('Training...')
console.log('Trained', speechTrainer.call(trainer))

const outputPath = path.join(__dirname, '..', 'models')
const outputFile = path.resolve(path.join(outputPath, '@egeste.json'))
fs.writeFile(outputFile, JSON.stringify(characterNetwork, null, 2))

// NOTE: Was here. Looks like everything is working smoothly, however...
// a single threaded training model is far too slow for this much computation.
// Looking into https://github.com/egeste/deep_cyber

// const startingChar = SOF
// const expectedLength = 30
// console.log('Building a', expectedLength, 'char array starting with', startingChar)

// const generatedCharacters = (new Array(expectedLength)).fill('')

// generatedCharacters.forEach((char, index) => {
//   let previousChar = generatedCharacters[index - 1]
//   if (previousChar == null) previousChar = startingChar

//   const previousEncodedChar = encodedChars[charspace.indexOf(previousChar)]

//   const probabilities = characterNetwork.activate(previousEncodedChar)
//   const highestProbability = probabilities.reduce((memo, probability) => {
//     return probability > memo ? probability : memo
//   }, 0)

//   const mostProbableNextEncodedCharIndex = probabilities.indexOf(highestProbability)
//   const mostProbableNextEncodedChar = encodedChars[mostProbableNextEncodedCharIndex]
//   const mostProbableNextCharIndex = encodedChars.indexOf(mostProbableNextEncodedChar)
//   const mostProbableNextChar = charspace[mostProbableNextCharIndex]

//   console.log({
//     mostProbableNextEncodedCharIndex,
//     mostProbableNextEncodedChar,
//     mostProbableNextCharIndex,
//     mostProbableNextChar
//   })

//   generatedCharacters[index] = mostProbableNextChar
// })

// console.log(generatedCharacters)
