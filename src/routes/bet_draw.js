const path = require("path");
const appConfig = require("../../config/appConfig");
const betController = require("../controllers/bet_draw");
const auth = require("../middlewares/auth");
module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}`;
    //app.use(auth.verifyToken);
    app.get (`${baseUrl}/previous_10_bet_draw`,auth.isAuthorized,betController.previous_10_bet_draw);
    app.get (`${baseUrl}/previous_draw`,auth.isAuthorized,betController.previous_draw);
    // app.get (`${baseUrl}/current_draw`,auth.isAuthorized,betController.current_draw);
    app.get (`${baseUrl}/hot_and_cold`,auth.isAuthorized,betController.hot_and_cold);

}