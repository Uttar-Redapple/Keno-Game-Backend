const ClientTable = require("../models/Client");

const FindClient = async (query) => {
  const client = await ClientTable.findAll(query);
  return client;
};
const FindSpecificClient = async (query) => {
  const client = await ClientTable.findOne(query);
  return client;
};
const UpdateClientBalance = async (query,options) => {
  const balance = await ClientTable.update(query,options);
  console.log("balance",balance);
  return balance ;
}
module.exports = {
  FindClient: FindClient,
  UpdateClientBalance : UpdateClientBalance,
  FindSpecificClient : FindSpecificClient
};
