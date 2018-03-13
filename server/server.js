const express = require('express');
const path = require('path');
const morgan = require('morgan');
const restaurantsInfoRouter = require('./routes/routes.js');
const bundleRouter = require('./routes/bundleRouter.js');

const app = express();

app.use(morgan('dev'));
app.get('/', (req, res) => {
  res.redirect('/restaurants/ChIJUcXYWWGAhYARmjMY2bJAG2s/');
})

app.use('/restaurants/:id', express.static('public'));
app.get('/restaurants/:id/:widget/bundle.js', bundleRouter);

app.get('/api/restaurants/:id/:widget', restaurantsInfoRouter);

app.listen(4001, () => {
  console.log('Proxy listening on port 4001');
});
