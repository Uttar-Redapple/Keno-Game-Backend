const { v4: uuidv4 } = require("uuid");
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
const { FindClient, UpdateClientBalance, FindSpecificClient } = ClientServices;
const pRNG = appConfig.pRNG;
const DrawTable = require("../models/Draw");
const TransactionTable = require("../models/Transaction");
const { dataAPI } = require("../../www/db/db");
const TransactionServices = require("../services/add_withdraw");
const { SaveToTransaction, FindTransaction } = TransactionServices;

//generate draw id

let draw_id = async (req, res, next) => {
  try {
    let draw_id = 80000;
    setInterval(displayDrawid, 1200);

    function displayDrawid() {
      draw_id = draw_id + 1;
      console.log("draw_id", draw_id);
    }
    console.log("draw_id", draw_id);
    return res.status(200).send({
      message: responseMessage.DRAW_ID_GENERATED,
      draw_id: draw_id,
      error: false,
      date: new Date(),
    });
  } catch (e) {
    console.log("error in draw_id ", e);
  }
};

// save bet data

let place_bet = async (req, res, next) => {
  try {
    let guest_id = uuidv4();
    let bet_id = uuidv4();
    //let draw_id = uuidv4();
    const schema = Joi.object({
      contact: Joi.number().required(),
      user_name: Joi.string().required(),
      role: Joi.string(),
      num10: Joi.string().required(),
      add_amount: Joi.number().required(),
      bet_amount: Joi.number().required(),
      total_amount: Joi.number().required(),
      draw_date: Joi.date().required(),
      draw_time: Joi.string().required(),
    });
    const bet = {
      contact: req.body.contact,
      user_name: req.body.user_name,
      role: req.body.role,
      num10: req.body.number_select,
      bet_amount: req.body.bet_amount,
      total_amount: req.body.total_amount,
      draw_date: req.body.draw_date,
      draw_time: req.body.draw_time,
      contact: req.body.contact,
    };
    const query_for_last_draw = {
      order: [["draw_id", "DESC"]],
      limit: 1,
      raw: true,
    };
    const last_draw = await FindLastDraw(query_for_last_draw);
    let { draw_id } = last_draw;
    draw_id = draw_id + 1;
    console.log("last_draw", draw_id);
    const validated_body = schema.validate(bet);
    if (validated_body.value.role === "7") {
      const player = await Client.findOne({
        where: { user_name: validated_body.value.user_name },
      });
      validated_body.value.client_id = player.dataValues.client_id;
      validated_body.value.bet_id = bet_id;
      validated_body.value.draw_id = draw_id;

      console.log("validatedBody", validated_body.value);
      const amount = await Client.findOne({
        where: { user_name: validated_body.value.user_name },
      });
      if (amount.dataValues.amount >= validated_body.value.bet_amount) {
        const bet_created = await Placebet.create(validated_body.value);
        if (bet_created) {
          console.log("amount", amount.dataValues.amount);
          const prev_bal = amount.dataValues.amount;
          console.log("prev_bal", prev_bal);
          console.log(
            "validated_body.value.bet_amount",
            validated_body.value.bet_amount
          );

          let curr_bal = prev_bal - validated_body.value.bet_amount;
          console.log("curr_bal", curr_bal);
          console.log(
            "amount.dataValues.client_id",
            amount.dataValues.client_id
          );
          const bal_update = await Client.update(
            { amount: curr_bal },
            { where: { client_id: amount.dataValues.client_id } }
          );
          console.log("bal_update", bal_update);
          //const amount_bet_table = await Placebet.update({ amount: curr_bal },{ where: { client_id: validated_body.value.user_name } })
          res.status(200).send({
            data: bet_created,
            message: responseMessage.BET_PLACED,
            curr_bal: curr_bal,
            error: false,
          });
        } else {
          res.status(500).send({
            message: err.message || responseMessage.BET_COULD_NOT_PLACED,
            error: true,
          });
        }
      } else {
        return res.status(400).send({
          message: responseMessage.BET_AMOUNT_CONFLICT,
          error: true,
        });
      }
    } else if (validated_body.value.role === "8") {
      validated_body.value.client_id = guest_id;
      validated_body.value.bet_id = bet_id;
      validated_body.value.draw_id = draw_id;
      console.log("validatedBody", validated_body.value);
      const bet_created = await Placebet.create(validated_body.value);
      const check_guest = await Guest.findOne({
        where: { user_name: validated_body.value.user_name },
      });
      console.log("check_guest", check_guest);
      if (!check_guest && validated_body.value.role === "8") {
        delete validated_body.value.role;
        delete validated_body.value.bet_id;
        delete validated_body.value.num10;
        delete validated_body.value.bet_amount;
        delete validated_body.value.draw_date;
        delete validated_body.value.draw_time;
        validated_body.value.guest_id = validated_body.value.client_id;
        delete validated_body.client_id;
        console.log("guest", validated_body.value);
        const new_guest = await Guest.create(validated_body.value);
        console.log("new_guest", new_guest);
      }
      console.log("validated body", validated_body.value);

      if (bet_created) {
        res.status(200).send({
          data: bet_created,
          message: responseMessage.BET_PLACED,
          error: false,
        });
      } else {
        res.status(500).send({
          message: err.message || responseMessage.BET_COULD_NOT_PLACED,
          error: true,
        });
      }
    } else {
      return res.status(401).send({
        message: responseMessage.ROLE_CONFLICT,
        error: true,
      });
    }
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

//save bet
let save_multiple_bet = async (req, res, next) => {
  try {
    //let guest_id = uuidv4();
    //let bet_id = uuidv4();
    console.log("req.body", req.body);
    const length = req.body.multiple_place_bet.length;
    const query_for_find_client = {
      where: { client_id: req.user.id },
      raw: true,
    };
    const find_client = await FindClient(query_for_find_client);
    console.log("find_client", find_client);
    //console.log("find_client.amount",find_client.amount);
    const query_for_last_draw = {
      order: [["draw_id", "DESC"]],
      limit: 1,
      raw: true,
    };
    const last_draw = await FindLastDraw(query_for_last_draw);
    let { draw_id } = last_draw;
    //draw_id = draw_id+1;
    console.log("last_draw", draw_id);
    //console.log("length",length);
    let { multiple_place_bet } = req.body;
    //console.log("multiple_place_bettt",multiple_place_bet);

    let total_bet_amount_of_multiple = 0;
    for (let i of multiple_place_bet) {
      total_bet_amount_of_multiple = total_bet_amount_of_multiple + 1;
    }
    console.log("total_bet_amount_of_multiple", total_bet_amount_of_multiple);
    //req.body.multiple_place_bet.bet_amount = req.body.multiple_place_bet.amount;

    console.log("req.body", req.body.multiple_place_bet);
    if (total_bet_amount_of_multiple > find_client[0].amount) {
      return res.status(400).send({
        message: responseMessage.BET_AMOUNT_CONFLICT,
        error: true,
      });
    } else {
      for (let i = 0; i < req.body.multiple_place_bet.length; i++) {
        req.body.multiple_place_bet[i].draw_id = draw_id + 1;
        req.body.multiple_place_bet[i].bet_id = uuidv4();
        req.body.multiple_place_bet[i].bet_amount =
          req.body.multiple_place_bet[i].amount;
        req.body.multiple_place_bet[i].client_id = req.user.id;
        req.body.multiple_place_bet[i].total_amount = find_client[0].amount;
      }
      
      delete req.body.multiple_place_bet.pays;
      delete req.body.multiple_place_bet.toWin;
      delete req.body.multiple_place_bet.time;
      delete req.body.multiple_place_bet.toamount;
      //delete req.body.multiple_place_bet.amount;
      console.log("total_bet_amount_of_multiple",total_bet_amount_of_multiple);
      console.log("find_client[0].amount",find_client[0].amount);
      const updated_balance_after_multiple_place_bet =
        find_client[0].amount - total_bet_amount_of_multiple;
      const bet_created = await Placebet.bulkCreate(
        req.body.multiple_place_bet
      );
      console.log("bet_created", bet_created);
      const query_to_update_client_balance_after_multiple_bet = {
        amount: updated_balance_after_multiple_place_bet,
      };
      const condition_for_client_balance_update = {
        where: { client_id: req.user.id },
      };
      console.log("updated_balance_after_multiple_place_bet",updated_balance_after_multiple_place_bet);
      const client_balance_updated = await UpdateClientBalance(
        query_to_update_client_balance_after_multiple_bet,
        condition_for_client_balance_update
      );
      console.log("client_balance_updated", client_balance_updated);
      return res.status(200).send({
        message: responseMessage.BET_PLACED_SUCCESSFULLY,
        error: false,
      });
    }
  } catch (error) {
    return next(error);
  }
};

// get saved data

let get_placed_bet = async (req, res, next) => {
  console.log("get_placed_bet_deploy_testing");
  try {
    const schema = Joi.object({
      bet_id: Joi.string().required,
    });
    const bet = {
      bet_id: req.body.bet_id,
    };
    console.log("req.body.bet_id", req.body.bet_id);
    const validated_body = schema.validate(bet);
    console.log("validated_body", validated_body.value);
    const bet_details = await Placebet.findOne({
      where: { bet_id: req.body.bet_id },
    });
    console.log("bet_details", bet_details);
    //const client_detail = await Client.findOne({where : {client_id : bet_details.dataValues.client_id}});
    if (bet_details) {
      res.status(200).send({
        data: bet_details,
        draw_numbers: "35,56,78,54,33,87,89,88,44,22",
        //amount : client_detail.dataValues.amount,
        message: responseMessage.BET_FOUND,
        error: false,
      });
    } else {
      res.status(404).send({
        message: responseMessage.BET_NOT_FOUND,
        error: true,
      });
    }
    const num = bet_details.dataValues.num10;
    console.log("num", num);
    console.log("num", num[0]);
    console.log("num.length", num.length);
    const sliced = num.slice(1, num.length - 1);
    const num_val = sliced.split(",");
    console.log("bet_details.data", num_val);
    //typeof(parseInt(num_val[0]))
  } catch (error) {
    return next(error);
  }
};

//gen random
let gen_random = async (req, res, next) => {
  req.body.total_number;
  //console.log ("prng",pRNG);
  let rand_num = [];
  let rand;
  function getRandomArbitrary(min, max) {
    return pRNG.random() * (max - min) + min;
  }
  for (i = 0; i < 40; i++) {
    rand = Math.floor(getRandomArbitrary(1, 80));
    rand_num.push(rand);
  }

  function hasDuplicates(a) {
    const noDups = new Set(a);

    return noDups;
  }
  const dup_removed = hasDuplicates(rand_num);
  const array = Array.from(dup_removed);
  console.log(dup_removed, dup_removed.length);
  console.log("rand", rand_num, rand_num.length);
  console.log("array", array);
  res.status(200).json({
    rand: rand_num,
    array: array,
    length: array.length,
  });
};

//add balance
let add_balance = async (req, res, next) => {
  try {
    const schema = Joi.object({
      client_id: Joi.string().required(),
      amount: Joi.number().integer().required(),
    });

    const add_bal = {
      client_id: req.body.client_id,
      amount: req.body.amount,
    };
    const validated_body = schema.validate(add_bal);
    console.log("validated_body", validated_body.value);
    const query_for_specific_client = {
      where: { client_id: validated_body.value.client_id },
      raw: true,
    };
    const amount_before_add = await FindSpecificClient(
      query_for_specific_client
    );

    const amount = await Client.findOne({
      where: { client_id: validated_body.value.client_id },
    });
    console.log("amount", amount.dataValues.amount);
    const prev_bal = amount.dataValues.amount;
    let curr_bal = prev_bal + validated_body.value.amount;
    const bal_update = await Client.update(
      { amount: curr_bal },
      { where: { client_id: validated_body.value.client_id } }
    );
    const amount_after_add = await FindSpecificClient(
      query_for_specific_client
    );
    // const query_for_save_transaction = {
    // }
    add_bal.transaction_id = uuidv4();
    add_bal.add = validated_body.value.amount;
    add_bal.previous_amount = amount_before_add.amount;
    add_bal.after_add_or_draw_amount = amount_after_add.amount;
    //add_bal.after_add_or_draw_amount =
    const transaction = await SaveToTransaction(add_bal);
    console.log("transaction", transaction);
    //const amount_bet_table = await Placebet.update({ total_amount: curr_bal },{ where: { client_id: validated_body.value.user_name } })
    console.log("amount", amount.dataValues.amount);
    console.log("new_amount", curr_bal);
    //const query_for_transaction_of_particular_client_id =
    const transaction_details = await FindTransaction(
      query_for_specific_client
    );
    console.log("transaction", transaction);
    if (transaction_details) {
      res.status(200).json({
        responseMessage: "your balance has been updated successfully",
        updated_amount: curr_bal,
        transaction_details: transaction_details,
        error: false,
      });
    } else {
      res.status(400).json({
        responseMessage: "your balance could not updated successfully",
        error: true,
      });
    }
  } catch (error) {
    return next(error);
  }
};
//update balance
let update_balance = async (req,res,next) =>{
  const query_for_client_details = {
    where : {client_id : req.user.id},
    raw : true
  };
  const client = await FindSpecificClient(query_for_client_details);
  if(update_balance){
    res.status(200).send({
      responseMessage: "your balance has been updated successfully",
      updated_amount: client.amount,
      error: false,

    })
  }
  else{
    res.status(400).send({
      responseMessage: "your balance has been updated successfully",
      updated_amount: client.amount,
      error: true

    })
  }


}
//withdraw balance
let withdraw_balance = async (req, res, next) => {
  try {
    const schema = Joi.object({
      client_id: Joi.string().required(),
      amount: Joi.number().integer().required(),
    });

    const add_bal = {
      client_id: req.body.client_id,
      amount: req.body.amount,
    };
    const validated_body = schema.validate(add_bal);
    console.log("validated_body", validated_body.value);
    const query_for_specific_client = {
      where: { client_id: validated_body.value.client_id },
      raw: true,
    };
    const amount_before_add = await FindSpecificClient(
      query_for_specific_client
    );

    const amount = await Client.findOne({
      where: { client_id: validated_body.value.client_id },
    });
    console.log("amount", amount.dataValues.amount);
    const prev_bal = amount.dataValues.amount;
    let curr_bal = prev_bal - validated_body.value.amount;
    const bal_update = await Client.update(
      { amount: curr_bal },
      { where: { client_id: validated_body.value.client_id } }
    );
    const amount_after_add = await FindSpecificClient(
      query_for_specific_client
    );
    // const query_for_save_transaction = {
    // }
    add_bal.transaction_id = uuidv4();
    add_bal.draw = validated_body.value.amount;
    add_bal.previous_amount = amount_before_add.amount;
    add_bal.after_add_or_draw_amount = amount_after_add.amount;

    const transaction = await SaveToTransaction(add_bal);
    console.log("transaction", transaction);
    console.log("amount", amount.dataValues.amount);
    console.log("new_amount", curr_bal);
    const transaction_details = await FindTransaction(
      query_for_specific_client
    );
    console.log("transaction", transaction);
    if (transaction_details) {
      res.status(200).json({
        responseMessage: "your balance has been updated successfully",
        updated_amount: curr_bal,
        transaction_details: transaction_details,
        error: false,
      });
    } else {
      res.status(400).json({
        responseMessage: "your balance could not updated successfully",
        error: true,
      });
    }
  } catch (error) {
    return next(error);
  }
};

// get bet history
let get_bet_history = async (req, res, next) => {
  try {
    console.log("req.user", req.user);
    console.log("req.body of bet_history", req.body.id);
    req.body.id;
    const schema = Joi.object({
      id: Joi.string().required(),
      role: Joi.string().required(),
    });
    const id = {
      id: req.body.id,
      role: req.body.role,
    };
    const validated_body = schema.validate(id);
    if (validated_body.value.role === "7") {
      const query_for_last_bet = {
        order: [["createdAt", "DESC"]],
        limit: 1,
        raw: true,
      };

      const last_bet = await FindAllBet(query_for_last_bet);
      //console.log("last_bet",last_bet);

      const query_for_last_draw = {
        order: [["draw_id", "DESC"]],
        limit: 1,
        raw: true,
      };
      const last_draw_id = await FindLastDraw(query_for_last_draw);
      let sql =
        "select dt.draw_id,dt.numbers_drawn,case when dt.draw_id is null then '-' else 999 end as winamount ,pb.*,dt.* from Placebet pb left join DrawTable dt ON pb.draw_id=dt.draw_id where pb.client_id='" +
        req.body.id +
        "' ORDER BY pb.createdAt DESC LIMIT 10";
      console.log("sql", sql);
      let bet_history = await dataAPI.query(sql, {
        type: dataAPI.QueryTypes.SELECT,
      });
      console.log("bet_history", bet_history);
      for (bet of bet_history) {
        let number_choosen_by_bet_placer = bet.num10;
        let number_choosen_by_game_engine = bet.numbers_drawn;
        let betted_numbers = number_choosen_by_bet_placer.slice(1, -1);
        //number_choosen_by_game_engine.slice(1,-1);
        if (number_choosen_by_game_engine != null) {
          const arr1 = betted_numbers.split(",");
          const arr2 = number_choosen_by_game_engine.split(",");
          console.log("number_choosen_by_bet_placer", typeof arr1);
          console.log("number_choosen_by_game_engine", typeof arr2);
          console.log("arr1", arr1);
          console.log("arr2", arr2);

          const commonElements = findCommonElements(arr2, arr1);
          console.log("commonElements", commonElements);
          //bet.winamount = commonElements.length;
          const query = { attributes: ["numbers_match", "payout"], raw: true };
          const payout_table = await PayOutTableServices(query);
          console.log("payout_table", payout_table);
          //const total_number_selected_by_bet_placer = numbers_selected_by_bet_placer.length;
          //console.log(numbers_selected_by_bet_placer.length);
          const numbers_matched = commonElements.length;
          console.log("numbers_matched", numbers_matched);
          var rtp;
          for (let i of payout_table) {
            console.log("i", i);
            //console.log("commonElements.length",commonElements.length);

            if (commonElements.length == i.numbers_match) {
              console.log("i.numbers_match", i.numbers_match);
              rtp = i.payout;
              console.log("i.payout", i.payout);
              console.log("rtp", rtp);
            } else {
              bet.winamount = 0;
            }
          }
          console.log("rtp", rtp);

          const obj_of_rtp = JSON.parse(rtp);
          console.log("obj_of_rtp", obj_of_rtp);
          let rtp_for_winning_number;
          for (const each in obj_of_rtp) {
            if (each == numbers_matched) {
              rtp_for_winning_number = obj_of_rtp[each];
            }
          }
          console.log("winned rtp", rtp_for_winning_number);
          const placed_bet_amount = bet.bet_amount;
          const win_amount = placed_bet_amount * rtp_for_winning_number;
          console.log("win_amount", win_amount);
          bet.winamount = win_amount;
        } else {
          bet.winamount = 0;
        }
      }
      if (bet_history.length !== 0) {
        for (let i = 0; i < bet_history.length; i++) {
          console.log("bet_history", bet_history[i].win_amount);
          const win = await Placebet.update(
            { win_amount: bet_history[i].win_amount },
            { where: { client_id: bet_history[i].client_id } }
          );
          console.log("win", win);
        }

        if (last_bet.draw_id < last_draw_id.draw_id) {
          return res.status(200).send({
            bet_history: bet_history,
            message: responseMessage.BET_HISTORY_FOUND,
            error: false,
          });
        } else {
          return res.status(200).send({
            bet_history: bet_history,
            error: false,
          });
        }

        // return res.status(200).send({
        //   bet_history: bet_history,
        //   message: responseMessage.BET_HISTORY_FOUND,
        //   error: false,
        // });
      } else {
        return res.status(400).send({
          bet_history: bet_history,
          message: responseMessage.BET_HISTORY_NOT_FOUND,
          error: true,
        });
      }
    } else if (validated_body.value.role === "8") {
      const bet_history = await Placebet.findAndCountAll({
        where: { client_id: validated_body.value.id },
      });
      console.log("bet_history", bet_history.count);
      console.log("bet_history", bet_history.rows);
      if (bet_history.count !== 0) {
        return res.status(200).send({
          bet_history: bet_history,
          message: responseMessage.BET_HISTORY_FOUND,
          error: false,
        });
      } else {
        return res.status(400).send({
          bet_history: bet_history,
          message: responseMessage.BET_HISTORY_NOT_FOUND,
          error: true,
        });
      }
    } else {
      return res.status(400).send({
        message: responseMessage.INCORRECT_CLIENT_ID,
        error: true,
      });
    }
  } catch (e) {
    console.log("e", e);
    next();
  }
};
// get transaction history
let get_transaction_history = async (req, res, next) => {
  req.body.id;
  const schema = Joi.object({
    id: Joi.string().required(),
    role: Joi.string().required(),
  });
  const id = {
    id: req.body.id,
    role: req.body.role,
  };
  const validated_body = schema.validate(id);
  if (validated_body.value.role === "7") {
    let transaction_history = await Placebet.findAndCountAll({
      where: { client_id: validated_body.value.id },
    });
    let count = transaction_history.count;
    let trans_history;
    console.log("transaction_history.rows", transaction_history.count);
    for (let i = 0; i < count; i++) {
      delete transaction_history.rows[i].dataValues.contact,
        delete transaction_history.rows[i].dataValues.role,
        delete transaction_history.rows[i].dataValues.num10;
      trans_history = transaction_history;
    }
    console.log("transaction history", transaction_history);
    if (transaction_history.count !== 0) {
      return res.status(200).send({
        transaction_history: trans_history,
        message: responseMessage.TRANSACTION_HISTORY_FOUND,
        error: false,
      });
    } else {
      return res.status(400).send({
        transaction_history: transaction_history,
        message: responseMessage.TRANSACTION_HISTORY_NOT_FOUND,
        error: true,
      });
    }
  } else if (validated_body.value.role === "8") {
    //const transaction_history = await Placebet.findAndCountAll({where : {client_id : validated_body.value.id}});

    return res.status(200).send({
      message: responseMessage.TRANSACTION_HISTORY_NOT_FOUND,
      error: false,
    });
  } else {
    return res.status(400).send({
      message: responseMessage.INCORRECT_ID,
      error: true,
    });
  }
};
//get overall transaction report
let over_all_transaction_report = async (req, res, next) => {
  try {
    // if(req.user.id=="abc"){
    //   const query_for_admin_transaction = {raw:true};
    //   const admin_transaction_data = await FindTransaction();
    //   console.log("admin_transaction_data",admin_transaction_data);
    //   if (admin_transaction_data) {

    //     res.status(200).json({
    //       responseMessage: "overall transaction history found",
    //       admin_transaction_data: admin_transaction_data,
    //       operator_id : "abc",
    //       operator_name : "robin",
    //       error: false,
    //     });
    //   } else {
    //     res.status(400).json({
    //       responseMessage: "overall transaction history not found",
    //       error: true,
    //     });
    //   }

    // }else{
    const query_to_find_operator = {
      where: { client_id: req.user.id },
      raw: true,
    };
    const operator = await FindSpecificClient(query_to_find_operator);
    let sql_for_overall_transaction =
    "select ts.client_id,ct.user_name,ct.name,ts.transaction_id,ct.client_id,ct.created_by,ts.draw,ts.add,ts.createdAt from Client ct left join Transaction ts ON ts.client_id=ct.client_id";
    let over_all_transaction_history = await dataAPI.query(sql_for_overall_transaction, {
       type: dataAPI.QueryTypes.SELECT,
     });
    // const query_for_admin_transaction = { raw: true };
    // const over_all_transaction_history = await FindTransaction();
    // console.log("over_all_transaction_history", over_all_transaction_history);

    if (over_all_transaction_history) {
      res.status(200).json({
        responseMessage: "overall transaction history found",
        over_all_transaction_history: over_all_transaction_history,
        operator_id: req.user.id,
        operator_name: operator.name,
        error: false,
      });
    } else {
      res.status(400).json({
        responseMessage: "overall transaction history not found",
        error: true,
      });
    }

    //}
  } catch (e) {
    console.log("error", e);
  }
};
//payout
let payOut = async (req, res, next) => {
  try {
    const payoutObject = {
      4: "3",
      5: "6",
      6: "18",
      7: "120",
      8: "1800",
      9: "4200",
      10: "5000",
    };
    console.log(payoutObject[5]);
    let payOutAmount;
    //const payoutObject = JSON.parse(payoutJson);
    const keys = Object.keys(payoutObject);
    console.log(keys);
    const quickPick = req.body.quickPick;
    for (q of keys) {
      if (quickPick == keys) payOutAmount = payoutObject[quickPick];
      console.log(q);
      console.log("i am quick pick", payoutObject[quickPick]);
      return res.status(200).send({
        payOutAmount: payOutAmount,
        error: false,
      });
    }
    console.log(quickPick);
    //const y = JSON.parse(payoutObject);
    //console.log(y);
  } catch (e) {
    console.log("error is ", e);
  }
};

module.exports = {
  draw_id: draw_id,
  place_bet: place_bet,
  get_placed_bet: get_placed_bet,
  gen_random: gen_random,
  add_balance: add_balance,
  withdraw_balance: withdraw_balance,
  get_bet_history: get_bet_history,
  get_transaction_history: get_transaction_history,
  payOut: payOut,
  save_multiple_bet: save_multiple_bet,
  over_all_transaction_report: over_all_transaction_report,
  update_balance:update_balance
};
