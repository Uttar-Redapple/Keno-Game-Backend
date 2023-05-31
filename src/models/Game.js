'use strict'
/**
 * Module Dependencies
 */
const { Sequelize, DataTypes } = require('sequelize');
const {dataAPI} = require('../../www/db/db')


const Game = dataAPI.define('Game',{
    game_id:{

        // Integer Datatype
        type:Sequelize.STRING,
        // To uniquely identify user
        primaryKey:true
     },
    bet_id: {
        type: Sequelize.STRING
    },
    game_status: {
        type: Sequelize.STRING,
        enum: ['active', 'inactive', 'deleted'],
        default: 'active'
    },
    game_name : {
        type : Sequelize.STRING
    },
    game_image : {
        type : Sequelize.STRING
    },
    rtp_calculation : {
        type : Sequelize.STRING
    },
    created_by:{
        type: Sequelize.ENUM,
        values: ['1','2','3','4','5','6']
    }
}, {
    freezeTableName: true
  });
Game.sync() 
module.exports = Game ;