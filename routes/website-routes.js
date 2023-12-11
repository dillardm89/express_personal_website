const express = require('express')
const { render } = require('ejs')
const blogController = require('../controllers/blog-controllers')
const galleryController = require('../controllers/gallery-controllers')

const router = express.Router()

router.get('/', blogController.getRecentBlogs)

router.get('/about-me', function (req, res) {
  res.render('about-me', {
    section: 'about',
  })
})

router.get('/resume', function (req, res) {
  res.render('resume', {
    section: 'resume',
  })
})

router.get('/gallery', galleryController.getAllImages)

router.get('/contact-me', function (req, res) {
  res.render('contact-me', {
    section: 'contact',
  })
})

router.get('/blog', blogController.getAllBlogs)

router.get('/:blogTitle', blogController.getBlogDetails)

router.get('/?s=:searchId', blogController.searchBlogByKeyword)

module.exports = router
