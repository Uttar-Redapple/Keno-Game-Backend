'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const { generatePassword } = require('../libs/otpLib');
//const sequelize = require('sequelize');
const { Sequelize, DataTypes } = require('sequelize');
const {dataAPI} = require('../../www/db/db')

//const Client = sequelize.define('Client', )



const Clientt = dataAPI.define('Clientt',{
    client_id:{

        // Integer Datatype
        type:Sequelize.INTEGER,
  
        // Increment the value automatically
        autoIncrement:true,
  
        // user_id can not be null.
        allowNull:false,
  
        // To uniquely identify user
        primaryKey:true
     },
    e_mail: {
        type: DataTypes.STRING,
        default: '',
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        default: '',
        unique: false
    },
    status: {
        type: DataTypes.STRING,
        enum: ['active', 'inactive', 'deleted'],
        default: 'active'
    },
    name : {
        type : DataTypes.STRING
    },
    client_role: {
        type: DataTypes.STRING,
        enum: ['admin', 'sub_admin','area_manager','shop_owner','supervisor','cashier']
    },
    created_by:{
        type: DataTypes.STRING,
        default:''
    }
}, {
    freezeTableName: true
  });
  //sequelize.sync();
//   sequelize.sync({force:true})

//   const connect = async () => {
//     await Client.sync();
//   };
  
//   connect();
Clientt.sync() 
module.exports = Clientt ;