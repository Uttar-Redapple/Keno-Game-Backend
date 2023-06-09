
const path = require('path');
const clientController = require('../controllers/client');
const appConfig = require("./../../config/appConfig");
const auth = require("../libs/tokenLib");
const validator = require('../middlewares/validator');


module.exports.setRouter = (app) => {
    //let baseUrl = `${appConfig.apiVersion}`;
    
    app.post(`/login`, clientController.login);
    app.use(auth.verifyToken);
    app.get(`/find_all_clients`, clientController.find_all_clients);
    app.post(`/create`, clientController.create);
    app.post(`/edit_created_client`,clientController.edit_created_client);
    app.post(`/delete_client`,clientController.delete_client);
    
    
};