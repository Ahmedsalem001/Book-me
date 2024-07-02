const express = require('express');
const multer = require('multer');
const DiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    const uniqueName = `user-${Date.now()}.${ext}`
    cb(null, uniqueName) 
  }
})
const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split('/')[0];
  if (imageType === 'image') {
    cb(null, true);
  } else {
    cb(appError.create("the file must be an image", 400), false);
  }
}

const upload = multer({ storage: DiskStorage, fileFilter });
const router = express.Router();

const {
  getbooks,
  getbook,
  addbook,
  updatebook,
  deletebook
} = require("../controllers/books-controller");
const validationSchema = require('../middlewares/validationSchema');

router.route('/')
  .get(getbooks)
  .post(validationSchema(), upload.single("bookimg"), addbook)

router.route('/:id')
  .get(getbook)
  .patch(updatebook)
  .delete(deletebook)

module.exports = router;
