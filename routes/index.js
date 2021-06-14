var express = require('express');
var router = express.Router();
const controller=require('../controllers/Send');
var multer = require("multer");
var path = require('path')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})
var upload = multer({ dest: 'uploads/',storage:storage })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/SendMail',upload.single("img"), controller.SendMail);

module.exports = router;
