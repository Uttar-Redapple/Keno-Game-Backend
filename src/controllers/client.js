const check = require("../libs/checkLib");
const appConfig = require("../../config/appConfig");

const { v4: uuidv4 } = require("uuid");
const tokenLib = require("../libs/tokenLib");
const passwordLib = require("../libs/passwordLib");
const clientModel = require("../models/Client");
const Client = require("../models/Client");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const apiError = require("../libs/apiError");
const bcrypt = require("bcrypt");
const resMessage = require("../libs/responseMessage");
const responseMessage = require("../libs/responseMessage");
const { Op } = require("sequelize");
const rngClass = require("../algo/rng");
const commonFunction = require("../libs/util");
const { init_genrand, genrand_int32 } = rngClass;

// get date and time from server

let get_date_and_time = async (req, res, next) => {
  try {
    const currentDate = new Date();

    const currentDayOfMonth = currentDate.getDate();
    const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
    const currentYear = currentDate.getFullYear();

    const dateString =
      currentDayOfMonth + "/" + (currentMonth + 1) + "/" + currentYear;
    var time =
      currentDate.getHours() +
      ":" +
      currentDate.getMinutes() +
      ":" +
      currentDate.getSeconds();
    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }
    console.log(getRandomArbitrary(1, 80));

    console.log(
      "currentDate",
      currentDate,
      "currentDayOfMonth",
      currentDayOfMonth,
      "currentYear",
      currentYear,
      "dateString",
      dateString,
      "current_time",
      time
    );
    return res
      .status(200)
      .json({ current_date: dateString, current_time: time, error: false });
  } catch (error) {
    return next(error);
  }
};

//login of roles other than players

let login = async (req, res, next) => {
  try {
    console.log("secretOrPrivateKey is ", process.env.ENC_KEY);
    console.log("i am client", req.body.e_mail);
    const client = await Client.findOne({ where: { e_mail: req.body.e_mail } });

    console.log("i am client", client);
    //console.log("i am client", client.dataValues.update);
    if (client) {
      if (client.client_role !== "7") {
        if (client.dataValues.status == "active") {
          passwordMatch = await bcrypt.compare(
            req.body.password,
            client.password
          );

          console.log("i am inside login", req.body);
          console.log("password match", passwordMatch);
          if (passwordMatch) {
            token = jwt.sign(
              { id: client.client_id, email: client.e_mail },
              process.env.ENC_KEY,
              { expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME }
            );
            res.status(200).json({
              message: resMessage.LOGIN_SUCCESS,
              token: token,
              error: false,
              created_by: client.created_by,
              creater_id: client.creater_id,
              client_role: client.client_role,
              name: client.name,
              create: client.create,
              update: client.dataValues.update,
              delete: client.delete,
            });
          } else {
            res
              .status(400)
              .json({ message: resMessage.PASSWORD_INCORRECT, error: true });
          }
        } else {
          res
            .status(409)
            .json({ message: resMessage.CLIENT_IS_NOT_ACTIVE, error: true });
        }
      } else {
        res
          .status(409)
          .json({ message: resMessage.PLAYER_CANT_LOGIN, error: true });
      }
    } else {
      res
        .status(404)
        .json({ message: resMessage.CLIENT_DOES_NOT_EXIST, error: true });
    }
  } catch (error) {
    return next(error);
  }
};

//login of players

