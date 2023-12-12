const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017/'
const client = new MongoClient(url)

const blogs = client.db('blogs')
const posts = blogs.collection('posts')

async function getAllBlogs(req, res, next) {
  try {
    const allBlogPosts = await posts.findAll().sort({ date: -1 })
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
    const recentBlogPosts = await posts.find().sort({ date: -1 }).limit(3)
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
    const specificBlogPost = await posts.findOne({
      title: req.params.blogTitle,
    })
    console.log(`Found ${specificBlogPost.length} Blog Post.`)
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

module.export = {
  getBlogDetails,
  getAllBlogs,
  searchBlogByKeyword,
  getRecentBlogs,
}
