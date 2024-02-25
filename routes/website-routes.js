const express = require('express')
const blogController = require('../controllers/blog-controllers')
const galleryController = require('../controllers/gallery-controllers')
const searchController = require('../controllers/search-controllers.js')
const apiKey = process.env.WEB3_FORM_API_KEY

const router = express.Router()

router.get('/', blogController.getRecentBlogs)

router.get('/about-me', function (req, res) {
  res.render('about-me')
})

router.get('/resume', function (req, res) {
  res.render('resume')
})

router.get('/contact-me', function (req, res) {
  res.render('contact-me', { apiKey: apiKey })
})

router.get('/search', searchController.searchBlogs)

router.get('/gallery-:pageNum', galleryController.getImagesByPageNum)

router.get('/blog', blogController.getAllBlogs)

router.get('/:blogTitle', blogController.getBlogDetails)

module.exports = router
