const DrawService = require("../services/bet_draw");

let bet_draw = async (req,res,next) => {
    const query = {limit: 10};
    const draw_bet = await DrawService.DrawTableServices(query);
    console.log("draw_bet",draw_bet);
    res.status(200).send({
        draw_bet :draw_bet,
        error : false 
    })
    

}
module.exports = {
    bet_draw : bet_draw

}