const mongoose = require('mongoose');

const booksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2
  },
  desc: {
    type: String,
    required: true,
    minlength: 2
  },
  bookimg: {
    type: String,
    required: true,
    
  }
})

module.exports = mongoose.model('Book', booksSchema);