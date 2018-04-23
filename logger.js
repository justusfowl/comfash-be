
var winston = require('winston');
var morgan = require('morgan');

const { format } = require('winston');
const { combine, timestamp, label, printf } = format;

var fs = require('fs')
var morgan = require('morgan')
var path = require('path')
var rfs = require('rotating-file-stream');

const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
  });

  var winston = require('winston');
  require('winston-daily-rotate-file');

  var transportError = new (winston.transports.DailyRotateFile)({
    filename: 'logs/comfash-be-error-%DATE%.log',
    level : 'error',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });

  var transporCombined = new (winston.transports.DailyRotateFile)({
    filename: 'logs/comfash-be-combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });


const logger = winston.createLogger({
    level: 'info',
    format: combine(
        label({ label: 'comfash-be' }),
        timestamp(),
        myFormat
    ),
    transports: [
    new winston.transports.Console({
        format: winston.format.simple()
        }),
      transportError, 
      transporCombined

    ]
  });

  var sqlTransportError = new (winston.transports.DailyRotateFile)({
    filename: 'logs/sql/sql-comfash-be-error-%DATE%.log',
    level : 'error',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });

  var sqlTransporCombined = new (winston.transports.DailyRotateFile)({
    filename: 'logs/sql/sql-comfash-be-combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });


const sqlLogger = winston.createLogger({
    level: 'info',
    format: combine(
        label({ label: 'comfash-be-sql' }),
        timestamp(),
        myFormat
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
          }),
        sqlTransportError,
        sqlTransporCombined
    ]
  });
  
  
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }

logger.info('Init logger');

// morgan HTTP request middle ware

var logDirectory = path.join(__dirname, 'logs/access')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
})

var morganMiddleWare = morgan('combined', {stream: accessLogStream}); 


module.exports = { logger, sqlLogger, morganMiddleWare }