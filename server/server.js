require('newrelic');
const express = require('express');
const path = require('path');
const React = require('react');
const ReactDom = require('react-dom/server');
const axios = require('axios');
// const styled = require('styled-components');
// const morgan = require('morgan');
const restaurantsInfoRouter = require('./routes/routes.js');
const bundleRouter = require('./routes/bundleRouter.js');

const app = express();
const port = process.env.PORT || 4001;
const overviewAPI = process.env.OVERVIEW || 'http://localhost:3002'

app.use('/lib', express.static('public/lib'));
app.use('/services', express.static(path.join(__dirname, './public/services')));

const clientBundles = path.join(__dirname, './public/services');
const serverBundles = path.join(__dirname, './templates/services');
const serviceConfig = require('./service-config.json');
const services = require('./loader.js')(clientBundles, serverBundles, serviceConfig);
const Layout = require('./templates/layout');
const App = require('./templates/app');
const Scripts = require('./templates/scripts');

const renderComponents = async (components, props = {}) => {
  const results = [];
  for (item in components) {
    const url = `${overviewAPI}/api/restaurants/${props.itemid}/${item}`;
    const response = await axios.get(url);
    let component = React.createElement(components[item], response.data);
    results.push({ string: ReactDom.renderToString(component), props: response.data });
  }
  return results;
  // return Object.keys(components).map(async (item) => {
  //   console.log(`item: ${item}`);
  //   const url = `${overviewAPI}/api/restaurants/${props.itemid}/${item}`;
  //   console.log(url);
  //   const response = await axios.get(url);
  //   let component = React.createElement(components[item], response.data);
  //   return { string: ReactDom.renderToString(component), props: response.data };
  //   // console.log('rendering components');
  //   // res.write('<!DOCTYPE html><html><head><title>SSR Styled Components</title></head><body><div id="Overview">')
  //   // const sheet = new styled.ServerStyleSheet()
  //   // const jsx = sheet.collectStyles(React.createElement(components[item], props));
  //   // console.log(jsx);
  //   // const stream = sheet.interleaveWithNodeStream(ReactDom.renderToNodeStream(jsx));
  //   // stream.pipe(res, { end: false });
  //   // stream.on('end', () => res.end('</div></body></html>'));
  // })
}

// // app.use(morgan('dev'));
// app.get('/', (req, res) => {
//   // res.redirect('/restaurants/ChIJUcXYWWGAhYARmjMY2bJAG2s/');
//   res.redirect('/restaurants/1/');
// })


// app.get('/restaurants/:id/:widget/bundle.js', bundleRouter);

// app.get('/api/restaurants/:id/:widget', restaurantsInfoRouter);

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
