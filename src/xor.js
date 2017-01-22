import { Trainer } from 'synaptic'
import Perceptron from './networks/Perceptron'

const perceptron = new Perceptron({
  inputCount: 2,
  outputCount: 1,
  hiddenInputCount: 3
})

const trainer = new Trainer(perceptron)

console.log('-----------Training XOR-------------')
console.log(trainer.XOR())
console.log()
console.log('------------------------------------')
console.log('Learned XOR(0,0) ~=', Math.round(perceptron.activate([0,0]), perceptron.activate([0,0])))
console.log('Learned XOR(1,0) ~=', Math.round(perceptron.activate([1,0]), perceptron.activate([1,0])))
console.log('Learned XOR(0,1) ~=', Math.round(perceptron.activate([0,1]), perceptron.activate([0,1])))
console.log('Learned XOR(1,1) ~=', Math.round(perceptron.activate([1,1]), perceptron.activate([1,1])))
