const path = require("path");
const betController = require("../controllers/bet");
const appConfig = require("../../config/appConfig");
const auth = require("../middlewares/auth");
const validator = require("../middlewares/validator");

module.exports.setRouter = (app) => {
  let baseUrl = `${appConfig.apiVersion}`;
  //app.use(auth.verifyToken);
  app.post(`${baseUrl}/draw_id`,betController.draw_id);
  app.post (`${baseUrl}/place_bet`,betController.place_bet);
  app.post (`${baseUrl}/get_placed_bet`,betController.get_placed_bet);
  //app.get(`${baseUrl}/gen_random`, auth.isAuthorized,betController.gen_random);
  app.post (`${baseUrl}/add_balance`,betController.add_balance);
  app.post(`${baseUrl}/get_bet_history`,auth.isAuthorized,betController.get_bet_history);
  app.post(`${baseUrl}/get_transaction_history`,betController.get_transaction_history);
  app.post(`${baseUrl}/save_multiple_bet`, auth.isAuthorized,betController.save_multiple_bet);
  
  //app.post(`${baseUrl}/payOut`, auth.isAuthorized,betController.payOut);
};