let players_login = async (req, res, next) => {
  try {
    console.log(
      "process.env.JWT_TOKEN_EXPIRE_TIME",
      process.env.JWT_TOKEN_EXPIRE_TIME
    );
    const schema = Joi.object({
      password: Joi.string(),
      e_mail: Joi.string().email().required(),
      contact: Joi.string()
        .min(10)
        .max(13)
        .pattern(/^[0-9]+$/)
        .required(),
    });
    const player = {
      e_mail: req.body.e_mail,
      password: req.body.password,
      contact: req.body.contact,
    };

    const validatedBody = schema.validate(player);
    console.log("i am validated body", validatedBody);
    console.log("secretOrPrivateKey is ", process.env.ENC_KEY);
    console.log("validatedBody.value.e_mail", validatedBody.value.e_mail);
    console.log("i am client", validatedBody.value.e_mail);
    const client = await Client.findOne({
      where: { e_mail: validatedBody.value.e_mail },
    });
    //console.log("bnmgfd", client.dataValues);
    console.log("i am client", !client);
    //console.log("i am client", client.dataValues.update);
    if (!client) {
      return res
        .status(404)
        .json({ message: resMessage.CLIENT_DOES_NOT_EXIST, error: true });
    } else {
      console.log(client.dataValues.client_role);
      if (client.dataValues.client_role === "7") {
        if (client.dataValues.status == "active") {
          if (validatedBody.value.password) {
            passwordMatch = await bcrypt.compare(
              validatedBody.value.password,
              client.dataValues.password
            );

            console.log("password match", passwordMatch);
            if (passwordMatch) {
              token = jwt.sign(
                { id: client.client_id, email: client.e_mail },
                process.env.ENC_KEY,
                { expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME }
              );
              return res.status(200).json({
                id: client.client_id,
                user_name: client.dataValues.user_name,
                message: resMessage.PWD_MATCHED,
                error: false,
                token: token,
              });
            } else {
              return res
                .status(400)
                .json({ message: resMessage.PASSWORD_INCORRECT, error: true });
            }
          } else {
            res
              .status(400)
              .json({ message: resMessage.PROVIDE_PASSWORD, error: true });
          }
        } else {
          res
            .status(409)
            .json({ message: resMessage.CLIENT_IS_NOT_ACTIVE, error: true });
        }
      } else {
        res.status(409).json({ message: resMessage.NOT_PLAYER, error: true });
      }
    }
  } catch (error) {
    return next(error);
  }
};

//verify phno
let verify_phno = async (req, res, next) => {
  const schema = Joi.object({
    user_name: Joi.string(),
    contact: Joi.string()
      .min(10)
      .max(13)
      .pattern(/^[0-9]+$/)
      .required(),
  });
  const player = {
    user_name: req.body.user_name,
    contact: req.body.contact,
  };

  const validatedBody = schema.validate(player);
  console.log("i am validated body", validatedBody);
  console.log("secretOrPrivateKey is ", process.env.ENC_KEY);
  const ph_no_check = await Client.findOne({
    where: { contact: validatedBody.value.contact },
  });
  console.log("ph_no_check", ph_no_check);
  if (ph_no_check) {
    if (ph_no_check.dataValues.contact === validatedBody.value.contact) {
      if (ph_no_check.dataValues.otp) {
        const otp_time = parseInt(ph_no_check.dataValues.otp_time);
        console.log("otp_time", otp_time);
        console.log("Date.now", Date.now());
        if (Date.now() > otp_time) {
          let otp = commonFunction.getOTP();
          let otpExpireTime = Date.now() + 100000;
          await Client.update(
            { otp: otp, otp_time: otpExpireTime },
            { where: { contact: validatedBody.value.contact } }
          );
          return res.status(200).json({
            result: { message: resMessage.PHNO_VERIFIED },
            message: resMessage.OTP_EXPIRED,
            contact: validatedBody.value.contact,
            otp,
            error: false,
          });
        } else {
          let otp = commonFunction.getOTP();
          let otpExpireTime = Date.now() + 100000;
          await Client.update(
            { otp: otp, otp_time: otpExpireTime },
            { where: { contact: validatedBody.value.contact } }
          );
          return res.status(200).json({
            message: resMessage.NO_OTP,
            error: false,
            otp: otp,
            contact: validatedBody.value.contact,
          });
        }
      } else {
        let otp = commonFunction.getOTP();
        let otpExpireTime = Date.now() + 100000;
        await Client.update(
          { otp: otp, otp_time: otpExpireTime },
          { where: { contact: validatedBody.value.contact } }
        );

        return res.status(200).json({
          message: resMessage.OTP_SEND,
          error: false,
          otp: otp,
          contact: validatedBody.value.contact,
        });
      }
    }
  } else {
    return res.status(400).json({
      message: resMessage.ENTER_REGISTERED_MOBILE_NUMBER,
      error: true,
    });
  }
};
//verify otp
let verify_otp = async (req, res, next) => {
  const schema = Joi.object({
    contact: Joi.string()
      .min(10)
      .max(13)
      .pattern(/^[0-9]+$/)
      .required(),
    otp: Joi.number().required(),
  });
  const player = {
    contact: req.body.contact,
    otp: req.body.otp,
  };

  const validatedBody = schema.validate(player);
  console.log("validatedBody", validatedBody);
  const ph_no_check = await Client.findOne({
    where: { contact: validatedBody.value.contact },
  });
  if (validatedBody.value.otp == ph_no_check.dataValues.otp) {
    const token = jwt.sign(
      {
        id: ph_no_check.dataValues.client_id,
        e_mail: ph_no_check.dataValues.e_mail,
      },
      process.env.ENC_KEY,
      { expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME }
    );
    console.log("token", token);
    return res.status(200).json({
      message: responseMessage.LOGIN,
      token: token,
      user_name: ph_no_check.user_name,
      client_id: ph_no_check.client_id,
      balance: ph_no_check.dataValues.amount,
      error: false,
    });
  } else {
    return res.status(400).json({
      message: responseMessage.INCORRECT_OTP,
      error: false,
    });
  }
};

