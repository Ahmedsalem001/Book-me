require('dotenv').config();

const cors = require('cors')

const express = require('express');

const path = require('node:path');

const app = express();

app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

const port = 3001;

const mongoose = require('mongoose');

const url = process.env.MONGO_URL;

const [SUCCESS, FAIL, ERROR] = ["SUCCESS", "FAIL", "ERROR"];

mongoose.connect(url).then(console.log("mongodb connected successfully"));

app.use(cors())

app.use(express.json());

const booksRauter = require('./routes/books.route');


app.use('/api/books', booksRauter)

// global middleware for handling not found router errors

app.all('*', (req, res, next) => {
  return res.status(404).json(({ status: ERROR, message: "Not Found", code: 404 }))
})

// global error handler

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({ status: error.statusText || ERROR, message: error.message , code: error.code || 500 ,data : null})
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})