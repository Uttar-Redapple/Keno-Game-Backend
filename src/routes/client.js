const path = require("path");
const clientController = require("../controllers/client");
const appConfig = require("./../../config/appConfig");
const auth = require("../middlewares/auth");
const validator = require("../middlewares/validator");

module.exports.setRouter = (app) => {
  let baseUrl = `${appConfig.apiVersion}`;
  app.get (`${baseUrl}/get_date_and_time`,clientController.get_date_and_time);
  app.post(`${baseUrl}/login`, clientController.login);
  app.post(`${baseUrl}/players_login`, clientController.players_login);
  app.post(`${baseUrl}/other_role_login`, clientController.other_role_login);
  app.post(`${baseUrl}/verify_phno`, clientController.verify_phno);
  app.post(`${baseUrl}/verify_otp`, clientController.verify_otp);
  //app.use(auth.verifyToken);
  
  app.get(`${baseUrl}/find_all_clients`,auth.isAuthorized, clientController.find_all_clients);
  app.post(`${baseUrl}/create`, auth.isAuthorized,clientController.create);
  app.post(`${baseUrl}/edit_created_client`,auth.isAuthorized,clientController.edit_created_client);
  app.post(`${baseUrl}/delete_client`,auth.isAuthorized, clientController.delete_client);
  app.post(`${baseUrl}/create_player`,auth.isAuthorized, clientController.create_player);
  app.post(`${baseUrl}/find_player`, auth.isAuthorized,clientController.find_player);
  
};
