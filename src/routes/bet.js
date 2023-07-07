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
};

