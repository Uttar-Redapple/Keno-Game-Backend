"use strict";
/**
 * Module Dependencies
 */
const { Sequelize, DataTypes } = require("sequelize");
const { dataAPI } = require("../../www/db/db");
const { INTEGER } = require("sequelize");

const PayOutTable92 = dataAPI.define(
  "PayOutTable92",
  {
    
    numbers_match: {
      // Integer Datatype
      type: Sequelize.INTEGER,
      
    },
    payout: {
      type: Sequelize.FLOAT,
    },
    probability: {
      type: Sequelize.FLOAT,
    }
  },
  {
    
    freezeTableName: true,
    paranoid : true,
    soft_delete : 'soft_delete',
    created_at : 'created_at',
    modified_at : 'modified_at'
  }
);
PayOutTable92.sync();


module.exports = PayOutTable92;