var db = require('../models')
var fs = require('fs');

module.exports.deliverUserFlag = function (req, res, next) {
    if(!req.body.flag) {
        return res.status(400).send();
    }
    return db.User.create({
        email: req.body.flagId,
        password: req.body.flag,
        name: req.body.hostName,
        login: req.body.flagId
    }).then(function () {
        console.log('Created user!');
        return res.status(200).send();
    }).catch(function (err) {
        console.log('Create user failed!');
        return res.status(400).send();
    })
}

module.exports.deliverFileFlag = function (req, res, next) {
    var fileContent = JSON.stringify({
        flagId: req.body.flagId,
        flag: req.body.flag
    })
    fs.writeFile('./flags/' + req.body.flagId + '.txt', fileContent, function (err) {
        if (err) {
            console.log('Write file failed');
        };
    });
    res.status(200).send();
}

module.exports.verifyUserFlag = function (req, res, next) {
    return db.User.find({ where: {   
        email: req.body.flagId,
        password: req.body.flag,
        login: req.body.flagId
    }}).then(user=>{
        if(user && user.password === req.body.flag){
            return res.status(200).send();
        }
        return next();
    })
}

module.exports.verifyFileFlag = function (req, res, next) {
    const isFileExist = fs.existsSync('./flags/'  +req.body.flagId + '.txt');
    return isFileExist ? res.status(200).send() : res.status(404).send();
}

