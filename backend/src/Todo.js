var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const autoIncrementModelID = require('./counter');

const todo = new Schema({
    id: { type: Number, unique: true, min: 1 },
    text: { type: String },
    dueDate: {type:Date},
    position: {type:Number},
    completed: {type:Boolean},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

todo.pre('save', function (next) {
    if (!this.isNew) {
        next();
        return;
    }
    autoIncrementModelID('todos', this, next);
});

module.exports = mongoose.model('Todo', todo);