"use strict";
/**
 * Module Dependencies
 */
const { Sequelize, DataTypes } = require("sequelize");
const { dataAPI } = require("../../www/db/db");
const { INTEGER } = require("sequelize");

// num1: {
//   // Integer Datatype
//   type: Sequelize.STRING,
//   defaultValue: "1",
// },
// num2: {
//   // Integer Datatype
//   type: Sequelize.STRING,
//   defaultValue: "1",
// },
// num3: {
//   // Integer Datatype
//   type: Sequelize.STRING,
//   defaultValue: "1",
// },
// num4: {
//   // Integer Datatype
//   type: Sequelize.INTEGER,
//   defaultValue: "1",
// },
// num5: {
//   // Integer Datatype
//   type: Sequelize.INTEGER,
//   defaultValue: "1",
// },
// num6: {
//   // Integer Datatype
//   type: Sequelize.INTEGER,
//   defaultValue: "1",
// },
// num7: {
//   // Integer Datatype
//   type: Sequelize.INTEGER,
//   defaultValue: "1",
// },
// num8: {
//   // Integer Datatype
//   type: Sequelize.INTEGER,
//   defaultValue: "1",
// },
// num9: {
//   // Integer Datatype
//   type: Sequelize.INTEGER,
//   defaultValue: "1",
// },
const Placebet = dataAPI.define(
  "Placebet",
  {
    bet_id: {
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
    draw_id: {
      // Integer Datatype
      type: Sequelize.STRING,
      defaultValue: "1",
    },
    name : {
      // Integer Datatype
      type: Sequelize.STRING,
      defaultValue: "1",
    },
    contact: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.INTEGER,
    },
    num10: {
      // Integer Datatype
      type: Sequelize.JSON,
      
    },
    total_amount: {
      type: Sequelize.INTEGER,
    },
    bet_amount: {
      type: Sequelize.INTEGER,
    },
    draw_or_add: {
      type: Sequelize.INTEGER,
    },
    draw_date : {
      type :Sequelize.DATE,
    },
    draw_time : {
      type : Sequelize.TIME
    }
  },
  {
    freezeTableName: true,
    paranoid : true,
    soft_delete : 'soft_delete',
    modified_at : 'modified_at'
  }
);
Placebet.sync();

module.exports = Placebet;