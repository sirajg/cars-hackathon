/** author : siraj ghaffar **/

// set up ========================
    var http = require('http');                     // mongoose for mongodb
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var request = require('request');

    // configuration =================

    mongoose.connect('mongodb://mongo:27017');

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    // define model =================
    var Car = mongoose.model('Car', {
        Make : String,
        Model : String,
        Year : String,
        Email : String,
        PhoneNumber : String,
        Price : String,
        Mileage : String,
        Notes : String
    });
    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");

    // routes ======================================================================

        // api ---------------------------------------------------------------------
        // get all cars
        app.get('/api/cars', function(req, res) {

            // use mongoose to get all cars in the database
            Car.find(function(err, cars) {

                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                if (err)
                    res.send(err)

                res.json(cars); // return all cars in JSON format
            });
        });

// request('http://api.edmunds.com/api/vehicle/v2/makes?fmt=json&api_key=9qp8hpcnycy8sdgr8r26kffk',

        app.get('/api/AvailableMakes', function(req, res) {
            console.log("Calling...");
            request('http://api.edmunds.com/api/vehicle/v2/makes?fmt=json&api_key=9qp8hpcnycy8sdgr8r26kffk',
                    function (error, response, body) {
                if (error)
                    res.send(error);
                else {
                    //if (response.statusCode == 200) {
                    console.log("*******");
                    console.log(body) // Print the google web page.
                    res.json(body); // return all cars in JSON format
                    //}
                }
                })
        });

    // create car and send back all cars after creation
    app.post('/api/cars', function(req, res) {

        // create a car, information comes from AJAX request from Angular
        Car.create({
            Make : req.body.Make,
            Model : req.body.Model,
            Year : req.body.Year,
            Email : req.body.Email,
            PhoneNumber : req.body.PhoneNumber,
            Price : req.body.Price,
            Mileage : req.body.Mileage,
            Zipcode : req.body.Zipcode,
            Notes: req.body.Notes,
            done : false
        }, function(err, car) {
            if (err)
                res.send(err);

            // get and return all the cars after you create another
            Car.find(function(err, cars) {
                if (err)
                    res.send(err)
                res.json(cars);
            });
        });

    });

