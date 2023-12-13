const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

const database = 'gallery'
const collection = 'images'

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

//Test functions
//getAllImages()
//getImagesCount()
//getImagesByPageNum(2, 9)
