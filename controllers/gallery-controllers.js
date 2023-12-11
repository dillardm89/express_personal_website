async function getAllImages(req, res, next) {
  try {
    const images = await db.findAll().sort({ date: -1 })
    res.render('gallery', {
      section: 'gallery',
      images: images,
    })
  } catch (error) {
    return next(error)
  }
}

module.export = {
  getAllImages,
}
