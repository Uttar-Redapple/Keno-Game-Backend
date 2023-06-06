const check = require('../libs/checkLib')
const appConfig = require('../../config/appConfig');
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
const verifytoken = require("../libs/tokenLib");
//const Email = require('../libs/paramsValidationLib');


//const response = require('../libs/response');

let login = async(req, res,next) => {
  try{
console.log("secretOrPrivateKey is ",process.env.ENC_KEY);
const client = await Client.findOne({ where : {e_mail : req.body.e_mail }});
console.log("i am client",client);
if(client){
  passwordMatch = await bcrypt.compare(req.body.password,client.password)
  console.log("i am inside login",req.body);
   if(passwordMatch){
       token = jwt.sign({ "id" : client.client_id,"email" : client.e_mail},process.env.ENC_KEY);
       res.status(200).json({ message : resMessage.LOGIN_SUCCESS,token : token,error : false ,created_by : client.created_by,creater_id : client.creater_id});
   } else {
     res.status(400).json({ message : resMessage.PASSWORD_INCORRECT,error : true});
   }
 
 }else{
   res.status(404).json({ message : resMessage.CLIENT_DOES_NOT_EXIST,error : true });
 }
}
catch(error) {
  return next(error)
}
}

//creating a client
let create = async(req, res,next) => { 

 let clientId = uuidv4();

  try{ 
  console.log("I am req",req.body);
     const schema =  Joi.object({
      //client_id: Joi.string().required(),
      
      e_mail: Joi.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/).required(),
      password: Joi.string().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#.])[A-Za-zd$@$!%*?&.]{8,20}/) .required().min(8).max(20),
      status: Joi.string().required(),
      name: Joi.string().required(),
      client_role: Joi.number().required(),
      contact : Joi.string().required(),
      user_name : Joi.string().required()
     })
      const client = {
        e_mail: req.body.e_mail,
        password: req.body.password,
        status: req.body.status,
        name: req.body.name,
        client_role: req.body.client_role,
        contact : req.body.contact,
        user_name : req.body.user_name
      
    };
    const validatedBody = schema.validate(client);
    const loggedInClient = await Client.findOne({ where : {client_id : req.client_id}});
    
    console.log("i am loggedInClient",loggedInClient);
    const {dataValues} = loggedInClient;
    // Save Client in the database
    const passwordHash = await bcrypt.hash(req.body.password,10);
    validatedBody.value.password = passwordHash;
    validatedBody.value.client_id = clientId;
    validatedBody.value.creater_id = req.client_id;
    validatedBody.value.created_by = dataValues.client_role;
    console.log("client data",validatedBody.value);
    client_role = parseInt(validatedBody.value.client_role);
    created_by = parseInt(validatedBody.value.created_by);

    
    if (client_role > created_by)
    {
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
    else{
      throw apiError.conflict(responseMessage.ROLE_CONFLICT)
    }  
  }
  catch(error) {
        return next(error)
    }
  
  
};
//edit_created_client
  
let edit_created_client = async (req,res,next)=>{
 
  const schema =  Joi.object({
    //client_id: Joi.string().required(),
    
    e_mail: Joi.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/),
    password: Joi.string(),
    status: Joi.string(),
    name: Joi.string(),
    client_role: Joi.number(),
    contact : Joi.string(),
    user_name : Joi.string()
   })
    const client = {
      e_mail: req.body.e_mail,
      password: req.body.password,
      status: req.body.status,
      name: req.body.name,
      client_role: req.body.client_role,
      contact : req.body.contact,
      user_name : req.body.user_name
    
  };
  const passwordHash = await bcrypt.hash(req.body.password,10);
  const validatedBody = schema.validate(client);
  validatedBody.client_id = req.body.client_id ;
  //console.log(e_mail,req.client_id,validatedBody.value);
  const update = await Client.update({e_mail:validatedBody.value.e_mail,password : passwordHash,status : validatedBody.value.status,name : validatedBody.value.name,client_role : validatedBody.value.client_role,contact : validatedBody.value.contact,user_name : validatedBody.value.user_name},{ where : {client_id : req.body.client_id,creater_id : req.client_id }});
  if(update){
    return res.status(200).json({ update : update , message : "updated",error : false})

  }
  else{
    return res.status(404).json({ error : responseMessage.error ,error : true})
  }
}

 
  



//Client list
let find_all_clients = async (req,res,next)=>{

  //console.log("i am from req.param ",req.body.client_role);
  const client = await Client.findAll({ where : {creater_id : req.client_id}});
  console.log("we are existing clients",client);
  if(client){

    
     
         res.status(200).json({ client : client , message : responseMessage.CLIENTS_FOUND,error : false});
     
   
   }else{
     res.status(404).json({ error : responseMessage.CLIENT_DOES_NOT_EXIST ,error : true});
   }
   
   };
module.exports = {
    create : create,
    login: login,
    find_all_clients : find_all_clients,
    edit_created_client : edit_created_client

}