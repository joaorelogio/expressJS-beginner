const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');

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


const users = [
  {
    id: 1,
    first_name: 'João',
    last_name: 'Relógio',
    email: 'joaorelogio@gmail.com'
  },
  {
    id: 2,
    first_name: 'Carla',
    last_name: 'Relógio',
    email: 'carlarelogio@gmail.com'
  },
  {
    id: 3,
    first_name: 'Sebastião',
    last_name: 'Relógio',
    email: 'sebastiaorelogio@gmail.com'
  },
]

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Customers',
    users: users
  });
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
    console.log('SUCCESS');
  }
});

app.listen(3000, () => console.log(`listening on http://localhost:3000`));
