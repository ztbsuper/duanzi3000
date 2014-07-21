var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CollectionSchema = new Schema({
    uuid: String,
    title: String,
    date:{ type: Date, default: Date.now},
    author: {type: String, default: "无名氏"}
});

module.exports = mongoose.model('Collection', CollectionSchema);