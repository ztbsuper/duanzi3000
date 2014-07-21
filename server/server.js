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

var guid = require('./guid.js');
var Duanzi = require('./duanzi.js');
var Collection = require('./collection.js');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());

var router = express.Router(); 				// get an instance of the express Router

var port = process.env.PORT || 8080; 		// set our port

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(Date.now() + " [" + req.ip + "] plugged in:" + req.originalUrl);
    next();
});

// ROUTES FOR OUR API
// =============================================================================

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {

    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/collection')
    .post(function (req, res) {
        var error = 0;
        var uuid = guid.guid();
        // validator
        req.body.duanzis.forEach(function (item) {
            var duanzi = new Duanzi();
            var collection = new Collection();
            if (!validator.isLength(item.body.trim(), 0, 1024)) {
                return;
            }
            duanzi.body = item.body;
            collection.author = req.body.author.trim() == "" ? duanzi.author : req.body.author.trim();
            collection.title = req.body.title.trim() == "" ? null : req.body.title.trim();
            duanzi.uuid = uuid;
            collection.uuid = uuid;
            duanzi.save(function (error) {
                if (error) {
                    error = 1;
                    console.log("ERROR : " + error);
                }
            });
            collection.save(function (error) {
                if (error) {
                    error = 1;
                    console.log("ERROR : " + error);
                }
            });
        });
        if (error == 1) {
            res.status(500).json({message: 'unknown error'});
        } else {
            res.status(201).json({message: 'created'});
        }

    })
    .get(function (req, res) {
        Collection.find(function (error, collections) {
            if (error) {
                res.status(500).json({message: 'unknown error'});
                console.log(error);
            } else {
                res.status(200).json(collections);
            }
        })
    });

router.route('/collection/:uuid')
    .get(function (req, res) {
        console.log("need find uuid: " + req.params.uuid);
        Duanzi.find({"uuid": req.params.uuid}, function (error, duanzis) {
            if (error) {
                res.status(500).json({message: "unknown error"});
                console.log("ERROR:" + error);
            } else {
                res.json(duanzis);
            }
        })
    });
router.route('/count')
    .get(function (req, res) {
        Duanzi.count(function (error, count) {
            if (error) {
                res.status(500).json({message: "unknown error"});
                console.log("ERROR:" + error);
            } else {
                res.json(count);
            }
        });
    });


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);