'use strict'
/**
 * Module Dependencies
 */
const { Sequelize, DataTypes } = require('sequelize');
const {dataAPI} = require('../../www/db/db')

//const Client = sequelize.define('Client', )



const Client = dataAPI.define('Client',{
    client_id:{

        // Integer Datatype
        type:Sequelize.STRING,
        // To uniquely identify user
        primaryKey:true
     },
     creater_id:{

        // Integer Datatype
        type:Sequelize.STRING
        
     },
    e_mail: {
        type: Sequelize.STRING,
        default: '',
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        default: '',
        unique: false
    },
    status: {
        type: Sequelize.STRING,
        enum: ['active', 'inactive', 'deleted'],
        default: 'active'
    },
    name : {
        type : Sequelize.STRING
    },
    user_name : {
        type : Sequelize.STRING,
        unique: true
    },
    contact : {
        type : Sequelize.STRING,
        unique: true
    },
    client_role: {
        type: Sequelize.ENUM,
        //values: [1,2,3,4,5,6,7,8]
        values: ['1','2','3','4','5','6','7','8']
    },
    created_by:{
        type: Sequelize.ENUM,
        values: ['1','2','3','4','5','6']
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
Client.sync() 
module.exports = Client ;