//log in for other role

let other_role_login = async (req, res, next) => {
  try {
    console.log("secretOrPrivateKey is ", process.env.ENC_KEY, {
      expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME,
    });
    console.log("i am client", req.body);
    const client = await Client.findOne({ where: { e_mail: req.body.e_mail } });
    if (!client) {
      return res
        .status(404)
        .json({ message: resMessage.CLIENT_DOES_NOT_EXIST, error: true });
    } else {
      console.log(client.dataValues.client_role);
      const role = parseInt(client.dataValues.client_role);
      if (role > 2 && role < 7) {
        if (client.dataValues.status == "active") {
          if (req.body.password) {
            passwordMatch = await bcrypt.compare(
              req.body.password,
              client.dataValues.password
            );
            console.log("password match", passwordMatch);
            if (passwordMatch) {
              if (req.body.operator == client.dataValues.client_role) {
                token = jwt.sign(
                  { id: client.client_id, email: client.e_mail },
                  process.env.ENC_KEY,
                  { expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME }
                );
                res.status(200).json({
                  message: resMessage.LOGIN_SUCCESS,
                  token: token,
                  error: false,
                });
              } else {
                res.status(401).json({
                  message: resMessage.ROLE_MISMATCH,
                  error: true,
                });
              }
            } 
            else {
              res
                .status(400)
                .json({ message: resMessage.PASSWORD_INCORRECT, error: true });
            }
          } else {
            res.status(200).json({
              message: PASSWORD_EMPTY,
              error: false,
            });
          }
        } else {
          res
            .status(409)
            .json({ message: resMessage.CLIENT_IS_NOT_ACTIVE, error: true });
        }
      } else {
        res.status(409).json({ message: resMessage.CANT_LOGIN, error: true });
      }
    }
  } catch (error) {
    return next(error);
  }
};

