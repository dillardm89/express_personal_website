const { MongoClient } = require('mongodb')

const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri)
const database = 'blogs'
const collection = 'posts'

const resultsPerPage = 1

async function getAllResults(searchPhrase) {
  try {
    let connect = await client.connect()
    let searchResults = await connect
      .db(database)
      .collection(collection)
      .find({
        $text: {
          $search: searchPhrase,
          $caseSensitive: false,
        },
      })
      .sort({ date: -1 })
      .toArray()

    if (!searchResults || searchResults.length == 0) {
      searchResults = null
    }
    return searchResults
  } catch (error) {
    console.log(error)
    return next(error)
  } finally {
    await client.close()
  }
}

async function searchBlogs(req, res, next) {
  const searchPhrase = req.query.s

  const searchResults = await getAllResults(searchPhrase)

  if (!searchResults || searchResults.length == 0) {
    totalResults = 0
  } else {
    totalResults = searchResults.length
  }

  //console.log(`Found ${totalResults} Matching Blog Posts.`)
  pageTitle = `${totalResults} Search Results for "${searchPhrase}"`

  if (totalResults > resultsPerPage) {
    searchResults.splice(resultsPerPage)
    maxNumPages = Math.ceil(totalResults / resultsPerPage)
  } else {
    maxNumPages = 1
  }

  res.render('search', {
    results: searchResults,
    pageTitle: pageTitle,
    currentPage: 1,
    maxNumPages: maxNumPages,
    searchPhrase: searchPhrase,
  })
}

async function searchMoreBlogs(req, res, next) {
  const pageNum = req.params.pageNum
  const searchPhrase = req.query.s

  if (pageNum < 1) {
    console.log('Not a valid page number')
    res.render('404')
    return
  }

  const searchResults = await getAllResults(searchPhrase)

  if (!searchResults || searchResults.length == 0) {
    totalResults = 0
    maxNumPages = 0
  } else {
    totalResults = searchResults.length
    maxNumPages = Math.ceil(totalResults / resultsPerPage)
    console.log(maxNumPages)
  }

  if (pageNum > maxNumPages) {
    console.log('Not a valid page number')
    res.render('404')
    return
  }

  pageTitle = `${totalResults} Search Results for "${searchPhrase}"`

  const start = (pageNum - 1) * resultsPerPage
  console.log(start)
  const end = start + resultsPerPage
  console.log(end)
  const slicedResults = searchResults.slice(start, end)
  console.log(`Found ${slicedResults.length} Matching Blog Posts.`)

  res.render('search', {
    results: slicedResults,
    pageTitle: pageTitle,
    currentPage: pageNum,
    maxNumPages: maxNumPages,
    searchPhrase: searchPhrase,
  })
}

module.exports = {
  searchBlogs,
  searchMoreBlogs,
}
