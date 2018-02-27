// server.js

// BASE SETUP
// =============================================================================

// call the packages we need


const config = require('./app/config/config');
const mysqlDb = require('./app/config/db');

const cors = require('cors');

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var routes      = require('./app/v01/routes/index.route');


const multer = require('multer');
const fileType = require('file-type');
const fs = require('fs');

const uuidv1 = require('uuid/v1');
// uuidv1(); // ⇨ 'f64f2940-fae4-11e7-8c5f-ef356f279131'

let newUUID = uuidv1(); 

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());

app.use(cors());

app.use('/images', express.static('public/img'));
app.use(express.static('public'));

var port = config.PORT || 9999;

//var mongoose = require('mongoose');
//mongoose.connect('mongodb://192.0.0.115/cfdata');


var testObj = {
    "name" : "DINNER", 
    "authorId" : ("5a8d2e78e631c0ef52a3956f"), 
    "description" : "Burt is a Bear.", 
    "collectionCreated" : "2018-02-21T15:48:46.076+0000", 
    "sessions" : [
       {
			"_id" : "5a8d94de0d626c50d90384fb", 
			"images" : [
			{
				"_id" : "5a8d94de0d626c50d90384fc", 
				"path" : "http://cl18:9999/img/1.jpg", 
				"height" : 2730.0, 
				"width" : 4096.0, 
				"comments" : [
					{
						"commentText" : "testausDB", 
						"yRatio" : 0.53, 
						"xRatio" : 0.5
					}, 
					{
						"commentText" : "testausDB", 
						"yRatio" : 0.53, 
						"xRatio" : 0.5
					}
				]
			}, 
			{
				"_id" : "5a8d94de0d626c50d90384fd", 
				"path" : "http://cl18:9999/img/2.jpg", 
				"height" : 5092.0, 
				"width" : 3395.0, 
				"comments" : [
					{
						"commentText" : "asdasd", 
						"yRatio" : 0.53, 
						"xRatio" : 0.5
					}
				]
			}
	]
}
    ]
}; 




// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api/v' + config.APIVersion, routes);

// START THE SERVER
// =============================================================================
app.listen(port);

console.log('ComfashBE application running on port: ' + port);