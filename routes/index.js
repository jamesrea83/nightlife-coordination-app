var express = require('express');
var router = express.Router();
var locationsController = require("../controllers/locationsController");
var userController = require("../controllers/userController");
var apiKey = process.env.APIKEY;
//var dbLogin = require("../auth/dbLogin");



/* GET home page. */
router.get("/", function(req, res, next) {
    var user;
    (req.isAuthenticated() ? user = req.user.doc.name : user = null)
    
    res.render("index", {title: "Nightlife Coordination App", 
                         user: user,
                         apiKey: apiKey
    });
});


/* Get exisiting location data */
router.get("/request", locationsController.get);


/* Visitor increment */
router.post("/", locationsController.increment);


/* Visitor decerement */
router.delete("/", locationsController.decrement);


/* Check for last location */
router.get("/lastlocation", userController.getLastLocation)


/* Update last location */
router.post("/lastlocation", userController.updateLastLocation)



module.exports = router;
