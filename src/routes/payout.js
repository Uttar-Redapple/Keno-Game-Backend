const path = require("path");
const payoutController = require("../controllers/payout");
const appConfig = require("../../config/appConfig");
const auth = require("../libs/tokenLib");
const validator = require("../middlewares/validator");

module.exports.setRouter = (app) => {
  let baseUrl = `${appConfig.apiVersion}`;
  app.post(`${baseUrl}/payout92`,payoutController.payout92);
  app.use(auth.verifyToken);
  app.post(`${baseUrl}/payout_table`,payoutController.payout_table);
  
};

