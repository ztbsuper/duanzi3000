var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DuanziSchema = new Schema({
    body: String,
    uuid: String
});

module.exports = mongoose.model('Duanzi', DuanziSchema);

