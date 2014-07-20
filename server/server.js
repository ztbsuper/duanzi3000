// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); 		// call express
var app = express(); 				// define our app using express
var bodyParser = require('body-parser');
// validator
var validator = require('validator');
// mongo db configurations
var mongo_url = "mongodb://localhost:27017";
var mongo_db = "3kduanzi";
// mongo db connection
var mongoose = require('mongoose');
mongoose.connect(mongo_url + "/" + mongo_db);

var Duanzi = require('./duanzi.js');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());

var router = express.Router(); 				// get an instance of the express Router

var port = process.env.PORT || 8080; 		// set our port

router.use(function (req, res, next) {
    console.log("some guys plugged in");
    next();
});

// ROUTES FOR OUR API
// =============================================================================

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/set')
    .post(function (req, res) {
        var error = 0;
        if(validator.isJSON(req.body) && validator.isLength(req.body.title,4)){
            req.body.duanzis.forEach(function (item) {
                var duanzi = new Duanzi();
                duanzi.body = item.body;
                duanzi.title = req.body.title;
                duanzi.author = req.body.author == ""? "无名氏": req.body.title;
                duanzi.save(function (error) {
                    if (error) {
                        error = 1;
                        console.log("ERROR : " + error);
                    }
                })
            });
            if (error == 1) {
                res.status(500).json({message: 'unknown error'});
            } else {
                res.status(201).json({message: 'created'});
            }
        }else{
            res.status(400).json({message:'illeaged'});
        }

    });


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);