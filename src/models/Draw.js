"use strict";
/**
 * Module Dependencies
 */
const { Sequelize, DataTypes } = require("sequelize");
const { dataAPI } = require("../../www/db/db");
const { INTEGER } = require("sequelize");

const DrawTable = dataAPI.define(
  "DrawTable",
  {
    draw_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: 80001
      
    },
    numbers_drawn: {
      // Integer Datatype
      type: Sequelize.STRING
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
DrawTable.sync();

module.exports = DrawTable;
