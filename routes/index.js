var express = require('express');
var router = express.Router();
const controller=require('../controllers/Send');
var multer = require("multer");
var upload = multer({ dest: 'uploads/' })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/SendMail',upload.single("img"), controller.SendMail);

module.exports = router;
