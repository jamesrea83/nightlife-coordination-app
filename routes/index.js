var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var user;
    if (req.isAuthenticated()) {
        user = req.user.doc.name;
    } else {
        user = "Not logged in";
    }
  res.render('index', { title: 'Express', user: user});
});

module.exports = router;
