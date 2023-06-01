
const path = require('path');
const clientController = require('../controllers/client');
const appConfig = require("./../../config/appConfig");
const auth = require("../libs/tokenLib");
const validator = require('../middlewares/validator');


module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}`;
    
    app.post(`${baseUrl}/login`, clientController.login);
    app.use(auth.verifyToken);
    app.get(`${baseUrl}/find_all_clients`, clientController.find_all_clients);
    app.post(`${baseUrl}/create`, clientController.create);
    
};