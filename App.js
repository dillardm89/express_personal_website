const express = require('express')
const path = require('path')
const dotenv = require('dotenv').config()
const websiteRoutes = require('./routes/website-routes.js')
const port = process.env.HOST_PORT

//Set up express server
const app = express()

//set up ejs view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//Parse incoming requests
app.use(express.urlencoded({ extended: true }))

//Serve static CSS Files
app.use(express.static('public'))

//Handle standard routes
app.use(websiteRoutes)

//Route error handling
app.use(function (error, req, res, next) {
  console.log(error)
  res.render('404')
})

//Express server
app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
