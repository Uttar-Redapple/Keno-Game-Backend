const apiError = require("../libs/apiError");
const responseMessage = require("../libs/responseMessage");
const appConfig = require("../../config/appConfig");
const FindBet = require("../services/place_bet");
const {FindBetFromDrawId,FindAllBet} = FindBet;
const DrawTableServices = require("../services/bet_draw");
const {DrawTableFindAll,FindLastDraw,SaveToDraw} = DrawTableServices ;
const PayOutTableService = require("../services/payoutTable");
const {PayOutTableServices} = PayOutTableService ;
const DrawTable = require("../models/Draw");
const Placebet = require("../models/Placebet");
const { dataAPI } = require('../../www/db/db');


let check_draw = async (req,res,next) => {
    try{

        const query_for_last_bet = {
            order: [ [ 'createdAt', 'DESC']],
            limit: 1,
            raw : true
        };

        const last_bet = await FindAllBet(query_for_last_bet);
        console.log("last_bet",last_bet);

        const query_for_last_draw = {
            order: [ [ 'draw_id', 'DESC']],
            limit: 1,
            raw : true
        };
        let sql = "select dt.draw_id,case when dt.draw_id is null then '-' else 999 end as winamount ,pb.*,dt.* from Placebet pb left join DrawTable dt ON pb.draw_id=dt.draw_id where pb.client_id='1'";
        
        let bet_history = await dataAPI.query(sql, { type: dataAPI.QueryTypes.SELECT });
        let result = bet_history[0];
        console.log("result",bet_history);
          
          
        const last_draw_id = await FindLastDraw(query_for_last_draw);
        console.log("last_draw_id",last_draw_id);
        // return res.status(200).send({
        //     last_bet :last_bet,
        //     last_draw_id :last_draw_id,
        //     error: false,
        //     });

        if(last_bet.draw_id<last_draw_id.draw_id){
            return res.status(200).send({
                amount : "--",
                bet_history :bet_history,
                error: false,
                });

        }
        else{
            return res.status(200).send({
                amount : 999,
                bet_history :bet_history,
                error: false,
                });
            
        }

    }
    catch(e){
        console.log("e",e);

    }
}

module.exports = {
    check_draw: check_draw
  };