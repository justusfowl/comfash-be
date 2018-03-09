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

var socketioJwt = require('socketio-jwt');

var routes      = require('./app/v01/routes/index.route');

var fs = require('fs');
var options = {
	key: fs.readFileSync('comfash.local.key'),
	cert: fs.readFileSync('comfash.local.crt'),
	ca: fs.readFileSync('rootCA.pem')
  };

config.baseDir = __dirname;

var server = require('https').createServer(options, app);

var io = require('socket.io')(server);

global.io = io;

/*
const multer = require('multer');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, __dirname + '/uploads')
	},
	filename: function (req, file, cb) {
	  cb(null, file.fieldname + '-' + Date.now() + ".mp4")
	}
  })
  
var upload = multer({ storage: storage })

app.post('/upload', upload.single('file'), (req, res) => {
	res.json({"val" : "ok"});
  });
*/

// middleware attachment of io instance to request
app.use(function(req,res,next){
	req.io = io;
	next();
});

app.get('/socket', function(req, res){
	res.sendFile(__dirname + '/testIO.html');
});

var socketCtrl = require('./app/v01/socket/socket.controller')

//// With socket.io >= 1.0 //// 
io.use(socketioJwt.authorize({
	secret: config.auth.jwtSecret,
	handshake: true
  }));


  /*
io.on('connection', function (socket) {

	// in socket.io 1.0 
	console.log('hello! ', socket.decoded_token.userId);

	socket.emit("msg", 'hello! ', socket.decoded_token.userId)
})
*/
io.on('connection', socketCtrl.handleConnect);




// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser({limit: '50mb'}));

app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));
app.use(bodyParser.json());

app.use(cors());

app.use('/images', express.static('public/img'));
app.use(express.static('public'));

var port = config.PORT || 9999;


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api/v' + config.APIVersion, routes);



// START THE SERVER
// =============================================================================
server.listen(port);

console.log('ComfashBE application running on port: ' + port);