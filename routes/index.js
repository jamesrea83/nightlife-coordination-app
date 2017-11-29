var express = require('express');
var router = express.Router();

/*
var dbLogin = require("../auth/dbLogin");
var apiKey = dbLogin.apiKey || process.env.APIKEY;
*/


/* GET home page. */
router.get("/", function(req, res, next) {
    var user;
    (req.isAuthenticated() ? user = req.user.doc.name : user = null)
    
    res.render("index", {title: "Nightlife Coordination App", 
                         user: user,
                         apiKey: process.env.APIKEY
    });
});

module.exports = router;
