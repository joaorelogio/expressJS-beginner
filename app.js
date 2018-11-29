const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');

var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectID = mongojs.ObjectID;

// MongoDB Server Connect
// var mongojs = require('mongojs');
// var db = mongojs('test', ['users']);
// var MongoClient = require('mongodb').MongoClient;
// var url = `mongodb+srv://joaoprelogio@gmail.com:${encodeURIComponent('reeh7eeW@')}@customer-lpgp6.gcp.mongodb.net`;
// MongoClient.connect(url, function(err, db) {
//   console.log('MongoDB connect');
// });


const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

// Global Varibles
app.use(function(req, res, next){
  res.locals.errors = null;
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    let namespace = param.split('.'),
        root      = namespace.shift(),
        formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      params: formParam,
      msg: msg,
      value: value
    };
  }
}));


// const users = [
//   {
//     id: 1,
//     first_name: 'João',
//     last_name: 'Relógio',
//     email: 'joaorelogio@gmail.com'
//   },
//   {
//     id: 2,
//     first_name: 'Carla',
//     last_name: 'Relógio',
//     email: 'carlarelogio@gmail.com'
//   },
//   {
//     id: 3,
//     first_name: 'Sebastião',
//     last_name: 'Relógio',
//     email: 'sebastiaorelogio@gmail.com'
//   },
// ]

// Home route
app.get('/', (req, res) => {
  db.users.find(function (err, docs){
    res.render('index', {
      title: 'Customers',
      users: docs
    });
  })

  // MongoDB Server Connect
  // db.users.find(function (err, docs) {
  //   console.log(docs);
  //   res.render('index', {
  //     title: 'Customers',
  //     users: docs
  //   });
  // })
});

app.post('/users/add', (req, res) => {

  req.checkBody('first_name', 'First Name is required').notEmpty();
  req.checkBody('last_name', 'Last Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();

  const errors = req.validationErrors();

  if(errors) {
    res.render('index', {
      title: 'Customers',
      users: users,
      errors: errors
    });
  } else {
    var newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
    }
    db.users.insert(newUser, function(err, result){
      if(err){
        console.log(err);
      }
      res.redirect('/');
    });
  }
});

app.delete('/users/delete/:id', function(req, res){
  db.users.remove({_id: db.ObjectId(req.params.id)}, function(err, result){
    if(err) {
      console.log(err);
    }
    res.redirect('/');
  })
})

app.listen(3000, () => console.log(`listening on http://localhost:3000`));
