const path = require("path");
const appConfig = require("../../config/appConfig");
const betController = require("../controllers/bet_draw");
module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}`;
    app.post (`${baseUrl}/bet_draw`,betController.bet_draw);

}