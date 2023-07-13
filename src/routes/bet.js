const path = require("path");
const betController = require("../controllers/bet");
const appConfig = require("../../config/appConfig");
const auth = require("../libs/tokenLib");
const validator = require("../middlewares/validator");

module.exports.setRouter = (app) => {
  let baseUrl = `${appConfig.apiVersion}`;
  app.post (`${baseUrl}/place_bet`,betController.place_bet);
  app.post (`${baseUrl}/get_placed_bet`,betController.get_placed_bet);
  app.get(`${baseUrl}/gen_random`, betController.gen_random);
  //app.use(auth.verifyToken);
  app.post (`${baseUrl}/add_balance`,betController.add_balance);
  app.post(`${baseUrl}/get_bet_history`, betController.get_bet_history);
  app.post(`${baseUrl}/get_transaction_history`, betController.get_transaction_history);
  
};