//creating a client
let create = async (req, res, next) => {
  let clientId = uuidv4();

  try {
    console.log("I am req", req.body);

    const schema = Joi.object({
      //client_id: Joi.string().required(),
      password: Joi.string()
        .required()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*[A-Z]).{10,18}$/),
      e_mail: Joi.string().email().required(),
      status: Joi.string().required(),
      name: Joi.string().required(),
      client_role: Joi.string().required(),
      create: Joi.string().required(),
      update: Joi.string().required(),
      delete: Joi.string().required(),
      contact: Joi.string()
        .min(10)
        .max(13)
        .pattern(/^[0-9]+$/)
        .required(),
      user_name: Joi.string().required(),
    });
    const client = {
      e_mail: req.body.e_mail,
      password: req.body.password,
      status: req.body.status,
      name: req.body.name,
      client_role: req.body.client_role,
      create: req.body.create,
      update: req.body.update,
      delete: req.body.delete,
      contact: req.body.contact,
      user_name: req.body.user_name,
    };

    const validatedBody = schema.validate(client);
    console.log("i am validated body", validatedBody);

    const loggedInClient = await Client.findOne({
      where: { client_id: req.user.id },
    });
    console.log("logged in client", loggedInClient.dataValues.create);
    console.log("i am req.body", req.body.e_mail);
    const existedClient = await Client.findOne({
      where: { e_mail: req.body.e_mail },
    });
    console.log("i am existed client", existedClient);
    const { dataValues } = loggedInClient;
    const existedClientByContactNo = await Client.findOne({
      where: { contact: req.body.contact },
    });
    const existedClientByUserName = await Client.findOne({
      where: { user_name: req.body.user_name },
    });
    if (existedClient) {
      return res.status(409).send({
        message: responseMessage.EMAIL_EXIST,
        error: false,
      });
    } else if (existedClientByContactNo) {
      return res.status(409).send({
        message: responseMessage.CONTACT_NO_EXIST,
        error: true,
      });
    } else if (existedClientByUserName) {
      return res.status(409).send({
        message: responseMessage.USER_NAME_EXIST,
        error: true,
      });
    } else {
      // Save Client in the database
      console.log("req.user.id",req.user.id);
      const passwordHash = await bcrypt.hash(req.body.password, 10);
      validatedBody.value.password = passwordHash;
      validatedBody.value.client_id = clientId;
      validatedBody.value.creater_id = req.user.id;
      validatedBody.value.created_by = dataValues.client_role;
      console.log("req.user.id",req.user.id);
      console.log(
        "I am the data type of created_by",
        typeof dataValues.client_role
      );
      console.log("client data", validatedBody);
      client_role = parseInt(validatedBody.value.client_role);
      created_by = parseInt(validatedBody.value.created_by);
      console.log("!validatedBody.error", !validatedBody.error);
      if (loggedInClient.dataValues.create == "1") {
        if (client_role > created_by) {
          if (!validatedBody.error) {
            const client_created = await Client.create(validatedBody.value);
            console.log("client_created", client_created);
            if (client_created) {
              res.status(200).send({
                data: client_created,
                message: responseMessage.CLIENT_CREATED,
                error: false,
              });
            } else {
              res.status(500).send({
                message: err.message || responseMessage.CLIENT_NOT_CREATED,
                error: true,
              });
            }
          } else {
            res.status(400).send({
              message: validatedBody.error.details[0].message,
              error: true,
            });
          }
        } else {
          return res.status(409).send({
            message: responseMessage.ROLE_CONFLICT,
            error: false,
          });
          //throw apiError.conflict(responseMessage.ROLE_CONFLICT)
        }
      } else {
        return res.status(401).send({
          message: responseMessage.CREATING_NOT_ALLOWED,
          error: false,
        });
      }
    }
  } catch (error) {
    return next(error);
  }
};

