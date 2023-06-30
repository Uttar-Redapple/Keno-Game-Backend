"use strict";
/**
 * Module Dependencies
 */
const { Sequelize, DataTypes } = require("sequelize");
const { dataAPI } = require("../../www/db/db");
const { INTEGER } = require("sequelize");

const Client = dataAPI.define(
  "Client",
  {
    client_id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: "111",
    },
    creater_id: {
      type: Sequelize.STRING,
      defaultValue: "1",
    },
    e_mail: {
      type: Sequelize.STRING,
      defaultValue: "",
      unique: true,
      default: "redApple@gmail.com",
    },
    password: {
      type: Sequelize.STRING,
      default: "red",
      unique: false,
    },
    otp: {
      type: Sequelize.INTEGER,
    },
    otp_time: {
      type: Sequelize.INTEGER,
    },
    amount: {
      type: Sequelize.INTEGER,
    },
    withdrawn_amount: {
      type: Sequelize.INTEGER,
    },
    balance: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.STRING,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    name: {
      type: Sequelize.STRING,
      default: "redApple",
    },
    user_name: {
      type: Sequelize.STRING,
      unique: true,
      default: "redApple123",
    },
    contact: {
      type: Sequelize.STRING,
      unique: true,
      default: "1234567890",
    },
    create: {
      type: Sequelize.ENUM,
      values: ["0", "1"],
    },
    update: {
      type: Sequelize.ENUM,
      values: ["0", "1"],
    },
    delete: {
      type: Sequelize.ENUM,
      values: ["0", "1"],
    },
    client_role: {
      type: Sequelize.ENUM,
      values: ["1", "2", "3", "4", "5", "6", "7", "8"],
      defaultValue: "1",
    },
    created_by: {
      type: Sequelize.ENUM,
      values: ["1", "2", "3", "4", "5", "6"],
      defaultValue: "1",
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
Client.sync();
(async () => {
  const result = await Client.findOne({ where: { client_role: "1" } });
  if (result) {
    console.log("Default Admin 😀 .");
  } else {
    // password is robin
    
    let obj = {
      client_id: "abc",
      e_mail: "robin@gmail.com",
      password:"$2b$10$jAEn1ccCryB3Z94pXLvAIu7ioJPAmYUGXxOg/X21s23kG0t09x732",
      status: "active",
      name: "Robin",
      client_role: "1",
      create: "1",
      update: "1",
      delete: "1",
      created_by: "1",
      contact: "8744075567",
      user_name: "robin123",
    };

    const created = await Client.create(obj);

    if (created) {
      console.log("DEFAULT ADMIN Created 😀 ", created);
    }
  }
}).call();

module.exports = Client;