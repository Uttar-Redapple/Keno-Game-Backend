const FindCommonElements = require("../libs/util");
const { findCommonElements } = FindCommonElements;
const Placebet = require("../models/Placebet");
const Account = require("../models/Transaction");
const Client = require("../models/Client");
const Guest = require("../models/Guest");
const Joi = require("joi");
const apiError = require("../libs/apiError");
const bcrypt = require("bcrypt");
const responseMessage = require("../libs/responseMessage");
const { Op, Transaction } = require("sequelize");
const appConfig = require("../../config/appConfig");
const FindBet = require("../services/place_bet");
const { FindBetFromDrawId, FindAllBet } = FindBet;
const DrawTableServices = require("../services/bet_draw");
const { DrawTableFindAll, FindLastDraw, SaveToDraw } = DrawTableServices;
const PayOutTableService = require("../services/payoutTable");
const { PayOutTableServices } = PayOutTableService;
const ClientServices = require("../services/client");
const { FindClient, UpdateClientBalance } = ClientServices;
const pRNG = appConfig.pRNG;
const DrawTable = require("../models/Draw");
const { dataAPI } = require("../../www/db/db");

// get report
let report = async (req, res, next) => {
  try {
    let sql= 'SELECT pb.client_id,ct.name,SUM(pb.bet_amount) as total_deduct_amount,SUM(pb.win_amount) as total_win_amount,SUM(pb.win_amount)-SUM(pb.bet_amount) as win_loose\
    FROM `Placebet` pb\
    INNER JOIN Client ct ON ct.client_id = pb.client_id \
    GROUP BY pb.client_id';
     // let sql ="select pb.*,ct.* from Placebet pb inner join Client ct ON pb.client_id=ct.client_id GROUP BY pb.client_id";
      let bet_history = await dataAPI.query(sql, {
        type: dataAPI.QueryTypes.SELECT,
      });

//console.log("bet_history", bet_history);
if(bet_history)
{
  for(let report of bet_history){
    report.overall_win_loose = report.win_loose*-1 ;
  }
  res.status(200).json({
    responseMessage: "player report found",
    report_history: bet_history,
    error : false
  });
}
else {
  res.status(400).json({
    responseMessage: "player report not found",
    error : true
  });

}


  } catch (e) {
    console.log("e", e);
    next();
  }
};

module.exports = {
  report: report,
};
