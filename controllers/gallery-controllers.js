const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
const database = 'gallery'
const collection = 'images'
const imgPerPage = 6

/**
 * Retrieves count of images stored in db for pagination
 * @returns {Int} totalNumImages
 */
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

/**
 * Retrieves specific number of images ordered by date from db
 * based on selected page number then renders gallery.ejs
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Array} pageImages
 */
async function getImagesByPageNum(req, res, next) {
  const pageNum = req.params.pageNum

  try {
    //Renders 404.ejs for invalid page number = 0
    if (pageNum < 1) {
      console.log('Not a valid page number')
      res.render('404')
      return
    }

    /* Call 'getImagesCount' function to determine
    total number of images in db for pagination
    */
    const totalImages = await getImagesCount()

    //Calculate max number of pages in pagination
    const maxValidPageNum = Math.ceil(totalImages / imgPerPage)
    //console.log(`Max valid page numbers is: ${maxValidPageNum}`)

    //Renders 404.ejs for invalid page number = 0
    if (pageNum > maxValidPageNum) {
      console.log('Not a valid page number')
      res.render('404')
      return
    }

    //Once valid page number confirmed, get images from db
    let connect = await client.connect()
    let pageImages = await connect
      .db(database)
      .collection(collection)
      .find()
      .sort({ id: 1 })
      .skip(pageNum > 1 ? (pageNum - 1) * imgPerPage : 0)
      .limit(imgPerPage)
      .toArray()

    //Calculate previous and next page numbers for pagination
    const prevPageNum = pageNum - 1
    const nextPageNum = prevPageNum + 2

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
