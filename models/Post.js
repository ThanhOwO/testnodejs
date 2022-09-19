const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true},
    description: { type: String},
    url: { type: String},
    status: { type: String, enum: ['To Learn', 'Learning', 'Learned']},
    user: {type: Schema.ObjectId, ref: 'users'}
})

module.exports = mongoose.model('posts', PostSchema)