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
var cheatCode = '1jcsxdl';
mongoose.connect(mongo_url + "/" + mongo_db);

var guid = require('./guid.js');
var Duanzi = require('./duanzi.js');
var Collection = require('./collection.js');
var strip_tags = require('./strip_tags.js');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());

var router = express.Router(); 				// get an instance of the express Router

var port = process.env.PORT || 8080; 		// set our port

router.use(function (req, res, next) {
//    res.header("Access-Control-Allow-Origin", "http://3kduanzi.com,http://duanzi.yishixingtai.net,http://localhost:8100");
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Cache-Control", "no-cache");
    res.header("Access-Control-Allow-Methods", "GET,PUT,DELETE,POST");
    res.header("Access-Control-Allow-Headers", "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, " +
        "Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With,cheatCode");
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
        // validator
        if (!validator.isLength(req.body.duanzis, 0) ||
            typeof req.body.duanzis == 'undefined') {
            res.status(500).json({message: "unknown error"});
            return;
        }
        var collection = new Collection();

        collection.author = strip_tags.strip_tags(req.body.author.trim()) == "" ? null : strip_tags.strip_tags(req.body.author.trim());
        collection.title = strip_tags.strip_tags(req.body.title.trim()) == "" ? null : strip_tags.strip_tags(req.body.title.trim());
        collection.count = req.body.duanzis.length;
        collection.save(function (error, saved) {
            if (error) {
                error = 1;
                console.log("ERROR : " + error);
            }
            collection = saved;
        });

        req.body.duanzis.forEach(function (item) {
            var duanzi = new Duanzi();
            if (!validator.isLength(strip_tags.strip_tags(item).trim(), 0, 1024)) {
                return;
            }
            duanzi.body = strip_tags.strip_tags(item).trim();
            duanzi.collectionid = collection._id;
            duanzi.save(function (error) {
                if (error) {
                    error = 1;
                    console.log("ERROR : " + error);
                }
            });
        });
        if (error == 1) {
            res.status(500).json({message: 'unknown error'});
        } else {
            res.status(201).json({message: 'created', collectionid: collection._id});
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

router.route('/collection/:collectionid')
    .get(function (req, res) {
        Duanzi.find({collectionid: req.params.collectionid}, function (error, duanzis) {
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

router.route('/delduanzi/:code')
    .post(function (req, res) {
        if (req.params.code == cheatCode) {
            var collectionID = req.body[0].collectionid;
            req.body.forEach(function (duanzi) {
                Duanzi.findOneAndRemove({_id: duanzi._id}, function (error) {
                    console.log("delete duanzi:" + duanzi._id);
                    if (error) {
                        console.log("ERROR:" + error);
                    }
                });
            });
            Duanzi.find({collectionid: collectionID}, function (error, result) {
                console.log("found duanzis: " + result);
                if (error) {
                    console.log("ERROR:" + error);
                }
                if (result.length == 0) {
                    Collection.findOneAndRemove({_id: collectionID}, function (error) {
                        console.log("remove :" + collectionID);
                        if (error) {
                            console.log("ERROR:" + error);
                        }
                    });
                } else {
                    Collection.findByIdAndUpdate(collectionID, {count: result.length}, function (error, data) {
                        console.log("update " + data);
                    });
                }
            });

            res.status(200).json({message: "deleted"});

        } else {
            res.status(500).json({message: "unknown error"});
            console.log(Date.now() + " [" + req.ip + "] try to using " + req.params.code + " to hack:" + req.originalUrl);
        }
    })
    .get(function (req, res) {
        Duanzi.findById(req.params.code, function (error, duanzi) {
            if (error) {
                res.status(500).json({message: "unknown error"});
                console.log(error);
            } else {
                res.status(200).json(duanzi);
            }
        })
    });

router.route('/thumbsup/:code')
    .get(function (req, res) {
        Duanzi.findById(req.params.code, function (error, duanzi) {
            duanzi.thumbsup = duanzi.thumbsup + 1;
            duanzi.save(function (error) {
                if (error) {
                    res.status(500).json({message: "unknown error"});
                } else {
                    res.status(201).json({message: "accept"});
                }
            });
        });
    });
router.route('/thumbsdown/:code')
    .get(function (req, res) {
        Duanzi.findById(req.params.code, function (error, duanzi) {
            duanzi.thumbsdown = duanzi.thumbsdown + 1;
            duanzi.save(function (error) {
                if (error) {
                    res.status(500).json({message: "unknown error"});
                } else {
                    res.status(201).json({message: "accept"});
                }
            });
        });
    });
router.route('/bulk')
    .post(function (req, res) {
        Duanzi.find({'_id': {$in: req.body}}, function (error, duanzis) {
            if (error) {
                console.log(error);
                res.status(500).json({message: "unknown error"});
            } else {
                res.status(200).json(duanzis);
            }
        });
    });

var perPage = 10;
router.route('/rank/:page')
    .get(function (req, res) {
        var pageNumber = req.params.page == null ? 0 : req.params.page;
        var start = (req.params.page - 1) * perPage;
        Duanzi.find({}, null, {skip: start, limit: perPage, sort: {thumbsup: -1}}, function (error, duanzis) {
            if (error) {
                res.status(500).json({message: "unknown error"});
            } else {
                res.status(200).json(duanzis);
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