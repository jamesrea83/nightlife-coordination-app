var mongoose = require("mongoose");

var NightlifeUserSchema = new mongoose.Schema({
    name: String,
    userid: String,
    updated_at: { type: Date, default: Date.now },
})

NightlifeUserSchema.statics.findOrCreate = require("find-or-create");

module.exports = mongoose.model("NightlifeUser", NightlifeUserSchema);