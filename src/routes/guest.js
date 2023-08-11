const path = require("path");
const clientController = require("../controllers/guest");
const appConfig = require("../../config/appConfig");
const auth = require("../middlewares/auth");
const validator = require("../middlewares/validator");

module.exports.setRouter = (app) => {
  let baseUrl = `${appConfig.apiVersion}`;
  //app.use(auth.verifyToken);
  
  app.get (`${baseUrl}/find_guest`,clientController.find_guest);
  
};
