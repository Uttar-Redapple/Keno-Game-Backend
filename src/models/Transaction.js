"use strict";
/**
 * Module Dependencies
 */
const { Sequelize, DataTypes } = require("sequelize");
const { dataAPI } = require("../../www/db/db");
const { INTEGER } = require("sequelize");

const Transaction = dataAPI.define(
  "Transaction",
  {
    transaction_id: {
      // Integer Datatype
      type: Sequelize.STRING,
      // To uniquely identify user
      primaryKey: true
    },
    client_id: {
      // Integer Datatype
      type: Sequelize.STRING
    },
    previous_amount: {
      type: Sequelize.INTEGER,
    },
    draw: {
      type: Sequelize.INTEGER,
    },
    add: {
      type: Sequelize.INTEGER,
    },
    after_add_or_draw_amount: {
      type: Sequelize.INTEGER,
    }
  },
  {
    freezeTableName: true,
    paranoid: true,
    soft_delete: "soft_delete",
    created_at: "created_at",
    modified_at: "modified_at",
  }
);
Transaction.sync();

module.exports = Transaction;
