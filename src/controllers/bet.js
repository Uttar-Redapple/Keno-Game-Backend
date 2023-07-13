const { v4: uuidv4 } = require("uuid");
const Placebet = require("../models/Placebet");
const Account = require("../models/Account");
const Client = require("../models/Client");
const Guest = require("../models/Guest");
const Joi = require("joi");
const apiError = require("../libs/apiError");
const bcrypt = require("bcrypt");
const responseMessage = require("../libs/responseMessage");
const { Op, Transaction } = require("sequelize");
const appConfig = require("../../config/appConfig");
const pRNG = appConfig.pRNG;

// save bet data 

let place_bet = async (req, res,next) => {
  try {
    
    let guest_id = uuidv4();
    let bet_id = uuidv4();
    let draw_id = uuidv4();
    const schema = Joi.object({
        contact : Joi.number().required(),
        user_name : Joi.string().required(),
        role : Joi.string(),
        num10: Joi.string().required(),
        add_amount: Joi.number().required(),
        bet_amount: Joi.number().required(),
        total_amount: Joi.number().required(),
        draw_date : Joi.date().required(),
        draw_time : Joi.string().required()
      });
    const bet = {
        contact : req.body.contact,
        user_name : req.body.user_name,
        role : req.body.role,
        num10: req.body.number_select,
        bet_amount: req.body.bet_amount,
        total_amount: req.body.total_amount,
        draw_date : req.body.draw_date,
        draw_time : req.body.draw_time,
        contact : req.body.contact
    };
    const validated_body = schema.validate(bet); 
    if(validated_body.value.role === "7")
    {
      const player = await Client.findOne({ where: { user_name: validated_body.value.user_name } });
      validated_body.value.client_id = player.dataValues.client_id;
      validated_body.value.bet_id = bet_id;
    
    console.log("validatedBody",validated_body.value);
    const amount = await Client.findOne({ where: { user_name: validated_body.value.user_name } });
    if(amount.dataValues.amount >= validated_body.value.bet_amount)
    {
      const bet_created = await Placebet.create(validated_body.value);
      if (bet_created) {
        console.log("amount",amount.dataValues.amount);
        const prev_bal = amount.dataValues.amount ;
        console.log("prev_bal",prev_bal);
        console.log("validated_body.value.bet_amount",validated_body.value.bet_amount);
        
        let curr_bal = prev_bal-validated_body.value.bet_amount ;
        console.log("curr_bal",curr_bal);
        console.log("amount.dataValues.client_id",amount.dataValues.client_id);
        const bal_update = await Client.update({ amount: curr_bal },{ where: { client_id: amount.dataValues.client_id } });
        console.log("bal_update",bal_update);
        //const amount_bet_table = await Placebet.update({ amount: curr_bal },{ where: { client_id: validated_body.value.user_name } })
            res.status(200).send({
              data: bet_created,
              message: responseMessage.BET_PLACED,
              curr_bal : curr_bal,
              error: false,
            });
          } else {
            res.status(500).send({
              message: err.message || responseMessage.BET_COULD_NOT_PLACED,
              error: true,
            });
          }

    }
    else{
      return res.status(400).send({
        message : responseMessage.BET_AMOUNT_CONFLICT,
        error : true
      })

    }
  
    }
    else if(validated_body.value === "8"){
    validated_body.value.client_id = guest_id;
    validated_body.value.bet_id = bet_id;
    
    console.log("validatedBody",validated_body.value);
    const bet_created = await Placebet.create(validated_body.value);
    const check_guest = await Guest.findOne({where : {user_name : validated_body.value.user_name}});
    console.log("check_guest",check_guest);
    if(!check_guest&&(validated_body.value.role==="8")){
      delete validated_body.value.role;
      delete validated_body.value.bet_id;
      delete validated_body.value.num10;
      delete validated_body.value.bet_amount;
      delete validated_body.value.draw_date;
      delete validated_body.value.draw_time; 
      validated_body.value.guest_id = validated_body.value.client_id;
      delete validated_body.client_id;
      console.log("guest",validated_body.value);
      const new_guest = await Guest.create(validated_body.value) ;
      console.log("new_guest",new_guest);

    }
    console.log("validated body",validated_body.value);
    
    if (bet_created) {
        res.status(200).send({
          data: bet_created,
          message: responseMessage.BET_PLACED,
          curr_bal : curr_bal,
          error: false,
        });
      } else {
        res.status(500).send({
          message: err.message || responseMessage.BET_COULD_NOT_PLACED,
          error: true,
        });
      }

    }
    else{
      return res.status(401).send({
        message: responseMessage.ROLE_CONFLICT,
        error: true,
      });
    }
    
    
    
  } catch (error) {
    return next(error);
  }
};

// get saved data

