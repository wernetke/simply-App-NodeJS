const express = require('express');
const router = express.Router();

//redirect index page
router.get('/', function (req, res) {

    res.render('index');
});

module.exports = router;