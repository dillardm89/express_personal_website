const express = require('express')
const { render } = require('ejs')
const blogController = require('../controllers/blog-controllers')
const data = require('../files/images.json')
const apiKey = process.env.WEB3_FORM_API_KEY

const router = express.Router()

//router.get('/', function (req, res) {
//  res.render('home')
//})

router.get('/', blogController.getRecentBlogs)

router.get('/about-me', function (req, res) {
  res.render('about-me')
})

router.get('/resume', function (req, res) {
  res.render('resume')
})

router.get('/gallery', function (req, res) {
  const images = data['images']

  res.render('gallery', { images: images })
})

router.get('/contact-me', function (req, res) {
  res.render('contact-me', { apiKey: apiKey })
})

router.get('/blog', function (req, res) {
  res.render('blog')
})
//router.get('/blog', blogController.getAllBlogs)

//router.get('/:blogTitle', blogController.getBlogDetails)

//router.get('/?s=:searchId', blogController.searchBlogByKeyword)

module.exports = router
