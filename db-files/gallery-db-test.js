const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
const database = 'gallery'
const collection = 'images'

/**
 * Test function to retrieve all images from db
 * @returns {Array}
 */
async function getAllImages() {
  try {
    let connect = await client.connect()
    let allImages = await connect
      .db(database)
      .collection(collection)
      .find()
      .toArray()

    console.log(`Found ${allImages.length} Gallery Images.`)
  } catch (error) {
    console.log(error)
  } finally {
    await client.close()
  }
}

/**
 * Test function to get count of images in db
 * @returns {Int} totalNumImages
 */
async function getImagesCount() {
  try {
    let connect = await client.connect()
    let totalNumImages = await connect
      .db(database)
      .collection(collection)
      .countDocuments()

    console.log(`Found ${totalNumImages} Gallery Images.`)
    //return totalNumImages
  } catch (error) {
    console.log(error)
  } finally {
    await client.close()
  }
}

/**
 * Test function to retrieve specific number of images
 * ordered by date from db based on selected page number
 * @param {Int} pageNum
 * @param {Int} imgPerPage
 * @returns {Array} pageImages
 */
async function getImagesByPageNum(pageNum, imgPerPage) {
  try {
    let connect = await client.connect()
    let pageImages = await connect
      .db(database)
      .collection(collection)
      .find()
      .sort({ id: 1 })
      .skip(pageNum > 1 ? (pageNum - 1) * imgPerPage : 0)
      .limit(imgPerPage)
      .toArray()

    console.log(`Found ${pageImages.length} Gallery Images.`)
    console.log(pageImages)
  } catch (error) {
    console.log(error)
  } finally {
    await client.close()
  }
}

//Call test functions
//getAllImages()
//getImagesCount()
//getImagesByPageNum(2, 9)
