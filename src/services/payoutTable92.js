const PayOutTable92 = require("../models/payoutTable92");

const PayOutTable92Services = async(query)=>{
    
    const pay = await PayOutTable92.findAll(query);    
    //console.log ("pay",pay);
    return pay;
    
    
}

module.exports ={
    PayOutTable92Services : PayOutTable92Services

}  ;