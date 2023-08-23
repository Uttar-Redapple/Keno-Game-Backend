const ClientTable = require("../models/Client");

const FindClient = async (query) => {
  const client = await ClientTable.findAll(query);
  return client;
};

module.exports = {
  FindClient: FindClient
};
