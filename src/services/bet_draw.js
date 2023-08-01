
const DrawTable = require("../models/Draw");

const DrawTableServices = async(query)=>{
    
    const draw = await DrawTable.findAll(query);    
    console.log("draw",draw);
    return draw;
    
    
}

module.exports ={
    DrawTableServices : DrawTableServices

}  ;