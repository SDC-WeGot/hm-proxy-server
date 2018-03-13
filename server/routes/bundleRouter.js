const express = require('express');

const bundleRoutes = {
  gallery: (req, res) => res.redirect('http://13.57.148.57/restaurants/id/bundle.js'),
  overview: (req, res) => res.redirect('http://184.169.248.150/restaurants/id/bundle.js'),
  sidebar: (req, res) => res.redirect('http://54.177.233.239/restaurants/id/bundle.js'),
  recommendations: (req, res) => res.redirect('http://52.89.102.101/restaurants/id/bundle.js'),
};

const bundleRouter = (req, res) => {
  if (bundleRoutes[req.params.widget]) {
    bundleRoutes[req.params.widget](req, res)
  } else {
    res.sendStatus(404);
  }
};


module.exports = bundleRouter;