let get_placed_bet = async (req,res,next) => {
    try{

        const schema = Joi.object({
            bet_id: Joi.string().required
          });
        const bet = {
            bet_id: req.body.bet_id
        };
        console.log("req.body.bet_id",req.body.bet_id);
        const validated_body = schema.validate(bet); 
        console.log("validated_body",validated_body.value);
        const bet_details = await Placebet.findOne({
            where: { bet_id: req.body.bet_id }
          });
        console.log("bet_details",bet_details);
        //const client_detail = await Client.findOne({where : {client_id : bet_details.dataValues.client_id}});
          if (bet_details) {
            res.status(200).send({
              data: bet_details,
              draw_numbers : "35,56,78,54,33,87,89,88,44,22",
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
          const num = bet_details.dataValues.num10 ;
          console.log("num",num);
          console.log("num",num[0]);
          console.log("num.length",num.length);
          const sliced = num.slice(1,num.length-1)
          const num_val = sliced.split(",");
          console.log("bet_details.data",num_val);
          //typeof(parseInt(num_val[0]))
        

    }
    catch(error){
      return next(error);

    }
}

//gen random
let gen_random = async(req,res,next) =>{
  req.body.total_number;
  //console.log ("prng",pRNG);
  let rand_num = [];
  let rand;
  function getRandomArbitrary(min, max) {
    return (pRNG.random() * (max - min) + min);
  }
  for(i=0;i<40;i++){
   rand = Math.floor(getRandomArbitrary(1,80));
   rand_num.push(rand);
  }

  function hasDuplicates(a) {

    const noDups = new Set(a);
  
    return noDups;
  }
  const dup_removed = hasDuplicates(rand_num);
  const array = Array.from(dup_removed);
  console.log(dup_removed,dup_removed.length);
  console.log("rand",rand_num,rand_num.length);
  console.log("array",array);
  res.status(200).json({
    rand : rand_num,
    array : array,
    length : array.length
  })
};

//add balance
let add_balance = async (req,res,next) => {
  try {
    const schema = Joi.object({
      client_id: Joi.string().required(),
      amount : Joi.number().integer().required()
    });
    
    
  const add_bal = {
      client_id: req.body.client_id,
      amount : req.body.amount
  };
  const validated_body = await schema.validate(add_bal); 
  
  console.log("validated_body",validated_body.value);
  const amount = await Client.findOne({ where: { client_id: validated_body.value.client_id } });
  console.log("amount",amount.dataValues.amount);
  const prev_bal = amount.dataValues.amount ;
  let curr_bal = prev_bal+validated_body.value.amount ;
  const bal_update = await Client.update({ amount: curr_bal },{ where: { client_id: validated_body.value.client_id } });
  //const amount_bet_table = await Placebet.update({ total_amount: curr_bal },{ where: { client_id: validated_body.value.user_name } })
  console.log("amount",amount.dataValues.amount);
  console.log("new_amount",curr_bal);
  res.status(200).json({responseMessage : "your balance has been updated successfully",updated_amount : curr_bal});
  }
  catch (error){
    
    return next(error);

  }

}

// get bet history
let get_bet_history = async (req,res,next) => {
 req.body.id
 const schema = Joi.object({
  id : Joi.string().required(),
  role : Joi.string().required()
});
const id = {
  id : req.body.id,
  role : req.body.role
};
const validated_body = schema.validate(id); 
if(validated_body.value.role === "7"){
  const bet_history = await Placebet.findAndCountAll({where : {client_id : validated_body.value.id}})
  return res.status(200).send({
    bet_history : bet_history,
    message : responseMessage.BET_HISTORY_FOUND,
    error : false
  })

}
else if(validated_body.value.role === "8"){
  const bet_history = await Placebet.findAndCountAll({where : {client_id : validated_body.value.id}});
  console.log("bet_history",bet_history);
  return res.status(400).send({
    
    message : responseMessage.BET_HISTORY_NOT_FOUND,
    error : TRUE
  })
}
else {
  return res.status(400).send({
    message : responseMessage.INCORRECT_BET_ID,
    error : true
  })
}
}
// get transaction history
let get_transaction_history = async (req,res,next) => {
  req.body.id
  const schema = Joi.object({
   id : Joi.string().required(),
   role : Joi.string().required()
 });
 const id = {
   id : req.body.id,
   role : req.body.role
 };
 const validated_body = schema.validate(id); 
 if(validated_body.value.role === "7"){
   let transaction_history = await Placebet.findAndCountAll({where : {client_id : validated_body.value.id}})
   let count = transaction_history.count;
   let trans_history ;
   console.log("transaction_history.rows",transaction_history.count);
   for(let i = 0;i<count;i++){
    delete transaction_history.rows[i].dataValues.contact,
    delete transaction_history.rows[i].dataValues.role,
    delete transaction_history.rows[i].dataValues.num10
    trans_history = transaction_history;
  }
  console.log("transaction history",transaction_history);
   return res.status(200).send({
    
     transaction_history : trans_history,
     message : responseMessage.TRANSACTION_HISTORY_FOUND,
     error : false
   })
 
 }
 else if(validated_body.value.role === "8"){
   const transaction_history = await Placebet.findAndCountAll({where : {client_id : validated_body.value.id}});
   return res.status(200).send({
     
     message : responseMessage.TRANSACTION_HISTORY_NOT_FOUND,
     error : false
   })
 }
 else {
   return res.status(400).send({
     message : responseMessage.INCORRECT_ID,
     error : true
   })
 }
 }

module.exports = {
    place_bet: place_bet,
    get_placed_bet : get_placed_bet,
    gen_random : gen_random,
    add_balance :add_balance,
    get_bet_history : get_bet_history,
    get_transaction_history : get_transaction_history
  };