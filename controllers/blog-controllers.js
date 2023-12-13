const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
const database = 'blogs'
const collection = 'posts'

async function getAllBlogs(req, res, next) {
  try {
    let connect = await client.connect()
    let allBlogPosts = await connect
      .db(database)
      .collection(collection)
      .find()
      .toArray()

    console.log(`Found ${allBlogPosts.length} Blog Posts.`)
    res.render('blog', {
      blogs: allBlogPosts,
    })
  } catch (error) {
    console.log(error)
    return next(error)
  } finally {
    await client.close()
  }
}

async function getRecentBlogs(req, res, next) {
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
    res.render('home', {
      blogs: recentBlogPosts,
    })
  } catch (error) {
    console.log(error)
    return next(error)
  } finally {
    await client.close()
  }
}

async function getBlogDetails(req, res, next) {
  try {
    let connect = await client.connect()
    let specificBlogPost = await connect
      .db(database)
      .collection(collection)
      .findOne({ urlTitle: req.params.blogTitle })

    if (!specificBlogPost) {
      console.log('Not a valid blog post title')
      res.render('404')
      return
    }

    console.log(`Found ${specificBlogPost.author} Blog Post.`)
    res.render('blog-post', {
      blog: specificBlogPost,
    })
  } catch (error) {
    console.log(error)
    return next(error)
  } finally {
    await client.close()
  }
}

async function searchBlogByKeyword(req, res, next) {
  try {
    const searchPhrase = 'pass search phrase here'
    const searchResults = await posts
      .find({ description: { $regex: searchPhrase } })
      .sort({ date: -1 })
    console.log(`Found ${searchResults.length} Blog Posts.`)
    res.render('search', {
      results: searchResults,
      pageTitle: `Search Results for "${searchPhrase}"`,
    })
  } catch (error) {
    console.log(error)
    return next(error)
  } finally {
    await client.close()
  }
}

module.exports = {
  getBlogDetails,
  getAllBlogs,
  searchBlogByKeyword,
  getRecentBlogs,
}
