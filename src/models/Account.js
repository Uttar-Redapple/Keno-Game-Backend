"use strict";
/**
 * Module Dependencies
 */
const { Sequelize, DataTypes } = require("sequelize");
const { dataAPI } = require("../../www/db/db");
const { INTEGER } = require("sequelize");

const Account = dataAPI.define(
  "Account",
  {
    transaction_id: {
      // Integer Datatype
      type: Sequelize.STRING,
      // To uniquely identify user
      primaryKey: true,
      defaultValue: "111",
    },
    client_id: {
      // Integer Datatype
      type: Sequelize.STRING,
      defaultValue: "1",
    },
    round_id: {
      // Integer Datatype
      type: Sequelize.STRING,
      defaultValue: "1",
    },
    bet_id: {
        // Integer Datatype
        type: Sequelize.STRING,
        defaultValue: "1",
      },
    bet_amount: {
      type: Sequelize.INTEGER,
    },
    win_amount: {
        type: Sequelize.INTEGER,
      },
    transaction_type: {
      type: Sequelize.STRING,
      enum: ["bet", "win", "deposit","withdraw"],
      default: "active",
    },
    draw_or_add: {
      type: Sequelize.INTEGER,
    },
    current_amount : {
      type : Sequelize.INTEGER
  },
  amount : {
    type : Sequelize.INTEGER
  },
    date : {
      type :Sequelize.DATE,
    },
    time : {
      type : Sequelize.TIME
    },
    bet_amount: {
        type: Sequelize.INTEGER,
      },
  },
  {
    freezeTableName: true,
    paranoid : true,
    soft_delete : 'soft_delete',
    modified_at : 'modified_at'
  }
);
Account.sync();

module.exports = Account;