//const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

//const database = module.exports;

// database.connect = async function connect() {
//   database.client = await MongoClient.connect('mongodb://root:1234@database/', { useUnifiedTopology: true });
// };

//const database = module.exports;

// database.connect = async function connect() {
//   database.client =
  mongoose.connect('mongodb://root:1234@database/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
//}
