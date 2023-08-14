"use strict";
/**
 * Module Dependencies
 */
const { Sequelize, DataTypes } = require("sequelize");
const { dataAPI } = require("../../www/db/db");
const { INTEGER } = require("sequelize");

const PayOutTable = dataAPI.define(
  "PayOutTable",
  {
    table_percent: {
      type: Sequelize.INTEGER,
    },
    numbers_to_match: {
      // Integer Datatype
      type: Sequelize.INTEGER,
    },

    payout: {
      type: Sequelize.STRING,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
    soft_delete: "soft_delete",
    created_at: "created_at",
    modified_at: "modified_at",
  }
);
PayOutTable.sync();

module.exports = PayOutTable;
