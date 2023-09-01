const { v4: uuidv4 } = require("uuid");
const Guest = require("../models/Guest");
const Client = require("../models/Client");
const Joi = require("joi");
const apiError = require("../libs/apiError");
const bcrypt = require("bcrypt");
const responseMessage = require("../libs/responseMessage");
const { Op, Transaction } = require("sequelize");
const appConfig = require("../../config/appConfig");
const pRNG = appConfig.pRNG;




// get saved data

let find_guest = async (req,res,next) => {
    try{

        // const schema = Joi.object({
        //     guest_id: Joi.string().required
        //   });
        // const guest = {
        //     guest_id: req.body.guest_id
        // };
        // console.log("req.body.guest_id",req.body.guest_id);
        // const validated_body = schema.validate(guest); 
        // console.log("validated_body",validated_body.value);
        const guest_details = await Guest.findAndCountAll({});
        console.log("guest_details",guest_details);
        //const client_detail = await Client.findOne({where : {client_id : guest_details.dataValues.client_id}});
          if (guest_details) {
            res.status(200).send({
              guest: guest_details,
              message: responseMessage.GUEST_FOUND,
              error: false,
            });
          } else {
            res.status(404).send({
              message: responseMessage.GUEST_NOT_FOUND,
              error: true,
            });
          }
          

    }
    catch(error){
      return next(error);

    }
}


module.exports = {
    find_guest: find_guest,
  };