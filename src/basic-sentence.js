


// XOR: function(options) {

//     if (this.network.inputs() != 2 || this.network.outputs() != 1)
//       throw new Error("Incompatible network (2 inputs, 1 output)");

//     var defaults = {
//       iterations: 100000,
//       log: false,
//       shuffle: true,
//       cost: Trainer.cost.MSE
//     };

//     if (options)
//       for (var i in options)
//         defaults[i] = options[i];

//     return this.train([{
//       input: [0, 0],
//       output: [0]
//     }, {
//       input: [1, 0],
//       output: [1]
//     }, {
//       input: [0, 1],
//       output: [1]
//     }, {
//       input: [1, 1],
//       output: [0]
//     }], defaults);
//   }
