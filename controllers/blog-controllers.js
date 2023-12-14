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

    //console.log(`Found ${specificBlogPost.author} Blog Post.`)

    const blogTextString = specificBlogPost.text.join(' ')

    if (specificBlogPost.id == 1) {
      const prevBlogDetails = null
    }

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

async function searchBlogByKeyword(req, res, next) {
  try {
    const searchPhrase = req.params.searchText

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
      results = null
      pageTitle = `No results found for "${searchPhrase}`
      totalResults = 0
    } else {
      totalResults = searchResults.length
      pageTitle = `${totalResults} Search Results for "${searchPhrase}"`
    }

    //console.log(`Found ${searchResults.length} Matching Blog Posts.`)
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
  getBlogDetails,
  getAllBlogs,
  searchBlogByKeyword,
  getRecentBlogs,
}
