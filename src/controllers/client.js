const check = require('../libs/checkLib')
const appConfig = require('../../config/appConfig');
const time = require('../libs/timeLib');
const otpLib = require('../libs/otpLib');
const notification = require('../libs/notificationLib');
const { v4: uuidv4 } = require('uuid');
const tokenLib = require('../libs/tokenLib');
const passwordLib = require('../libs/passwordLib');
const  clientModel = require('../models/Client');
const Client = require('../models/Client');
const jwt = require('jsonwebtoken');
const Joi = require ('joi');
const apiError = require('../libs/apiError');
const bcrypt = require('bcrypt');
const resMessage = require('../libs/responseMessage');
const responseMessage = require('../libs/responseMessage');
//const Email = require('../libs/paramsValidationLib');


//const response = require('../libs/response');

let login = async(req, res) => {
console.log("secretOrPrivateKey is ",process.env.ENC_KEY);
const client = await Client.findOne({ where : {e_mail : req.body.e_mail }});
console.log("i am client",client);
if(client){
  passwordMatch = await bcrypt.compare(req.body.password,client.password)
  console.log("i am inside login",req.body);
   //const password_valid = req.body.password==client.password;
   //console.log("i am password match",passwordMatch);
   if(passwordMatch){
       token = jwt.sign({ "id" : client.client_id,"email" : client.e_mail},process.env.ENC_KEY);
       res.status(200).json({ message : resMessage.LOGIN_SUCCESS,token : token,error : false ,created_by : client.created_by});
   } else {
     res.status(400).json({ message : resMessage.PASSWORD_INCORRECT,error : true});
   }
 
 }else{
   res.status(404).json({ message : resMessage.CLIENT_DOES_NOT_EXIST,error : true });
 }
 
}


let create = async(req, res,next) => { 

 let clientId = uuidv4();

  try{ 
  console.log("I am req",req.body);

  //console.log("i am EmailValid",Email.Email(req.body.e_mail));
    
      //console.log("i am the hashed password",passwordHash);

    //  if(!Email.Email(req.body.email)){

    //   res.status(500).send({
    //     message:
    //       err.message || responseMessage.INVALID_EMAIL,error : true
    //   });

    //    //console.log( "i am error",apiError.invalid(responseMessage.INVALID_EMAIL));
    //  }

     const schema =  Joi.object({
      //client_id: Joi.string().required(),
      e_mail: Joi.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/).required(),
      password: Joi.string().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#.])[A-Za-zd$@$!%*?&.]{8,20}/) .required().min(8).max(20),
      status: Joi.string().required(),
      name: Joi.required().required(),
      client_role: Joi.string().required(),
      created_by: Joi.string().required(),
      contact : Joi.number().required(),
      user_name : Joi.string().required()
     })
      const client = {
        //client_id: req.body.client_id,
        e_mail: req.body.e_mail,
        password: req.body.password,
        status: req.body.status,
        name: req.body.name,
        client_role: req.body.client_role,
        created_by: req.body.created_by,
        contact : req.body.contact,
        user_name : req.body.user_name
      
    };
    const validatedBody = schema.validate(client);
    
    // Save Client in the database
    const passwordHash = await bcrypt.hash(req.body.password,10);
    validatedBody.value.password = passwordHash;
    validatedBody.value.client_id = clientId;
    console.log("client data",validatedBody.value);
    Client.create(validatedBody.value)
      .then(data => {
        res.status(200).send({
          
            data :data, message : responseMessage.CLIENT_CREATED,error : false
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || responseMessage.CLIENT_NOT_CREATED,error : true
        });
      });
  }
  catch(error) {
        return next(error)
    }
  
  
};
//Client list
let find_all_clients = async (req,res,next)=>{

  console.log("i am from req.param ",req.body.client_role);
  const client = await Client.findAll({ where : {client_role : req.body.client_role }});
  console.log("we are existing clients",client);
  if(client){

    
     
         res.status(200).json({ client : client });
     
   
   }else{
     res.status(404).json({ error : responseMessage.CLIENT_DOES_NOT_EXIST ,error : true});
   }
   
   };
module.exports = {
    create : create,
    login: login,
    find_all_clients : find_all_clients

}