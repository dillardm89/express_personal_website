const { MongoClient } = require('mongodb')

const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri)
const database = 'blogs'
const collection = 'posts'

const resultsPerPage = 3

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
    prevPage = ''
    nextPage = '/search/page=2'
    maxNumPages = Math.ceil(totalResults / resultsPerPage)
  } else {
    prevPage = ''
    nextPage = ''
    maxNumPages = 1
  }

  res.render('search', {
    results: searchResults,
    pageTitle: pageTitle,
    currentPage: 1,
    prevPage: prevPage,
    nextPage: nextPage,
    maxNumPages: maxNumPages,
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
  }

  if (pageNum > maxNumPages) {
    console.log('Not a valid page number')
    res.render('404')
    return
  }

  if (pageNum == 2) {
    prevPage = '/search'
  } else {
    prevNum = pageNum - 1
    prevPage = `/search/page=${prevNum}`
  }

  nextNum = pageNum + 1
  nextPage = `/search/page=${nextNum}`

  //console.log(`Found ${totalResults} Matching Blog Posts.`)
  pageTitle = `${totalResults} Search Results for "${searchPhrase}"`

  const start = (pageNum - 1) * resultsPerPage
  const end = start + resultsPerPage
  const slicedResults = searchResults.slice(start, end)

  res.render('search', {
    results: slicedResults,
    pageTitle: pageTitle,
    currentPage: pageNum,
    prevPage: prevPage,
    nextPage: nextPage,
    maxNumPages: maxNumPages,
  })
}

module.exports = {
  searchBlogs,
  searchMoreBlogs,
}
