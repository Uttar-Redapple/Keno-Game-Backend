const response = require('./../libs/responseLib')
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
//const response = require('../libs/response');

let login = async(req, res) => {
console.log("secretOrPrivateKey is ",process.env.ENC_KEY);
const client = await Client.findOne({ where : {e_mail : req.body.e_mail }});
if(client){

  console.log("i am inside login",req.body);
   const password_valid = req.body.password==client.password;
   if(password_valid){
       token = jwt.sign({ "id" : client.client_id,"email" : client.e_mail},process.env.ENC_KEY);
       res.status(200).json({ token : token });
   } else {
     res.status(400).json({ error : "Password Incorrect" });
   }
 
 }else{
   res.status(404).json({ error : "Client does not exist" });
 }
 
}


let create = async(req, res,next) => { 
  try{ 
  console.log("I am req",req.body);
      const client = {
        client_id: req.body.client_id,
        e_mail: req.body.e_mail,
        password: req.body.password,
        status: req.body.status,
        name: req.body.name,
        client_role: req.body.client_role,
        created_by: req.body.created_by,
      published: req.body.published ? req.body.published : false
    };
  
    // Save Client in the database
    Client.create(client)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the client."
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
     res.status(404).json({ error : "Client_role does not exist" });
   }
   
   };
module.exports = {
    create : create,
    login: login,
    find_all_clients : find_all_clients

}