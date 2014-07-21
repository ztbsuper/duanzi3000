var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DuanziSchema = new Schema({
    body: String,
    collectionid: String,
    thumbsup: {type: Number, default: 0},
    thumbsdown: {type: Number, default: 0}
});

module.exports = mongoose.model('Duanzi', DuanziSchema);

