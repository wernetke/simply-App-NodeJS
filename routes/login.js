const express = require('express');
const fetch = require('node-fetch');
const CryptoJS = require("crypto-js");
const fs = require('fs');
const config = require('../config.json');

const router = express.Router();

//redirect index page
router.get('/', function (req, res) {
    res.render('login',{layout: false});
});


router.post('/', function (req,res){
    let passhash = CryptoJS.MD5(req.body.password).toString();
    let params = {
        u: req.body.username,
        hp: passhash
    };
    let query = Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
    let url = config.urlLogin + query;
    let statusCode;

    fetch(url, { method: 'GET'})
        .then(function (response) {
            statusCode = response.status;
            response.text().then(function (text) {
                let obj = JSON.parse(text);
                if (statusCode === 400 || statusCode === 401) {
                    res.render('login', { layout: false ,errorMessage: obj.error});
                } else {
                let textAdd = "{\"token\": \"" + obj.token + "\", \"groupId\": \"" + obj.groupId + "\", \"seetrusLabel\": \"" + obj.seetrusLabel + "\"}";
                fs.appendFileSync(config.pathTextFile, textAdd + '\n', "UTF-8",{'flags': 'a+'});
                }
                //Create user session
                let sessionUser=req.session;
                sessionUser.userId=obj.userId;
                sessionUser.seetrusLabel=obj.seetrusLabel;
                sessionUser.groupId=obj.groupId;
                res.redirect('/index');
            })
            .catch(error => {
                console.log(error);
            });
        });
});


module.exports = router;
