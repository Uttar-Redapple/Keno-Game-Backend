const PayOutTable = require("../models/Payout");

const PayOutTableServices = async(query)=>{
    
    const pay = await PayOutTable.findAll(query);    
    //console.log ("pay",pay);
    return pay;
    
    
}

module.exports ={
    PayOutTableServices : PayOutTableServices,
    
    
}  ;