const { MongoClient } = require('mongodb')
const { type } = require('os')
const { nextTick } = require('process')

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

const database = 'gallery'
const collection = 'images'

const imgPerPage = 9

async function getImagesCount() {
  try {
    let connect = await client.connect()
    let totalNumImages = await connect
      .db(database)
      .collection(collection)
      .countDocuments()

    //console.log(`Found ${totalNumImages} Gallery Images.`)
    return totalNumImages
  } catch (error) {
    console.log(error)
  } finally {
    await client.close()
  }
}

async function getImagesByPageNum(req, res, next) {
  const pageNum = req.params.pageNum

  try {
    if (pageNum < 1) {
      console.log('Not a valid page number')
      res.render('404')
      return
    }

    const prevPageNum = pageNum - 1

    const totalImages = await getImagesCount()

    const maxValidPageNum = Math.ceil(totalImages / imgPerPage)
    //console.log(`Max valid page numbers is: ${maxValidPageNum}`)

    if (pageNum > maxValidPageNum) {
      console.log('Not a valid page number')
      res.render('404')
      return
    }

    const nextPageNum = prevPageNum + 2

    let connect = await client.connect()
    let pageImages = await connect
      .db(database)
      .collection(collection)
      .find()
      .sort({ id: 1 })
      .skip(pageNum > 1 ? (pageNum - 1) * imgPerPage : 0)
      .limit(imgPerPage)
      .toArray()

    //console.log(`Found ${pageImages.length} Gallery Images.`)
    res.render('gallery', {
      images: pageImages,
      currentPageNum: pageNum,
      nextPageNum: nextPageNum,
      prevPageNum: prevPageNum,
      maxPageNum: maxValidPageNum,
    })
  } catch (error) {
    console.log(error)
  } finally {
    await client.close()
  }
}

module.exports = {
  getImagesByPageNum,
}
