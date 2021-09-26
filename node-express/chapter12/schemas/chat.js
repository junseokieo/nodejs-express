const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const chatSchema = new Schema({
  room: {
    type: ObjectId,
    required: true,
    ref: 'Room',
  },
  user: {
    type: String,
    required: true,
  },
  // chat or image 둘 중 하나만 보낸다.
  chat: String,
  gif: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Chat', chatSchema);
