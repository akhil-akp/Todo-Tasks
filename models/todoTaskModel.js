const mongoose = require('mongoose');
const slugify = require('slugify');
const todoTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: [true, 'A todo task must have a title!!'],
    minlength: [5, 'A user  name must have at least 2 characters!!'],
    maxlength: [30, 'A user  name can contains maximusm 25 characters!!'],
  },
  description: {
    type: String,
    required: [true, 'A todo task must have a description!!'],
  },
  image: {
    type: String,
    default: 'default.jpg',
  },
  targetDate: {
    type: Date,
    default: Date.now() + 15 * 24 * 60 * 60 * 1000,
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: String,
});

todoTaskSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const TodoTask = mongoose.model('TodoTask', todoTaskSchema);
module.exports = TodoTask;
