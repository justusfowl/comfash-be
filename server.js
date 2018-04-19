// server.js

// BASE SETUP
// =============================================================================

var path = require('path')
var fs = require('fs');

const config = require('./app/config/config');
const mysqlDb = require('./app/config/db');

const cors = require('cors');

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

var morgan = require('morgan');
var socketioJwt = require('socketio-jwt');

var routes      = require('./app/v01/routes/index.route');

var options = {
	key: fs.readFileSync('comfash.local.key'),
	cert: fs.readFileSync('comfash.local.crt'),
	ca: fs.readFileSync('rootCA.pem')
  };

config.baseDir = __dirname;
config.publicDir = __dirname + "/public";

global.config = config;

var server = require('https').createServer(options, app);

// setup the logger to log http requests
app.use(config.morganMiddleWare);

var io = require('socket.io')(server);

global.io = io;

app.get('/socket', function(req, res){
	res.sendFile(__dirname + '/testIO.html');
});

var socketCtrl = require('./app/v01/socket/socket.controller')

// With socket.io >= 1.0
// =============================================================================
io.use(socketioJwt.authorize({
	secret: config.auth.jwtSecret,
	handshake: true
}));

io.on('connection', socketCtrl.handleConnect);

app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));
app.use(bodyParser.json());

app.use(cors());

app.use('/images', express.static('public/img'));
app.use('/data', express.static('public'));
app.use(express.static('web/dist'));


// REGISTER OUR ROUTES
// =============================================================================
// all of our routes will be prefixed with /api

app.use('/api/v' + config.APIVersion, routes);


// START THE SERVER
// =============================================================================
server.listen(config.port);

console.log('ComfashBE application running on port: ' + config.port);

config.logger.info("comfash started")