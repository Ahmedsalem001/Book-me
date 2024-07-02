const { validationResult } = require("express-validator");
const Book = require("../models/books.model")
const asyncWrapper = require('../middlewares/asyncWraper');
const AppError = require("../utils/appError");
const [SUCCESS, FAIL, ERROR] = ["SUCCESS", "FAIL", "ERROR"];

const getbooks = asyncWrapper(
  async (req, res) => {
    const query = req.query;
    const limit = query.limit || 3;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const books = await Book.find({}, { "__v": false }).limit(limit).skip(skip);
    return res.json({ status: SUCCESS, data: books });
  });

const getbook = asyncWrapper(
  async (req, res, next) => {
    const book = await Book.findById(req.params.id,{ "__v": false })
    if (!book) {
      const error = AppError.create("book not found", 404, FAIL)
      return next(error)
    }
    return res.status(200).json({ status: SUCCESS, data: book });
  })

const addbook = asyncWrapper(async (req, res, next) => {
  const { title, desc } = req.body;
  const errors = validationResult(req.body);
  console.log(errors);
  if (!errors.isEmpty()) {
    const error = AppError.create(errors, 400, FAIL);
    return next(error);  }
  const newbook = new Book(
    {
      title,
      desc,
      bookimg: req.file.filename
    }
  )
  await newbook.save();
  return res.status(201).json({ status: SUCCESS, data: newbook });
})

const updatebook = asyncWrapper(async (req, res) => {
  const id = req.params.id;
  console.log(req.body);
    const updatebook = await Book.updateOne({ _id: id }, { $set: { ...req.body } })
    return res.status(200).json({ status: SUCCESS, data: updatebook });
})

const deletebook = asyncWrapper(async (req, res) => {
  const data = await Book.deleteOne({ _id: req.params.id })
  res.status(200).json({ status: SUCCESS, data: null });
})

module.exports = {
  getbooks,
  getbook,
  addbook,
  updatebook,
  deletebook
}