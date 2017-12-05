var LocationsModel = require("../models/locationsModel");



exports.increment = function(req, res, next) {
    
    
    var location = new LocationsModel({
        googleID: req.body.googleID,
    })
    

    LocationsModel.findOneAndUpdate(
        { googleID: req.body.googleID },
        { $inc: { visitors: 1 } },
        { upsert: true },
        function(err, data) {
            if (err) console.error(err);
        }
    )


    res.json({ message: "POST successful"})
    
}

exports.decrement = function(req, res, next) {
    
    var location = new LocationsModel({
        googleID: req.body.googleID,
    })
    
    LocationsModel.findOneAndUpdate(
        { googleID: req.body.googleID },
        { $inc: { visitors: -1 } },
        { upsert: true },
        function(err, data) {
            if (err) console.error(err);
        }
    )
    res.json({ message: "DELETE successful"})
}

exports.get = function(req, res, next) {
    LocationsModel.find(function(err, locations) {
            if (err) console.error(err);

            var activeLocations = locations.filter(function(elem) {
                return elem.visitors >= 0;
            })

            res.json(activeLocations);
        })
}





