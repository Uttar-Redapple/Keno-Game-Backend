const { v4: uuidv4 } = require("uuid");
const Placebet = require("../models/Placebet");
const Joi = require("joi");
const apiError = require("../libs/apiError");
const bcrypt = require("bcrypt");
const responseMessage = require("../libs/responseMessage");
const { Op } = require("sequelize");
const appConfig = require("../../config/appConfig");
const pRNG = appConfig.pRNG;

// save bet data 

let place_bet = async (req, res,next) => {
  try {
    
    let guest_id = uuidv4();
    let bet_id = uuidv4();
    let draw_id = uuidv4();
    const schema = Joi.object({
        contact : Joi.number().required,
        name : Joi.string().required,
        role : Joi.number(),
        num10: Joi.string().required(),
        bet_amount: Joi.string().required(),
        draw_date : Joi.date().required(),
        draw_time : Joi.string().required()
      });
    const bet = {
        contact : req.body.contact,
        name : req.body.name,
        role : req.body.role,
        num10: req.body.number_select,
        bet_amount: req.body.bet_amount,
        draw_date : req.body.draw_date,
        draw_time : req.body.draw_time,
        contact : req.body.contact
    };
    const validated_body = schema.validate(bet); 
    validated_body.value.client_id = guest_id;
    validated_body.value.bet_id = bet_id;
    
    console.log("validatedBody",validated_body);
    const bet_created = await Placebet.create(validated_body.value);
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
        const validated_body = schema.validate(bet); 
        console.log("validated_body",validated_body.value);
        const bet_details = await Placebet.findOne({
            where: { bet_id: req.body.bet_id }
          });

          if (bet_details) {
            res.status(200).send({
              data: bet_details,
              draw_numbers : "35,56,78,54,33,87,89,88,44,22",
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


module.exports = {
    place_bet: place_bet,
    get_placed_bet : get_placed_bet,
    gen_random : gen_random,
   
  };