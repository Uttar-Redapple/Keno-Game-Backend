const dbConfig = require('./dbConfig.json')[process.env.NODE_ENV]
let admin = require('firebase-admin');
const Queue = require("../src/algo/dataStructure");

// Data structures
const queue = new Queue();
let AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    apiVersion: '2010-03-31'
});
// const serviceAccount = require("./heartsfantasy-5558a-firebase-adminsdk-erxkq-1a7ace7378.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });
const events = require('events');
const eventEmitter = new events.EventEmitter();
const rngClass = require('../src/algo/rng');
const pRNG = new rngClass();


// const rzp = require('razorpay');
// const razp = new rzp({
//     key_id: process.env.RAZORPAY_KEY,
//     key_secret: process.env.RAZORPAY_SECRET
// });
let appConfig = {};

appConfig.redis_url = dbConfig.redis_url;
//appConfig.mq_url = dbConfig.mq_url;
appConfig.eventEmitter = eventEmitter;
appConfig.allowedCorsOrigin = "*";
appConfig.ticketPrice = 20,
    appConfig.apiVersion = '/api/v1';
appConfig.socketNameSpace = 'wsio';
appConfig.sessionExpTime = (120 * 120);
appConfig.urlExpTime = 60;
appConfig.otpLinkExpTime = (3);
appConfig.pRNG = pRNG;
appConfig.AWS = AWS;
// appConfig.razp = razp;
// appConfig.admin = admin;
// appConfig.db = {
//     uri: `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}?authSource=admin`
// };


appConfig.baseUrl = 'http://staging.redappletech.com:5000/';
appConfig.queue = queue;

module.exports = appConfig;