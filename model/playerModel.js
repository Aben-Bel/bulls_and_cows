const mongoose = require('mongoose');

const { Schema } = mongoose;

const playerModel = new Schema(
  {
    token: { type: String },
    name: { type: String },
    webRTCid: { type: Object },
  },
);

module.exports = mongoose.model('Player', playerModel);