//creating a player
let create_player = async (req, res, next) => {
  let clientId = uuidv4();

  try {
    console.log("I am req", req.body);

    const schema = Joi.object({
      //client_id: Joi.string().required(),
      password: Joi.string()
        .required()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*[A-Z]).{10,18}$/),
      e_mail: Joi.string().email().required(),
      name: Joi.string().required(),
      user_name: Joi.string().required(),
      contact: Joi.string()
        .min(10)
        .max(13)
        .pattern(/^[0-9]+$/)
        .required(),
      client_role: Joi.string().required(),
    });
    const client = {
      e_mail: req.body.e_mail,
      password: req.body.password,
      name: req.body.name,
      client_role: req.body.client_role,
      contact: req.body.contact,
      user_name: req.body.user_name,
    };

    const validatedBody = schema.validate(client);
    console.log("i am validated body", validatedBody);

    const loggedInClient = await Client.findOne({
      where: { client_id: req.user.id },
    });
    console.log("logged in client", loggedInClient.dataValues.create);
    console.log("i am req.body", req.body.e_mail);
    const existedClient = await Client.findOne({
      where: { e_mail: req.body.e_mail },
    });
    console.log("i am existed client", existedClient);
    const { dataValues } = loggedInClient;
    const existedClientByContactNo = await Client.findOne({
      where: { contact: req.body.contact },
    });
    const existedClientByUserName = await Client.findOne({
      where: { user_name: req.body.user_name },
    });
    if (existedClient) {
      return res.status(409).send({
        message: responseMessage.EMAIL_EXIST,
        error: false,
      });
    } else if (existedClientByContactNo) {
      return res.status(409).send({
        message: responseMessage.CONTACT_NO_EXIST,
        error: true,
      });
    } else if (existedClientByUserName) {
      return res.status(409).send({
        message: responseMessage.USER_NAME_EXIST,
        error: true,
      });
    } else {
      // Save Client in the database
      console.log("req.user.id",req.user.id);
      const passwordHash = await bcrypt.hash(req.body.password, 10);
      validatedBody.value.password = passwordHash;
      validatedBody.value.client_id = clientId;
      validatedBody.value.creater_id = req.user.id;
      validatedBody.value.created_by = dataValues.client_role;
      console.log(
        "I am the data type of created_by",
        typeof dataValues.client_role
      );
      console.log("client data", validatedBody.value);
      client_role = parseInt(validatedBody.value.client_role);
      created_by = parseInt(validatedBody.value.created_by);
      console.log("!validatedBody.error", !validatedBody.error);
      if (loggedInClient.dataValues.create == "1") {
        if (client_role > created_by) {
          console.log("ttt");
          if (!validatedBody.error) {
            console.log("sss");
            const client_created = await Client.create(validatedBody.value);
            console.log("client_created", client_created);
            if (client_created) {
              res.status(200).send({
                data: client_created,
                message: responseMessage.CLIENT_CREATED,
                error: false,
              });
            } else {
              res.status(500).send({
                message: err.message || responseMessage.CLIENT_NOT_CREATED,
                error: true,
              });
            }
          } else {
            res.status(400).send({
              message: validatedBody.error.details[0].message,
              error: true,
            });
          }
        } else {
          return res.status(409).send({
            message: responseMessage.ROLE_CONFLICT,
            error: false,
          });
          //throw apiError.conflict(responseMessage.ROLE_CONFLICT)
        }
      } else {
        return res.status(401).send({
          message: responseMessage.CREATING_NOT_ALLOWED,
          error: false,
        });
      }
    }
  } catch (error) {
    return next(error);
  }
};

//edit_created_client

