var path = require('path')
var fs = require('fs');
var cors = require('cors');
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var socketioJwt = require('socketio-jwt');
var http = require('http');

var config = require('./app/config/config');
var routes = require('./app/v01/routes/index.route');
var socketCtrl = require('./app/v01/socket/socket.controller');

// TODO: Deploy via NGIX reverse proxy

// load SSL certificates and root CA

var options = {
	key: fs.readFileSync(config.https.key),
	cert: fs.readFileSync(config.https.crt),
	ca: fs.readFileSync(config.https.ca)
  };

// append working directory for later reference (e.g. storage of images and files)
config.baseDir = __dirname;
config.publicDir = __dirname + "/public";

// make config available throughout the application
global.config = config;

// setup socket for inApp communication
var io = require('socket.io')(server);
global.io = io;

// With socket.io >= 1.0, implement authorization
io.use(socketioJwt.authorize({
	secret: config.auth.jwtSecret,
	handshake: true
}));
io.on('connection', socketCtrl.handleConnect);

var server = require('https').createServer(options, app);

// setup the logger to log http requests
app.use(config.morganMiddleWare);


// setup web server
app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));
app.use(bodyParser.json( {limit: '50mb', extended: true}));
app.use(cors());

// Static content 

app.use('/images', express.static('public/img'));
app.use('/data', express.static('public'));
app.use(express.static('web/dist'));


// Register routes

app.use('/api/v' + config.APIVersion, routes);

// Catch all other routes and return the index file to make angular handle the respective frontend request
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'web/dist/index.html'));
});


// Start the server
server.listen(config.port);

config.logger.info('ComfashBE application running on port: ' + config.port);

// Redirect from http port 80 to https
// TODO: shift to NGIX
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + ":" + config.port + req.url });
    res.end();
}).listen(80);


config.logger.info("comfash started")