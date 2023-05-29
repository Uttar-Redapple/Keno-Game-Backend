
const path = require('path');
const clientController = require('../controllers/client');
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');
const validator = require('../middlewares/validator');


module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}`;
    app.post(`${baseUrl}/create`, clientController.create);
    app.post(`${baseUrl}/login`, clientController.login);
    app.post(`${baseUrl}/find_all_clients`, clientController.find_all_clients);
    
};