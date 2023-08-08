const PayOutTable92Services = require("../services/payoutTable92");
const PayOutTableService = require("../services/payoutTable");
const {PayOutTableServices} = PayOutTableService ;
const responseMessage = require("../libs/responseMessage");

//payout table
const sims = 2000000000;
let payout92 = async (req, res, next) => {
  try {
    const bet_multiplier = 0.12;
    const final_bet = 1.2;
    const sims = 2000000000;
    const base_cycle_multiplier = req.body.base_cycle_multiplier//0.001;
    const base_bet_multiplier = req.body.base_bet_multiplier//0.12;
    let total_sims = sims * base_cycle_multiplier;
    

    let hits = [];
    let wins = [];
    let payouts = [];
    let probabilities = [];
    let win_amounts = [];
    let numbers_match = [];
    let wins_after_bet_multiplier = [];

    
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
    let o = Object.assign({}, numbers_match);
    let l = Object.assign({}, hits);
    let m = Object.assign({}, payouts);
    let n = Object.assign({}, probabilities);
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
      let const_val_92_query = { attributes: ["numbers_match","payout","probability",], raw: true };
      const const_val_92 = await PayOutTable92Services.PayOutTable92Services(
        const_val_92_query
      );
    let z = Object.assign({}, hits);
    let x = Object.assign({}, win_amounts);
    let y = Object.assign({}, wins_after_bet_multiplier);
    console.log("x", x);
    if (payOutProbabilityData92) {
      return res.status(200).send({
        data : {
        numbers_match : o,
        payouts : m,
        probabilities :n,
        hits: z,
        win_amounts : x,
        wins_after_bet_multiplier : y,
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
let payout92_10 = async (req,res,next) => {
  const numbers_match = [0,1,2,3,4,5,6,7,8, 9,10];
  const pay_out = [2,4,8,24,80,800,5000,10000];
  const probability = [28.00,35.00,35.00,35.00,25.00,5.00,3.38,3.10,0.33,0.16,0.03,65.00];
  const bet_multiplier = 2 ;
  let hits = [];
  let wins = [];
  let base_bet_multiplier = req.body.base_bet_multiplier ;

  let final_bet = bet_multiplier * base_bet_multiplier ;

  let base_cycle_multiplier = req.body.base_cycle_multiplier ;
  const total_sims = sims*base_cycle_multiplier ;
  for(let i = 0;i<numbers_match.length ;i++){
    let hit = total_sims*probability[i];
    hits.push(hit);

  }
  console.log(hits);
  for(let i = 0;i<numbers_match.length;i++){
    let win = hits[i]*pay_out[i];
    wins.push(win);

  }
  console.log("wins",wins);
}
let payout_table = async (req,res,next) => {
  const query = {attributes: ["numbers_match","payout"], raw: true};
  const payout_table = await PayOutTableServices(query);
  let zero_removed = [];
  // let ob = payout_table[9].payout;
  // let obj = payout_table[9].payout;
  // let objj = JSON.parse(obj);
  // console.log("objj",typeof objj);
  //     Object.keys(objj).forEach(key => {
  //   if (obj[key] === 0) {
  //     delete obj[key];
  //   }
  //   //console.log("obj",obj);
  // });
  
    
  //   console.log(objj);
  //   let x = '{"age":30, "city":90}';
  //   let y = JSON.parse(x);
  //   console.log("y",typeof y);
  //console.log("obj",typeof ob);
  //let pay_out_string = JSON.stringify(payout_table[i].payout);
  //let objjj = JSON.parse(payout_table[i].payout);
  for (let i = 0;i<payout_table.length;i++){

    //console.log(JSON.parse(payout_table[i].payout));
    //let pay_out_string = JSON.stringify(payout_table[i].payout);
    let obj = JSON.parse(payout_table[i].payout);
    //console.log("typeofobj",typeof obj);
    //console.log("obj",obj);
     Object.keys(obj).forEach(key => {
    if (obj[key] === 0) {
      delete obj[key];
    }
    //console.log("obj",obj);
  });
  console.log("obj",obj);
  zero_removed.push(obj);
  }
  console.log("payout_table",payout_table);
  console.log("zero_removed",zero_removed);
  res.status(200).send({
    data : zero_removed,
    error : false

  }) 

}

module.exports = {
  payout92: payout92,
  payout92_10 : payout92_10,
  payout_table : payout_table
};
