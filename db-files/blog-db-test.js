const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
const database = 'blogs'
const collection = 'posts'

/**
 * Test function to retrieve all blog posts from db
 * @returns {Array} allBlogPosts
 */
async function getAllBlogs() {
  try {
    let connect = await client.connect()
    let allBlogPosts = await connect
      .db(database)
      .collection(collection)
      .find()
      .toArray()

    console.log(`Found ${allBlogPosts.length} Blog Posts.`)
  } catch (error) {
    console.log(error)
  } finally {
    await client.close()
  }
}

/**
 * Test function to retrieve 3 most recent blog posts by date from db
 * @returns {Array} recentBlogPosts
 */
async function getRecentBlogs() {
  try {
    let connect = await client.connect()
    let recentBlogPosts = await connect
      .db(database)
      .collection(collection)
      .find()
      .sort({ id: -1 })
      .limit(3)
      .toArray()

    console.log(`Found ${recentBlogPosts.length} Recent Blog Posts.`)
  } catch (error) {
    console.log(error)
  } finally {
    await client.close()
  }
}

/**
 * Test function to retrieve specific blog post details by title from db
 * @returns {Object} specificBlogPost
 */
async function getBlogDetails() {
  try {
    let connect = await client.connect()
    let specificBlogPost = await connect
      .db(database)
      .collection(collection)
      .findOne({
        title:
          'How to Implement Data-Driven Marketing Strategies for Tech Companies',
      })

    console.log(`Found ${specificBlogPost.author} Blog Post.`)
  } catch (error) {
    console.log(error)
  } finally {
    await client.close()
  }
}

/**
 * Test function to search all blog posts in db matching keyword string
 * @returns {Array} searchResults
 */
async function searchBlogByKeyword(req, res, next) {
  const searchPhrase = 'data+analytics'

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

    console.log(`Found ${searchResults.length} Matching Blog Posts.`)
  } catch (error) {
    console.log(error)
    return next(error)
  } finally {
    await client.close()
  }
}

//Call test functions
//getAllBlogs()
//getRecentBlogs()
//getBlogDetails()
//searchBlogByKeyword()
