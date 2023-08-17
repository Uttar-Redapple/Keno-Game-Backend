const apiError = require("../libs/apiError");
const responseMessage = require("../libs/responseMessage");
const appConfig = require("../../config/appConfig");
const FindBet = require("../services/place_bet");
const {FindBetFromDrawId,FindAllBet} = FindBet;
const DrawTableServices = require("../services/bet_draw");
const {DrawTableFindAll,FindLastDraw,SaveToDraw} = DrawTableServices ;
const PayOutTableService = require("../services/payoutTable");
const {PayOutTableServices} = PayOutTableService ;


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
                error: false,
                });

        }
        else{
            return res.status(200).send({
                amount : 999,
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