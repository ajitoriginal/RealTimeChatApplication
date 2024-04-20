const mongoose = require("mongoose");

// const config = require('../utils/config');

// let db = 'mongodb+srv://erpProdUser:erpProdUser@erptest.vbhrq.mongodb.net/inventory_tool?retryWrites=true&w=majority'

let db = 'mongodb://localhost:27017/chat'
// module.exports = function () {
// console.log(database,"data")
// 	// mongoose.set('useCreateIndex', true)
//     mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
//         .then(() => console.log('Connected to database ' + database))
//         .catch(err => console.error('Error in connection' + err));
// }

const connectDB = async () => {
    try {
      await mongoose.connect(db);
      console.log('MongoDB connected...');
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;