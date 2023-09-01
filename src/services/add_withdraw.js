const Transaction = require("../models/Transaction");


const SaveToTransaction = async(query) => {
    const save_to_transaction = Transaction.create(query);
    return save_to_transaction ;

}
const FindTransaction = async(query) => {
    const save_to_transaction = Transaction.findAll(query);
    return save_to_transaction ;

}

module.exports ={
    SaveToTransaction : SaveToTransaction,
    FindTransaction : FindTransaction
}  ;