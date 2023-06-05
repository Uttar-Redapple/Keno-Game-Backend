'use strict'
/**
 * Module Dependencies
 */
const { Sequelize, DataTypes } = require('sequelize');
const {dataAPI} = require('../../www/db/db')



const Client = dataAPI.define('Client',{
    client_id:{

        // Integer Datatype
        type:Sequelize.STRING,
        // To uniquely identify user
        primaryKey:true,
        defaultValue: "111"
     },
     creater_id:{

        // Integer Datatype
        type:Sequelize.STRING,
        defaultValue: "1"
        
     },
    e_mail: {
        type: Sequelize.STRING,
        defaultValue: '',
        unique: true,
        default: "redApple@gmail.com"
    },
    password: {
        type: Sequelize.STRING,
        default: 'red',
        unique: false
    },
    status: {
        type: Sequelize.STRING,
        enum: ['active', 'inactive', 'deleted'],
        default: 'active'
    },
    name : {
        type : Sequelize.STRING,
        default: "redApple"
    },
    user_name : {
        type : Sequelize.STRING,
        unique: true,
        default: "redApple123"
    },
    contact : {
        type : Sequelize.STRING,
        unique: true,
        default: "1234567890"
    },
    client_role: {
        type: Sequelize.ENUM,
        //values: [1,2,3,4,5,6,7,8]
        values: ['1','2','3','4','5','6','7','8'],
        defaultValue: "1"

    },
    created_by:{
        type: Sequelize.ENUM,
        values: ['1','2','3','4','5','6'],
        defaultValue: "1"
    }
}, {
    freezeTableName: true
  });
// password is robin

let obj = {
    client_id : "abc",       
    e_mail: "robin@gmail.com",
    password: "$2b$10$uIBURBUOxU3K.FssXuRbK..b/cVgqmhXibQuYojzHcm5yLgDMwFWe",
    status: "active",
    name: "Robin",
    client_role: "1",
    created_by: "1",
    contact : "8744075567",
    user_name : "robin123"
};

Client.create(obj);
Client.sync() 
module.exports = Client ;