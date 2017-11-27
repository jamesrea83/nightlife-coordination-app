var mongoose = require("mongoose");

var locationsSchema = mongoose.Schema({
    googleID: String,
    visitors: Number
})

var LocationsModel = mongoose.model("nightlife-app-locations", locationsSchema);

module.exports = LocationsModel;