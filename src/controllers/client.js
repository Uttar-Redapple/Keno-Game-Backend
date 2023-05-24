const response = require('./../libs/responseLib')
const check = require('../libs/checkLib')
const appConfig = require('../../config/appConfig');
const time = require('../libs/timeLib');
const otpLib = require('../libs/otpLib');
const notification = require('../libs/notificationLib');
const { v4: uuidv4 } = require('uuid');
const tokenLib = require('../libs/tokenLib');
const passwordLib = require('../libs/passwordLib');
const  clientModel = require('../models/Clientt');


let login = async(req, res) => {

    try {
        console.log('body ', req.body);
        let finduser = await UserModel.findOne({$and:[{ event_id: req.body.event_id },{ username: req.body.username }]}).select('-__v -_id').lean();
        let eventDetails = await EventModel.findOne({ _id: finduser.event_id }).select('-__v -_id').lean();
        console.log('eventDetails ------------------>', eventDetails);

        if (check.isEmpty(finduser)) {
            res.status(404);
            throw new Error('User not Registered!');
        };
        if (!time.checkCurrDateRange(eventDetails.start_date, eventDetails.end_date)) {
            res.status(412);
            throw new Error('Event is Not Active!');
        }
        if (await passwordLib.verify(req.body.password, finduser.password)) {
            console.log('verified!');
            if ((finduser.user_type != 3) || (!finduser.is_active)) {
                res.status(401);
                throw new Error('Authorization Failed!');
            } else {
                let payload = {
                    lang: finduser.lang,
                    exp: finduser.exp,
                    user_type: finduser.user_type,
                    token: await tokenLib.generateToken(finduser)
                };
                let apiResponse = response.generate(false, 'logged in!', payload);
                res.status(200).send(apiResponse);
            }
        } else {
            res.status(401);
            throw new Error('incorrect password!');
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.send(apiResponse);
    }
}


let getClient = async(req, res) => {
    try {
            let clientList = await clientModel.find().select('-__v').lean();

            console.log('client list', clientList);
            
            let apiResponse = response.generate(false, 'found Event-list!', respArr);
            res.status(200).send(apiResponse);
        }
     catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.status(400).send(apiResponse);
    }
}
module.exports = {
    getClient : getClient,
    login: login

}