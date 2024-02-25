const { MongoClient } = require('mongodb')
const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri)
const database = 'blogs'
const collection = 'posts'

/**
 * Searches all blog posts in db for matches based on query text string
 * then renders search.ejs
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Array} searchResults
 */
async function searchBlogs(req, res, next) {
  const searchPhrase = req.query.s

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
      totalResults = 0
    } else {
      totalResults = searchResults.length
    }

    pageTitle = `${totalResults} Search Results for "${searchPhrase}"`

    //console.log(`Found ${totalResults} Matching Blog Posts.`)

    res.render('search', {
      results: searchResults,
      pageTitle: pageTitle,
    })
  } catch (error) {
    console.log(error)
    return next(error)
  } finally {
    await client.close()
  }
}

module.exports = {
  searchBlogs,
}
