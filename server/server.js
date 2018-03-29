require('newrelic');
const express = require('express');
const path = require('path');
const React = require('react');
const ReactDom = require('react-dom/server');
const axios = require('axios');
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
const APIUrls = require('./itemUrls');

const renderComponents = async (components, props = {}) => {
  const results = [];
  for (item in components) {
    const url = `${APIUrls[item]}/api/restaurants/${props.itemid}/${item}`;
    const response = await axios.get(url);
    let component = React.createElement(components[item], response.data);
    results.push({ string: ReactDom.renderToString(component), props: response.data });
  }
  return results;
}

app.get('/restaurants/:id', async function(req, res) {
  let components = await renderComponents(services, {itemid: req.params.id});
  res.end(Layout(
    'WeGot SSR',
    App(...components),
    Scripts(Object.keys(services), ...components)
  ));
});

app.listen(port, () => {
  console.log('Proxy listening on port 4001');
});
