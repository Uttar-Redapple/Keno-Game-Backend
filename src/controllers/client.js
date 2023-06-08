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
  if(client.dataValues.status == "active"){
  passwordMatch = await bcrypt.compare(req.body.password,client.password)
  
  console.log("i am inside login",req.body);
   if(passwordMatch){
       token = jwt.sign({ "id" : client.client_id,"email" : client.e_mail},process.env.ENC_KEY);
       res.status(200).json({ message : resMessage.LOGIN_SUCCESS,token : token,error : false ,created_by : client.created_by,creater_id : client.creater_id,client_role : client.client_role,name : client.name});
   } else {
     res.status(400).json({ message : resMessage.PASSWORD_INCORRECT,error : true});
   }
 
 }
 else{
   res.status(404).json({ message : resMessage.CLIENT_IS_NOT_ACTIVE,error : true });
 }
}
else{
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
     //const e_mail_pattern = "/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/";
     //const password_pattern = "/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/";
     const schema =  Joi.object({
      //client_id: Joi.string().required(),
      
      e_mail: Joi.string().required().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/),
      password: Joi.string().required(),
      status: Joi.string().required(),
      name: Joi.string().required(),
      client_role: Joi.number().required(),
      create : Joi.string().required(),
      update :  Joi.string().required(),
      delete :  Joi.string().required(),
      contact : Joi.string().required(),
      user_name : Joi.string().required()
     })
      const client = {
        e_mail: req.body.e_mail,
        password: req.body.password,
        status: req.body.status,
        name: req.body.name,
        client_role: req.body.client_role,
        create :req.body.create,
        update : req.body.update,
        delete : req.body.delete,
        contact : req.body.contact,
        user_name : req.body.user_name
      
    };
    const validatedBody = schema.validate(client);
    const loggedInClient = await Client.findOne({ where : {client_id : req.client_id}});
    console.log("i am req.body",req.body.e_mail);
    const existedClient = await Client.findOne({ where : {e_mail : req.body.e_mail}});
    console.log("i am existed client",existedClient);
    const {dataValues} = loggedInClient;
    const existedClientByContactNo = await Client.findOne({ where : {contact : req.body.contact}});
    const existedClientByName = await Client.findOne({ where : {name : req.body.e_mail}});
    const existedClientByUserName = await Client.findOne({ where : {user_name : req.body.user_name}});
    if(existedClient){
      return res.status(409).send({
          
        message : responseMessage.EMAIL_EXIST,error : false
    });

    }
    else if(existedClientByContactNo){
      return res.status(409).send({
          
        message : responseMessage.CONTACT_NO_EXIST,error : true
    });
    

    }
    else if(existedClientByName){
      return res.status(409).send({
          
        message : responseMessage.NAME_EXIST,error : true
    });
  }
  else if(existedClientByUserName){
    return res.status(409).send({
        
      message : responseMessage.USER_NAME_EXIST,error : true
  });
}
    else{
    //console.log("i am loggedInClient",loggedInClient);
    
    // Save Client in the database
    const passwordHash = await bcrypt.hash(req.body.password,10);
    validatedBody.value.password = passwordHash;
    validatedBody.value.client_id = clientId;
    validatedBody.value.creater_id = req.client_id;
    validatedBody.value.created_by = dataValues.client_role;
    console.log("client data",validatedBody.value);
    client_role = parseInt(validatedBody.value.client_role);
    created_by = parseInt(validatedBody.value.created_by);

    if(validatedBody.value.create == '1')
    {
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
  else{
     return res.status(401).send({
          
      message : responseMessage.CREATING_NOT_ALLOWED,error : false
  });

  } 
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
  const loggedInClient = await Client.findOne({ where : {client_id : req.client_id}});
  if(loggedInClient.value.update =="1")
  {
    const update = await Client.update({e_mail:validatedBody.value.e_mail,password : passwordHash,status : validatedBody.value.status,name : validatedBody.value.name,client_role : validatedBody.value.client_role,contact : validatedBody.value.contact,user_name : validatedBody.value.user_name},{ where : {client_id : req.body.client_id,creater_id : req.client_id }});
  
  if(update){
    return res.status(200).json({ update : update , message : "updated",error : false})

  }
  else{
    return res.status(404).json({ error : responseMessage.error ,error : true})
  }
}
else{
  return res.status(401).json({message : responseMessage.UPDATING_NOT_ALLOWED,error : true})
}
}

//Delete Client
  
let delete_client = async (req,res,next)=>{
 
  const schema =  Joi.object({
    
    client_id : Joi.string()
   })
    const client = {
      
      client_id : req.body.client_id
    
  };
  const validatedBody = schema.validate(client);
  const loggedInClient = await Client.findOne({ where : {client_id : req.body.client_id}});
  console.log(" I am loggedin client",loggedInClient);
  if(loggedInClient.dataValues.delete =="1")
  {
    const delete_client = await Client.destroy({ where : {client_id : req.body.client_id,creater_id : req.client_id }});
  
  if(delete_client){
    return res.status(200).json({ delete_client : delete_client , message : "deleted",error : false})

  }
  else{
    return res.status(404).json({ error : responseMessage.error ,error : true})
  }
}
else{
  return res.status(401).json({message : responseMessage.DELETION_NOT_ALLOWED,error : false})
}
}

  



//Client list
let find_all_clients = async (req,res,next)=>{

  //console.log("i am from req.param ",req.body.client_role);
  const client = await Client.findAll({ where : {creater_id : req.client_id}});
  console.log("we are existing clients",client);
  
  if(client.length){

         const players = await Client.findAll({ where : {client_role : "5"}});
         if (players){
          return res.status(200).json({ client : client ,players : players, message : responseMessage.PLAYERS_FOUND,error : false});

         }
         else{
          return res.status(200).json({ client : client ,players : players, message : responseMessage.NO_PLAYERS,error : false});
         }
     
         
     
   
   }else{
     return res.status(404).json({ message : responseMessage.NO_CLIENT_EXIST ,error : true});
   }
   
   };
module.exports = {
    create : create,
    login: login,
    find_all_clients : find_all_clients,
    edit_created_client : edit_created_client,
    delete_client : delete_client

}