let edit_created_client = async (req, res, next) => {
  const loggedInClient = await Client.findOne({
    where: { client_id: req.user.id },
  });

  //console.log("I am loggedInClient from edit", validatedBody);
  const superAdminClientCheck = await Client.findOne({
    where: { client_role: "1" },
  });
  const schema = Joi.object({
    //client_id: Joi.string().required(),
    client_id: Joi.string(),
    e_mail: Joi.string(),
    password: Joi.string(),
    status: Joi.string(),
    name: Joi.string(),
    client_role: Joi.string(),
    contact: Joi.string(),
    user_name: Joi.string(),
    create: Joi.string(),
    update: Joi.string(),
    delete: Joi.string(),
    withdrawn_amount: Joi.string(),
  });
  const client = {
    client_id: req.body.client_id,
    e_mail: req.body.e_mail,
    password: req.body.password,
    status: req.body.status,
    name: req.body.name,
    client_role: req.body.client_role,
    contact: req.body.contact,
    user_name: req.body.user_name,
    create: req.body.create,
    update: req.body.update,
    delete: req.body.delete,
    withdrawn_amount: req.body.withdrawn_amount,
  };
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const validatedBody = schema.validate(client);
  console.log("passwordHash", passwordHash);

  if (superAdminClientCheck) {
    const updatee = await Client.update(
      {
        e_mail: validatedBody.value.e_mail,
        password: passwordHash,
        status: validatedBody.value.status,
        name: validatedBody.value.name,
        client_role: validatedBody.value.client_role,
        create: validatedBody.value.create,
        update: validatedBody.value.update,
        delete: validatedBody.value.delete,
        contact: validatedBody.value.contact,
        user_name: validatedBody.value.user_name,
      },
      { where: { client_id: req.body.client_id } }
    );
    if (updatee) {
      res.status(200).send({
        data: updatee,
        message: responseMessage.CLIENT_UPDATED,
        error: false,
      });
    } else {
      res.status(500).send({
        message: err.message || responseMessage.CLIENT_NOT_UPDATED,
        error: true,
      });
    }
  } else {
    if (loggedInClient.dataValues.update == "1") {
      const updatee = await Client.update(
        {
          e_mail: validatedBody.value.e_mail,
          password: passwordHash,
          status: validatedBody.value.status,
          name: validatedBody.value.name,
          client_role: validatedBody.value.client_role,
          create: validatedBody.value.create,
          update: validatedBody.value.update,
          delete: validatedBody.value.delete,
          contact: validatedBody.value.contact,
          user_name: validatedBody.value.user_name,
        },
        { where: { client_id: req.body.client_id, creater_id: req.user.id } }
      );
      if (updatee) {
        res.status(200).send({
          data: updatee,
          message: responseMessage.CLIENT_UPDATED,
          error: false,
        });
      } else {
        res.status(500).send({
          message: err.message || responseMessage.CLIENT_NOT_UPDATED,
          error: true,
        });
      }
    } else {
      return res
        .status(401)
        .json({ message: responseMessage.UPDATING_NOT_ALLOWED, error: true });
    }
  }
};

//Delete Client

let delete_client = async (req, res, next) => {
  const schema = Joi.object({
    client_id: Joi.string(),
  });
  const client = {
    client_id: req.body.client_id,
  };
  const validatedBody = schema.validate(client);
  const loggedInClient = await Client.findOne({
    where: { client_id: req.user.id },
  });
  console.log(" I am req.body.client_id", req.body.client_id);
  console.log(" I am loggedin client", loggedInClient);
  console.log(" I am sup admin check", loggedInClient.dataValues.client_role);

  const client_exists_in_db_check = await Client.findOne({
    where: { client_id: req.body.client_id },
  });
  console.log("client_exists_in_db_check", client_exists_in_db_check);
  if (loggedInClient.dataValues.client_role == "1") {
    if (client_exists_in_db_check) {
      const delete_client = await Client.destroy({
        where: { client_id: req.body.client_id },
      });
      console.log(delete_client);
      if (delete_client) {
        res.status(200).send({
          data: delete_client,
          message: responseMessage.CLIENT_DELETED,
          error: false,
        });
      } else {
        res.status(500).send({
          message: responseMessage.CLIENT_CANT_DELETED,
          error: true,
        });
      }
    } else {
      return res.status(404).json({
        message: responseMessage.CLIENT_DOES_NOT_EXIST,
        error: true,
      });
    }
  } else {
    const clientCheck = await Client.findOne({
      where: { client_id: req.body.client_id, creater_id: req.user.id },
    });
    if (
      loggedInClient.dataValues.client_role == "1" ||
      loggedInClient.dataValues.delete == "1"
    ) {
      if (clientCheck) {
        {
          const delete_client = await Client.destroy({
            where: { client_id: req.body.client_id, creater_id: req.user.id },
          });

          if (delete_client) {
            return res.status(200).json({
              delete_client: delete_client,
              message: responseMessage.CLIENT_DELETED,
              error: false,
            });
          } else {
            return res.status(404).json({
              message: responseMessage.CLIENT_CANT_DELETED,
              error: true,
            });
          }
        }
      } else {
        return res.status(404).json({
          message: responseMessage.CLIENT_DOES_NOT_EXIST,
          error: true,
        });
      }
    } else {
      return res
        .status(401)
        .json({ message: responseMessage.DELETION_NOT_ALLOWED, error: false });
    }
  }
};

