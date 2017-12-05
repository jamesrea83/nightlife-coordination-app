var UsersModel = require("../models/User");


exports.getLastLocation = function(req, res, next) {
    UsersModel.findOne({userid: req.user.doc.userid}, function(err, user) {
        if (err) console.error(err);
        res.json(user.lastLocation);
        
    })
}




exports.updateLastLocation = function(req, res, next) {
    console.log(req.body.lastlocation);
    UsersModel.findOneAndUpdate(
        { userid: req.user.doc.userid },
        { lastLocation: req.body.lastlocation },
        function(err, data) {
            if (err) console.error(err);
        }
    )
}

