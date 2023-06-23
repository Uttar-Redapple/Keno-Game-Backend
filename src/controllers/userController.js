const response = require('./../libs/responseLib')
const check = require('../libs/checkLib')
const appConfig = require('../../config/appConfig');
const time = require('../libs/timeLib');
const otpLib = require('../libs/otpLib');
const notification = require('../libs/notificationLib');
const { v4: uuidv4 } = require('uuid');
const tokenLib = require('../libs/tokenLib');
const passwordLib = require('../libs/passwordLib');
const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const LanguageModel = mongoose.model('Language');
const EventModel = mongoose.model('Event');
const uploadLib = require('../libs/uploadLib');
const timeLib = require('../libs/timeLib');


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

let adminLogin = async(req, res) => {
    try {
        console.log('body ', req.body);
        let finduser = await UserModel.findOne({ username: req.body.username }).select('-__v -_id').lean();
        console.log('User Details ', finduser);
        if (check.isEmpty(finduser)) {
            res.status(404);
            throw new Error('User not Registered!');
        };
        if (await passwordLib.verify(req.body.password, finduser.password)) {
            console.log('verified!');
            if (finduser.user_type == 3) {
                res.status(401);
                throw new Error('Authorization Failed!');
            } else {
                let payload = {
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

let register = async(req, res) => {
    //models
    try {
        let eventDetails = await EventModel.findOne({ _id: req.body.event_id }).select('-__v -_id').lean();
        console.log('eventDetails ------------------>', eventDetails);

        if (check.isEmpty(eventDetails)) {
            res.status(404);
            throw new Error('Invalid event ID!');
        };
        let finduser = await UserModel.findOne({$and:[{ event_id: req.body.event_id },{ $or: [{ username: req.body.username }, { mobile: req.body.mobile }, { email: req.body.email }] }]}).lean();
        let newUser = new UserModel({
            user_id: uuidv4(),
            event_id: req.body.event_id,
            username: req.body.username,
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            mobile: req.body.mobile,
            lang: req.body.lang,
            genre: req.body.genre,
            exp: req.body.exp,
            password: await passwordLib.hash(req.body.password),
            user_type: req.body.user_type,
            created_by: req.body.username,
            created_on: time.now()
        });
        if (check.isEmpty(finduser)) {

            let payload = (await newUser.save()).toObject();

            delete payload.__v;
            delete payload._id;
            delete payload.password;
            delete payload.lang;
            delete payload.exp;
            let apiResponse = response.generate(false, 'Created new user', payload);
            res.status(200).send(apiResponse);
        } else {
            if(finduser.event_id == req.body.event_id){
                res.status(412);
                throw new Error('User Already Registered For this Event!');
            }else{
                let payload = (await newUser.save()).toObject();

                delete payload.__v;
                delete payload._id;
                delete payload.password;
                delete payload.lang;
                delete payload.exp;
                let apiResponse = response.generate(false, 'Created new user', payload);
                res.status(200).send(apiResponse);
            }

        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.send(apiResponse);
    }
}

let adminUserRegister = async(req, res) => {
    //models
    try {
        let eventDetails = await EventModel.findOne({ _id: req.body.event_id }).select('-__v -_id').lean();
        console.log('eventDetails ------------------>', eventDetails);

        if (check.isEmpty(eventDetails)) {
            res.status(404);
            throw new Error('Invalid event ID!');
        };
        let finduser = await UserModel.findOne({$and:[{ event_id: req.body.event_id },{ $or: [{ username: req.body.username }, { mobile: req.body.mobile }, { email: req.body.email }] }]}).lean();
        let newUser = new UserModel({
            user_id: uuidv4(),
            event_id: req.body.event_id,
            username: req.body.username,
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            mobile: req.body.mobile,
            lang: req.body.lang,
            genre: req.body.genre,
            exp: req.body.exp,
            password: await passwordLib.hash(req.body.password),
            user_type: req.body.user_type,
            created_by: req.user.username,
            created_on: time.now()
        });
        if (check.isEmpty(finduser)) {

            let payload = (await newUser.save()).toObject();

            delete payload.__v;
            delete payload._id;
            delete payload.password;
            delete payload.lang;
            delete payload.exp;
            let apiResponse = response.generate(false, 'Created new user', payload);
            res.status(200).send(apiResponse);
        } else {
            res.status(412);
            throw new Error('username,email or mobile already exists in this event!');
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.send(apiResponse);
    }
}

let registerAdmin = async(req, res) => {
    //models
    try {
        let finduser = await UserModel.findOne({ $or: [{ username: req.body.username }, { mobile: req.body.mobile }, { email: req.body.email }] }).lean();
        if (check.isEmpty(finduser)) {
            let newUser = new UserModel({
                user_id: uuidv4(),
                username: req.body.username,
                email: req.body.email.toLowerCase(),
                mobile: req.body.mobile,
                password: await passwordLib.hash(req.body.password),
                user_type: req.body.user_type,
                created_on: time.now()
            });
            let payload = (await newUser.save()).toObject();

            delete payload.__v;
            delete payload._id;
            delete payload.password;
            delete payload.lang;
            delete payload.exp;
            let apiResponse = response.generate(false, 'Created new admin user', payload);
            res.status(200).send(apiResponse);
        } else {
            res.status(412);
            throw new Error('username,email or mobile already exists!');
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.send(apiResponse);
    }
}
let getUserList = async(req, res) => {
    try {
        if (req.user.user_type == 3) {
            throw new Error('Not Authorized for this action!');
        } else {
            if (check.isEmpty(req.query.event_id)) {
                throw new Error('event_id required in query string!');
            } else {
                let userList = await UserModel.aggregate([
                    { $match: { $and: [{ user_type: 3 }, { event_id: req.query.event_id }] } },
                    {
                        $lookup: {
                            from: "results",
                            localField: "user_id",
                            foreignField: "user_id",
                            as: "results"
                        }
                    }, { $unwind: { path: "$results", preserveNullAndEmptyArrays: true } }, { $project: { '_id': 0, '__v': 0, 'password': 0, 'results._id': 0, 'results.__v': 0 } }
                ])
                let apiResponse = response.generate(false, 'found existing user-list!', userList);
                res.status(200).send(apiResponse);
            }
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.status(400).send(apiResponse);
    }
}

let getAdminList = async(req, res) => {
    try {
        if (req.user.user_type != 1) {
            throw new Error('Not Authorized for this action!');
        } else {
            let userList = await UserModel.find({ $or: [{ user_type: 1 }, { user_type: 2 }] }).select('-__v -_id').lean();
            let apiResponse = response.generate(false, 'found existing Admin-list!', userList);
            res.status(200).send(apiResponse);
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.status(400).send(apiResponse);
    }
}

let getLanguageList = async(req, res) => {
    try {
        if (req.user.user_type == 3) {
            throw new Error('Not Authorized for this action!');
        } else {
            let languageList = await LanguageModel.find().select('-__v').lean();
            let respArr = [];
            languageList.map((data)=>{
                if(data.status != 'deleted'){
                    respArr.push(data);
                }
            })
            let apiResponse = response.generate(false, 'found Language-list!', respArr);
            res.status(200).send(apiResponse);
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.status(400).send(apiResponse);
    }
}

let getLanguageListByUser = async(req, res) => {
    try {
        let languageList = await LanguageModel.find().select('-__v').lean();
        let respArr = [];
        languageList.map((data)=>{
            if(data.status == 'active'){
                respArr.push(data);
            }
        })
        let apiResponse = response.generate(false, 'found Language-list!', respArr);
        res.status(200).send(apiResponse);
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.status(400).send(apiResponse);
    }
}

let addLanguage = async(req, res) => {
    try {
        if (req.user.user_type == 3) {
            throw new Error('Not Authorized for this action!');
        } else {
            let checkExistence = await LanguageModel.findOne({ name: req.body.name }).select('-__v').lean(); 
            if(check.isEmpty(checkExistence)){
                let addlanguageobj = new LanguageModel({
                    name: req.body.name,
                    extension: req.body.extension,
                    status: 'active',
                    created_on: time.now()
                })
                let payload = (await addlanguageobj.save()).toObject();
                delete payload.__v;
                delete payload._id;
                let apiResponse = response.generate(false, 'Language Added', payload);
                res.status(200).send(apiResponse);
            }else{
                throw new Error('Language already exists!')
            }
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.status(400).send(apiResponse);
    }
}

let editLanguage = async(req, res) => {
    try {
        if (req.user.user_type == 3) {
            throw new Error('Not Authorized for this action!');
        } else {
            let updatedLanguage = {};
            for (const property in req.body) {
                updatedLanguage[property] = req.body[property];
            }

            let payload = await LanguageModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.language_id) }, updatedLanguage, { new: true });
            delete payload.__v;
            let apiResponse = response.generate(false, 'Language Updated', payload);
            res.status(200).send(apiResponse);
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.status(400).send(apiResponse);
    }
}

let deleteLanguage = async(req, res) => {
    try {
        if (req.user.user_type == 3) {
            throw new Error('Not Authorized for this action!');
        } else {
            let updatedLanguage = {
                status: 'deleted'
            };

            let payload = await LanguageModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.language_id) }, updatedLanguage, { new: true });
            delete payload.__v;
            let apiResponse = response.generate(false, 'Language Updated', payload);
            res.status(200).send(apiResponse);
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.status(400).send(apiResponse);
    }
}



let getEventList = async(req, res) => {
    try {
        if (req.user.user_type == 3) {
            throw new Error('Not Authorized for this action!');
        } else {
            let eventList = await EventModel.find().select('-__v').lean();

            console.log('Event list', eventList);
            let temp = await Promise.all(eventList.map(async(curr) => {
                if (!check.isEmpty(curr['event_logo'])) {
                    let signedUrl = await uploadLib.getFileUrl(curr.event_logo);
                    curr.event_logo = signedUrl
                    console.log('Event list signedUrl', signedUrl);
                }
                console.log('Event list curr', curr);
                return curr;
            }));
            let respArr = [];
            temp.map((data)=>{
                if(data.status !='deleted'){
                    if(req.user.user_type == 1){
                        respArr.push(data);
                    }else{
                        if(data.created_by == req.user.user_id){
                            respArr.push(data);
                        }
                    }
                }
            })
            let apiResponse = response.generate(false, 'found Event-list!', respArr);
            res.status(200).send(apiResponse);
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.status(400).send(apiResponse);
    }
}

let addEvent = async(req, res) => {
    try {
        if (req.user.user_type == 3) {
            throw new Error('Not Authorized for this action!');
        } else {
            let checkExistence = await EventModel.findOne({ event_name: req.body.event_name }).select('-__v').lean(); 
            if(check.isEmpty(checkExistence)){
                let addeventobj = new EventModel({
                    event_name: req.body.event_name,
                    event_logo: req.body.event_logo,
                    start_date: timeLib.getLocalDateFormat(req.body.start_date),
                    end_date: timeLib.getLocalDateFormat(req.body.end_date),
                    status: 'active',
                    created_by:req.user.user_id,
                    created_on: time.now()
                })
                let payload = (await addeventobj.save()).toObject();
                delete payload.__v;
                delete payload._id;
                let apiResponse = response.generate(false, 'Event Added', payload);
                res.status(200).send(apiResponse);
            }else{
                throw new Error('Event with same name Already Exists!');
            }
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.status(400).send(apiResponse);
    }
}

let editEvent = async(req, res) => {
    try {
        if (req.user.user_type == 3) {
            throw new Error('Not Authorized for this action!');
        } else {
            let updatedEvent = {};
            for (const property in req.body) {
                if((property == 'start_date') || (property == 'end_date')){
                    updatedEvent[property] = time.getLocalDateFormat(req.body[property]);
                }else{
                    updatedEvent[property] = req.body[property];
                }
            }

            let payload = await EventModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.event_id) }, updatedEvent, { new: true });
            delete payload.__v;
            let apiResponse = response.generate(false, 'Event Updated', payload);
            res.status(200).send(apiResponse);
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.status(400).send(apiResponse);
    }
}


let deleteEvent = async(req, res) => {
    try {
        if (req.user.user_type == 3) {
            throw new Error('Not Authorized for this action!');
        } else {
            let updatedEvent = {
                status: 'deleted'
            };

            let payload = await EventModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.event_id) }, updatedEvent, { new: true });
            delete payload.__v;
            let apiResponse = response.generate(false, 'Event Updated', payload);
            res.status(200).send(apiResponse);
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.status(400).send(apiResponse);
    }
}

let putSignedUrl = async(req, res) => {
    try {
        if (check.isEmpty(req.query.filename)) {
            throw new Error('filename must be provided in query string!');
        } else {
            let uniqueKey = otpLib.randomString(4, 'aA') + req.user.user_id + req.query.filename;
            let uploadUrl = await uploadLib.putFileUrl(uniqueKey);
            let apiResponse = response.generate(false, 'Upload Url Created!', { key: uniqueKey, url: uploadUrl });
            res.status(200).send(apiResponse);
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.status(412).send(apiResponse);
    }
}
let getSignedUrl = async(req, res) => {
    try {
        if (check.isEmpty(req.query.filename)) {
            throw new Error('filename must be provided in query string!');
        } else {
            let signedUrl = await uploadLib.getFileUrl(req.query.filename);
            let apiResponse = response.generate(false, 'File Url Created!', { url: signedUrl });
            res.status(200).send(apiResponse);
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.status(412).send(apiResponse);
    }
}

let eventStatus = async(req, res) => {
    try {
        let eventDetails = await EventModel.findOne({ _id: req.query.event_id }).select('-__v -_id').lean();
        let signedUrl = check.isEmpty(eventDetails.event_logo)?`${appConfig.baseUrl}event.jpg`:await uploadLib.getFileUrl(eventDetails.event_logo);
        if (check.isEmpty(eventDetails)) {
            res.status(404);
            throw new Error('Invalid event ID!');
        };
        if (!time.checkCurrDateRange(eventDetails.start_date, eventDetails.end_date)) {
            res.status(412);
            throw new Error('No Active Event Founds!');
        }
        let apiResponse = response.generate(false, 'Event ID is valid!', { status: 'ok!', url: signedUrl });
        res.status(200).send(apiResponse);
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.status(412).send(apiResponse);
    }
}

module.exports = {
    login: login,
    register: register,
    adminUserRegister: adminUserRegister,
    registerAdmin: registerAdmin,
    adminLogin: adminLogin,
    getUserList: getUserList,
    getAdminList: getAdminList,
    getLanguageList: getLanguageList,
    getLanguageListByUser: getLanguageListByUser,
    addLanguage: addLanguage,
    editLanguage: editLanguage,
    deleteLanguage: deleteLanguage,

    getEventList: getEventList,
    addEvent: addEvent,
    editEvent: editEvent,
    deleteEvent: deleteEvent,
    putSignedUrl: putSignedUrl,
    getSignedUrl: getSignedUrl,
    eventStatus: eventStatus

}


