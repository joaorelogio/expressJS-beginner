// https://www.youtube.com/watch?v=gnsO8-xJ8rs

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// const logger = (req, res, next) => {
//   console.log('Logging...');
//   next();
// }

// app.use(logger);

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Customers'
  });
});

app.listen(3000, () => console.log(`listening on http://localhost:3000`));
