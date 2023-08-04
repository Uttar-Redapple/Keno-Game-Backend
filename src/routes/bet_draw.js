const path = require("path");
const appConfig = require("../../config/appConfig");
const betController = require("../controllers/bet_draw");
module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}`;
    app.get (`${baseUrl}/previous_10_bet_draw`,betController.previous_10_bet_draw);
    app.get (`${baseUrl}/previous_draw`,betController.previous_draw);
    app.get (`${baseUrl}/current_draw`,betController.current_draw);
    app.get (`${baseUrl}/hot_and_cold`,betController.hot_and_cold);

}