import fs from 'fs'
import path from 'path'
import { Trainer } from 'synaptic'

import tweets from '../data/@egeste-subset.json'
import RecurrentNetwork from '../src/networks/Recurrent'

const EOF = '\x00'

// Build a unique list of characters in the data set
console.log('Building charspace...')
const charspace = Object.keys(tweets.reduce((memo, tweet) => {
  const chars = tweet.text.split('')
  chars.forEach(char => memo[char] = true)
  return memo
}, {}))
console.log('Found', charspace.length, 'unique chars')
charspace.push(EOF)

console.log('Encoding chars...')
const encodedChars = charspace.map((char, index) => {
  const encodedChar = new Array(charspace.length).fill(0)
  encodedChar[index] = 1
  return encodedChar
})
console.log('Encoded', encodedChars.length, 'chars')

console.log('Building training cases...')
const trainingCases = []
tweets.forEach(tweet => {
  const { text } = tweet
  const chars = text.split('')

  // Break the text down to training cases
  chars.forEach((inputChar, index) => {
    const nextChar = chars[index + 1] || EOF
    const input = encodedChars[charspace.indexOf(inputChar)]
    const output = encodedChars[charspace.indexOf(nextChar)]
    trainingCases.push({ input, output })
  })

})
console.log('Built', trainingCases.length, 'training cases...')

console.log('Creating RecurrentNetwork')
const characterNetwork = new RecurrentNetwork({
  inputCount: charspace.length,
  outputCount: charspace.length,
  hiddenInputCount: charspace.length,
  hiddenLayerCount: 1
})

console.log('Building Trainer')
const trainer = new Trainer(characterNetwork)

const speechTrainer = function () {
  const trainingConfig = {
    iterations: 100,
    log: true,
    shuffle: false,
    cost: Trainer.cost.MSE
  }
  return this.train(trainingCases, trainingConfig)
}

console.log('Training...')
console.log('Trained', speechTrainer.call(trainer))

const outputPath = path.join(__dirname, '..', 'models')
const outputFile = path.resolve(path.join(outputPath, '@egeste-subset.json'))
fs.writeFile(outputFile, JSON.stringify(characterNetwork))
