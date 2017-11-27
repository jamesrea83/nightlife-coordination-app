var express = require("express");
var router = express.Router();
var locationsController = require("../controllers/locationsController");

/* GET MAIN ROUTER */
router.get("/", function(req, res, next) {
    var user;
    if (req.isAuthenticated()) {
        user = req.user.doc.name;
    } else {
        user = null;
    }
    res.render("main", {
        title: "Nightlife App",
        stuff: "stuff is working!",
        user: user
    });
})


/* Get exisiting location data */
router.get("/request", locationsController.get);


/* Visitor increment */
router.post("/", locationsController.increment);


/* Visitor decerement */
router.delete("/", locationsController.decrement);

module.exports = router;