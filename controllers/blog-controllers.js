const { MongoClient } = require('mongodb')
const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri)
const database = 'blogs'
const collection = 'posts'

/**
 * Retrieves all blog posts from db then renders blog.ejs
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Array} allBlogPosts
 */
async function getAllBlogs(req, res, next) {
  try {
    let connect = await client.connect()
    let allBlogPosts = await connect
      .db(database)
      .collection(collection)
      .find()
      .sort({ date: -1 })
      .toArray()

    //console.log(`Found ${allBlogPosts.length} Blog Posts.`)
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

/**
 * Retrieves 3 most recent blog posts by date from db then renders home.ejs
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Array} recentBlogPosts
 */
async function getRecentBlogs(req, res, next) {
  try {
    let connect = await client.connect()
    let recentBlogPosts = await connect
      .db(database)
      .collection(collection)
      .find()
      .sort({ date: -1 })
      .limit(3)
      .toArray()

    //console.log(`Found ${recentBlogPosts.length} Recent Blog Posts.`)
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

/**
 * Retrieves previous or next blog posts by id from db for pagination
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Object} adjacentBlogDetails
 */
async function getAdjacentBlog(id) {
  try {
    let connect = await client.connect()
    let adjacentBlogDetails = await connect
      .db(database)
      .collection(collection)
      .findOne({ id: id }, { id: 1, title: 1, urlTitle: 1 })

    if (!adjacentBlogDetails) {
      adjacentBlogDetails = null
    }

    return adjacentBlogDetails
  } catch (error) {
    console.log(error)
    return next(error)
  } finally {
    await client.close()
  }
}

/**
 * Retrieves details for specific blog post by title from db then renders blog-post.ejs
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Object} specificBlogPost
 */
async function getBlogDetails(req, res, next) {
  try {
    let connect = await client.connect()
    let specificBlogPost = await connect
      .db(database)
      .collection(collection)
      .findOne({ urlTitle: req.params.blogTitle })

    //Renders to 404.ejs if no matching blog post found
    if (!specificBlogPost) {
      //console.log('Not a valid blog post title')
      res.render('404')
      return
    }

    //console.log(`Found ${specificBlogPost.author} Blog Post.`)

    // Converts array of blog body text to single string
    const blogTextString = specificBlogPost.text.join(' ')

    if (specificBlogPost.id == 1) {
      const prevBlogDetails = null
    }

    /* Determine previous and next blog post by id
    then call 'getAdjacentBlog' function to get details
    for each used in pagination
    */
    const prevBlogId = specificBlogPost.id - 1
    const prevBlogDetails = await getAdjacentBlog(prevBlogId)

    const nextBlogId = specificBlogPost.id + 1
    const nextBlogDetails = await getAdjacentBlog(nextBlogId)

    res.render('blog-post', {
      blog: specificBlogPost,
      blogText: blogTextString,
      prevBlog: prevBlogDetails,
      nextBlog: nextBlogDetails,
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
  getRecentBlogs,
}
