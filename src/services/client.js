const ClientTable = require("../models/Client");

const FindClient = async (query) => {
  const client = await ClientTable.findAll(query);
  return client;
};
const UpdateClientBalance = async (query,options) => {
  const balance = await ClientTable.update(query,options);
  return balance ;
}
module.exports = {
  FindClient: FindClient,
  UpdateClientBalance : UpdateClientBalance
};
