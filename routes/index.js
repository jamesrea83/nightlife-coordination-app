var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
    var user;
    (req.isAuthenticated() ? user = req.user.doc.name : user = null)
    
    res.render("index", {title: "Nightlife Coordination App", user: user});
});

module.exports = router;
