const express = require('express')
const { render } = require('ejs')
const blogController = require('../controllers/blog-controllers')
const galleryController = require('../controllers/gallery-controllers')
const apiKey = process.env.local.WEB3_FORM_API_KEY

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

router.get('/gallery-:pageNum', galleryController.getImagesByPageNum)

router.get('/blog', blogController.getAllBlogs)

router.get('/:blogTitle', blogController.getBlogDetails)

//router.get('/?s=:searchId', blogController.searchBlogByKeyword)

module.exports = router
