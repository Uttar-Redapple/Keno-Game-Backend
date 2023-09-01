const path = require("path");
const payoutController = require("../controllers/report");
const appConfig = require("../../config/appConfig");
const auth = require("../middlewares/auth");
const validator = require("../middlewares/validator");

module.exports.setRouter = (app) => {
  let baseUrl = `${appConfig.apiVersion}`;
  app.get(`${baseUrl}/report`,auth.isAuthorized,payoutController.report);
  
  
};

