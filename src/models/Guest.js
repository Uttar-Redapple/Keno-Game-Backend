"use strict";
/**
 * Module Dependencies
 */
const { Sequelize, DataTypes } = require("sequelize");
const { dataAPI } = require("../../www/db/db");
const { INTEGER } = require("sequelize");

const Guest = dataAPI.define(
  "Guest",
  {
    guest_id: {
      // Integer Datatype
      type: Sequelize.STRING,
      // To uniquely identify user
      primaryKey: true,
      foreignKey: 'Guest_id', 
      foreignKeyConstraint: true,
      
    },
    creater_id: {
      // Integer Datatype
      type: Sequelize.STRING,
      
    },
    draw_or_add: {
      type: Sequelize.INTEGER,
    },
    total_amount: {
      type: Sequelize.INTEGER,
    },
    user_name: {
      type: Sequelize.STRING,
      
    },
    contact: {
      type: Sequelize.STRING,
      unique: true,
      
    },
    created_by: {
      type: Sequelize.ENUM,
      values: ["1", "2", "3", "4", "5", "6"],
      
    },
  },
  {
    freezeTableName: true,
    paranoid : true,
    soft_delete : 'soft_delete',
    created_at : 'created_at',
    modified_at : 'modified_at'
  }
);
Guest.sync();


module.exports = Guest;