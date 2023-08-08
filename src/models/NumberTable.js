"use strict";
/**
 * Module Dependencies
 */
const { Sequelize, DataTypes } = require("sequelize");
const { dataAPI } = require("../../www/db/db");
const { INTEGER } = require("sequelize");

const NumberTable = dataAPI.define(
  "NumberTable",
  {
    number: {
      type: Sequelize.INTEGER,
    },
    occurance: {
      // Integer Datatype
      type: Sequelize.INTEGER,
      defaultValue: 0,
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
NumberTable.sync();

module.exports = NumberTable;
