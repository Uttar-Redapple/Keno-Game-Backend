const check_draw_controller = require("../controllers/check_draw");
const appConfig = require("../../config/appConfig");

module.exports.setRouter = (app) => {
  let baseUrl = `${appConfig.apiVersion}`;
  //app.use(auth.verifyToken);
  
  app.get (`${baseUrl}/check_draw`,check_draw_controller.check_draw);
  
};
