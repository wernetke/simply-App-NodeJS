const express = require('express');
const fs = require('fs');
const config = require('../config.json');
const request = require('request');

const router = express.Router();

//redirect index page
router.get('/', function (req, res) {
    res.render('index',{  seetrusLabel: req.session.seetrusLabel,  groupId: req.session.groupId, layout: false});
});
router.post('/', function (req, res) {
    let url = config.urlNext + req.body.groupId + "/next";
    let tokenHeader = undefined;
        fs.readFile(config.pathTextFile, 'utf8', function(err, data){
            let obj = JSON.parse(data);
            tokenHeader = obj.token;
            //make the second call
            const options = {
                'method': 'GET',
                'url': url,
                'headers': {
                    'SeetrusAuthenticationToken': tokenHeader
                }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
                res.render('index',{  seetrusLabel: req.session.seetrusLabel,  groupId: req.session.groupId, status:response.body, layout: false});

            });
        });
});

module.exports = router;