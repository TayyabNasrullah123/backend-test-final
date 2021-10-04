const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('./config/database'); //database configuration
const app = express();
const users = require('./routes/users');

app.set('secretKey', 'nodeRestApi'); // jwt secret token
// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// app.get('/', function(req, res){
// res.json({"finally" : "backend test is here"});
// });


// public route
app.use('/', users);

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function(req, res, next) {
 let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// handle errors
app.use(function(err, req, res, next) {
 console.log(err);
 
  if(err.status === 404)
   res.status(404).json({message: "Not found"});
  else 
    res.status(500).json({message: "Something looks wrong :( !!!"});
});
app.listen(3000, function(){
 console.log('Node server listening on port 3000');
});
