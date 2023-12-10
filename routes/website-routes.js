const express = require('express')
const { render } = require('ejs')

const router = express.Router()

router.get('/', function (req, res) {
  res.render('home')
})

router.get('/about-me', function (req, res) {
  res.render('about-me')
})

router.get('/resume', function (req, res) {
  res.render('resume')
})

router.get('/gallery', function (req, res) {
  res.render('gallery')
})

module.exports = router
