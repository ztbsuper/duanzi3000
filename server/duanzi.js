var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DuanziSchema = new Schema({
    body: String,
    author: String,
    title:String,
    date: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Duanzi',DuanziSchema);

