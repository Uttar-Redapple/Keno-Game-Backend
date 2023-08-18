const clientController = require("../controllers/number_match");
const appConfig = require("../../config/appConfig");

module.exports.setRouter = (app) => {
  let baseUrl = `${appConfig.apiVersion}`;
  //app.use(auth.verifyToken);
  
  app.get (`${baseUrl}/number_match`,clientController.number_match);
  
};