//Client list
let find_all_clients = async (req, res, next) => {
  console.log("req.user.id", req.user.id);
  const superUser = await Client.findOne({
    where: { client_id: req.user.id },
  });
  console.log("superUser", superUser);
  const findAll = await Client.findAll();
  //console.log("i am client_id form find all", findAll);
  //console.log("superUser.dataValues.client_id", superUser.dataValues.client_id);
  if (superUser.dataValues.client_id == "abc") {
    const allClient = await Client.findAndCountAll({
      where: {
        [Op.and]: [
          { client_role: { [Op.ne]: "7" } },
          { creater_id: { [Op.ne]: "1" } },
        ],
      },
    });
    const players = await Client.findAndCountAll({
      creater_id: req.user.id,
      where: { client_role: "7" },
    });
    return res.status(200).json({
      client: allClient,
      players: players,
      error: false,
    });
  } else {
    const client = await Client.findAll({
      where: { creater_id: req.user.id },
    });
    console.log("I am client", client);
    if (client.length) {
      const allClient = await Client.findAndCountAll({
        where: {
          creater_id: req.user.id,
          [Op.and]: [
            { client_role: { [Op.ne]: "7" } },
            { creater_id: { [Op.ne]: "1" } },
          ],
        },
      });
      const players = await Client.findAndCountAll({
        creater_id: req.user.id,
        where: { creater_id: req.user.id, client_role: "7" },
      });

      console.log("players", players);
      if (players.length) {
        return res.status(200).json({
          client: allClient,
          players: players,
          message: responseMessage.PLAYERS_FOUND,
          error: false,
        });
      } else {
        return res.status(200).json({
          client: allClient,
          players: players,
          message: responseMessage.NO_PLAYERS,
          error: false,
        });
      }
    } else {
      return res
        .status(404)
        .json({ message: responseMessage.NO_CLIENT_EXIST, error: true });
    }
  }
};

//find player
let find_player = async (req, res, next) => {
  console.log("req.user.id", req.user.id);
  try {
    const schema = Joi.object({
      user_name: Joi.string().required(),
    });
    const client = {
      user_name: req.body.user_name,
    };

    const validatedBody = schema.validate(client);
    //console.log("i am validated body", req.user.id);

    if (req.user.id == "abc") {
      const player_and_guest_of_admin = await Client.findOne({
        user_name: validatedBody.value.user_name,
      });
      console.log("player_and_guest_of_admin", player_and_guest_of_admin);
      //const amount = await Client.findOne({})
      if (player_and_guest_of_admin) {
        return res.status(200).json({
          data: player_and_guest_of_admin,
          message: responseMessage.PLAYERS_FOUND,
          error: false,
        });
      } else {
        return res.status(404).json({
          data: player_and_guest_of_admin,
          message: responseMessage.NO_PLAYERS,
          error: true,
        });
      }
    } else {
      const player_of_individual_role = await Client.findOne({
        where: {
          user_name: validatedBody.value.user_name,
          creater_id: req.user.id,
        },
      });
      if (player_of_individual_role) {
        return res.status(200).json({
          data: player_of_individual_role,
          message: responseMessage.PLAYERS_FOUND,
          error: false,
        });
      } else {
        return res.status(404).json({
          data: player_of_individual_role,
          message: responseMessage.NO_PLAYERS,
          error: true,
        });
      }
    }
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  get_date_and_time: get_date_and_time,
  login: login,
  players_login: players_login,
  verify_phno: verify_phno,
  verify_otp: verify_otp,
  other_role_login: other_role_login,
  create: create,
  find_all_clients: find_all_clients,
  edit_created_client: edit_created_client,
  delete_client: delete_client,
  create_player: create_player,
  find_player: find_player,
};
