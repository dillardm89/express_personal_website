const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
const database = 'blogs'
const collection = 'posts'

/**
 * One time script to create index of Blog db for Text Search function
 * db will auto update index when entries are added / updated
 * @returns {Object} confirmation of index creation
 */
async function indexAllBlogs() {
  try {
    let connect = await client.connect()
    let blogIndex = await connect
      .db(database)
      .collection(collection)
      .createIndex({
        title: 'text',
        author: 'text',
        text: 'text',
      })
  } catch (error) {
    console.log(error)
  } finally {
    await client.close()
  }
}

//indexAllBlogs()
