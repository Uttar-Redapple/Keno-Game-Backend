const path = require("path");
const clientController = require("../controllers/guest");
const appConfig = require("./../../config/appConfig");
const auth = require("../libs/tokenLib");
const validator = require("../middlewares/validator");

module.exports.setRouter = (app) => {
  let baseUrl = `${appConfig.apiVersion}`;
  app.use(auth.verifyToken);
  const auth = require("../libs/tokenLib");
  app.get (`${baseUrl}/find_guest`,clientController.find_guest);
  
};
