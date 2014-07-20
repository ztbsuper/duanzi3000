// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); 		// call express
var app = express(); 				// define our app using express
var bodyParser = require('body-parser');

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

router.route('/duanzi')
    .post(function (req, res) {
        var error = 0;
        req.body.duanzis.forEach(function (item) {
            var duanzi = new Duanzi();
            duanzi.body = item.body;
            duanzi.author = req.body.author;
            duanzi.save(function (err) {
                if (err) {
                    error = 1;
                    console.log("ERROR : " + err);
                }
            })
        });
        if (error == 1) {
            res.status(500).json({message: 'unknown error'});
        } else {
            res.status(201).json({message: 'created'});
        }
    })
    .get(function (req, res) {
        Duanzi.find(function (error, duanzis) {
            if (error) {
                res.status(500).json({message: "unknown error"});
                console.log("ERROR : " + error);
            } else {
                res.json(duanzis);
            }
        })
    });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);