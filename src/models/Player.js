'use strict'
/**
 * Module Dependencies
 */
const { Sequelize, DataTypes } = require('sequelize');
const {dataAPI} = require('../../www/db/db')


const Player = dataAPI.define('Player',{
    player_id:{

        // Integer Datatype
        type:Sequelize.STRING,
        // To uniquely identify user
        primaryKey:true
     },
     game_id: {
        type: Sequelize.STRING,
        references: {
            model: "Game",
            key: "game_id"
        }
    },
    player_status: {
        type: Sequelize.STRING,
        enum: ['active', 'inactive', 'deleted'],
        default: 'active'
    },
    player_name : {
        type : Sequelize.STRING
    },
    player_image : {
        type : Sequelize.STRING
    },
    amount : {
        type : Sequelize.STRING
    },
    created_by:{
        type: Sequelize.ENUM,
        values: ['1','2','3','4','5','6']
    }
}, {
    freezeTableName: true
  });
Player.sync() 
module.exports = Player ;