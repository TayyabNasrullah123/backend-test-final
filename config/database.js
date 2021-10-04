//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://tayyab:tayyab@cluster0.lkzg6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
module.exports = mongoose;
