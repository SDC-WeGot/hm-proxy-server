const express = require('express');const router = express.Router();

const routes = {
  gallery: (req, res) => res.redirect(`http://13.57.148.57/api/restaurants/${req.params.id}/gallery`),
  overview: (req, res) => res.redirect(`http://184.169.248.150/api/restaurants/${req.params.id}/overview`),
  sidebar: (req, res) => res.redirect(`http://54.177.233.239/api/restaurants/${req.params.id}/sidebar`),
  recommendations: (req, res) => res.redirect(`http://52.89.102.101/api/restaurants/${req.params.id}/recommendations`),
}

router.get('/api/restaurants/:id/:widget', (req, res) => {
  if (routes[req.params.widget]) {
    routes[req.params.widget](req, res)
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
