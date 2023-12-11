async function getAllBlogs(req, res, next) {
  try {
    const allBlogs = await db.findAll().sort({ date: -1 })
    res.render('blog', {
      blogs: allBlogs,
    })
  } catch (error) {
    return next(error)
  }
}

async function getRecentBlogs(req, res, next) {
  try {
    const recentBlogs = await db.find().sort({ date: -1 }).limit(3)
    res.render('home', {
      blogs: recentBlogs,
    })
  } catch (error) {
    return next(error)
  }
}

async function getBlogDetails(req, res, next) {
  try {
    const blog = await db.findByTitle(req.params.blogTitle)
    res.render('blog-post', {
      blog: blog,
    })
  } catch (error) {
    return next(error)
  }
}

async function searchBlogByKeyword(req, res, next) {
  try {
    const searchPhrase = 'pass search phrase here'
    const searchResults = await db
      .find({ description: { $regex: searchPhrase } })
      .sort({ date: -1 })
    res.render('search', {
      results: searchResults,
      pageTitle: `Search Results for "${searchPhrase}"`,
    })
  } catch (error) {}
}

module.export = {
  getBlogDetails,
  getAllBlogs,
  searchBlogByKeyword,
  getRecentBlogs,
}
