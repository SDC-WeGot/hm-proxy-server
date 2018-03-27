require('newrelic');
const express = require('express');
const path = require('path');
const React = require('react');
const ReactDom = require('react-dom/server');
// const morgan = require('morgan');
const restaurantsInfoRouter = require('./routes/routes.js');
const bundleRouter = require('./routes/bundleRouter.js');

const app = express();
const port = process.env.PORT || 4001;

app.use('/lib', express.static('public/lib'));
app.use('/services', express.static(path.join(__dirname, './public/services')));

const clientBundles = path.join(__dirname, './public/services');
const serverBundles = path.join(__dirname, './templates/services');
const serviceConfig = require('./service-config.json');
const services = require('./loader.js')(clientBundles, serverBundles, serviceConfig);
const Layout = require('./templates/layout');
const App = require('./templates/app');
const Scripts = require('./templates/scripts');

const renderComponents = (components, props = {}) => {
  return Object.keys(components).map(item => {
    let component = React.createElement(components[item], props);
    return ReactDom.renderToString(component);
  })
}

// // app.use(morgan('dev'));
// app.get('/', (req, res) => {
//   // res.redirect('/restaurants/ChIJUcXYWWGAhYARmjMY2bJAG2s/');
//   res.redirect('/restaurants/1/');
// })


// app.get('/restaurants/:id/:widget/bundle.js', bundleRouter);

// app.get('/api/restaurants/:id/:widget', restaurantsInfoRouter);

app.get('/restaurants/:id', function(req, res) {
  let components = renderComponents(services, {itemid: req.params.id})
  res.end(Layout(
    'WeGot SSR',
    App(...components),
    Scripts(Object.keys(services))
  ));
});

app.listen(port, () => {
  console.log('Proxy listening on port 4001');
});
