const PayOutTable92Services = require("../services/payoutTable92");
const responseMessage = require("../libs/responseMessage");
let payout92 = async (req, res, next) => {
  try {
    const bet_multiplier = 0.12;
    const final_bet = 1.2;
    const sims = 2000000000;
    const base_cycle_multiplier = req.body.base_cycle_multiplier//0.001;
    const base_bet_multiplier = req.body.base_bet_multiplier//0.12;
    let total_sims = sims * base_cycle_multiplier;
    //req.body.total_sims

    let hits = [];
    let wins = [];
    let payouts = [];
    let probabilities = [];
    let win_amounts = [];
    let numbers_match = [];
    let wins_after_bet_multiplier = [];

    //let sims = total_sims*base_cycle_multiplier ;
    const frombody = req.body.frombody;
    let query_for_numbers_match = { attributes: ["numbers_match"], raw: true };
    const numbers_match92 = await PayOutTable92Services.PayOutTable92Services(
      query_for_numbers_match
    );
    for (number of numbers_match92) {
      let numbers = number.numbers_match;
      numbers_match.push(numbers);
    }
    
    let query_for_hit = { attributes: ["probability"], raw: true };
    const payOutProbabilityData92 =
      await PayOutTable92Services.PayOutTable92Services(query_for_hit);
    for (probable of payOutProbabilityData92) {
      let percent = probable.probability;
      probabilities.push(percent);
      let hit = (total_sims * percent) / 100;
      hits.push(hit);
    }
    let query_for_payout = { attributes: ["payout"], raw: true };
    const payOutData92 = await PayOutTable92Services.PayOutTable92Services(
      query_for_payout
    );
    for (pay of payOutData92) {
      let percent = pay.payout;
      payouts.push(percent);
    }
    console.log("numbers_match", numbers_match);
    console.log("payouts", payouts);
    console.log("probabilities", probabilities);
    console.log("hits", hits);
    for (let i = 0; i < hits.length; i++) {
      let win = Math.floor(hits[i] * payouts[i]);
      wins.push(win);
    }

    for (let i = 0; i < hits.length; i++) {
      let win_amount = Math.floor(hits[i] * payouts[i]);
      win_amounts.push(win_amount);
    }
    console.log("win_amounts", win_amounts);
    for (let i = 0; i < win_amounts.length; i++) {
        let win_after_bet_multiplier = Math.floor(win_amounts[i] * base_bet_multiplier);
        wins_after_bet_multiplier.push(win_after_bet_multiplier);
      }
      console.log("wins_after_bet_multiplier", wins_after_bet_multiplier);
  

    if (payOutProbabilityData92) {
      return res.status(200).send({
        data: {
          numbers_match: numbers_match,
          probabilities: probabilities,
          hits: hits,
          payouts: payouts,
          win_amounts: win_amounts,
          wins_after_bet_multiplier : wins_after_bet_multiplier
        },

        message: responseMessage.PAY_OUT_TABLE_DATA_92_FOUND,
        error: false,
      });
    } else {
      return res.status(400).send({
        payOutProbabilityData92: payOutProbabilityData92,
        message: responseMessage.PAY_OUT_TABLE_DATA_92_NOT_FOUND,
        error: false,
      });
    }
  } catch (e) {
    return next(e);
  }
};
module.exports = {
  payout92: payout92,
};
