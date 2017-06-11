var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  body: {
    type: String,
    trim: true,
    required: true
  },
  created: {
  	type: Date,
  	default: Date.now
  }
});

var Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
