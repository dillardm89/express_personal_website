const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

const database = 'blogs'
const collection = 'posts'

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

getBlogDetails()
