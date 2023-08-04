
const DrawTable = require("../models/Draw");

const DrawTableFindAll = async(query)=>{
    
    const draw = await DrawTable.findAll(query);    
    console.log("draw",draw);
    return draw;
    
    
}
const FindLastDraw = async(query) => {
    const last_draw = DrawTable.findOne(query);
    return last_draw ;

}
const SaveToDraw = async(query) => {
    const save_to_draw = DrawTable.create(query);
    return save_to_draw ;

}

module.exports ={
    DrawTableFindAll : DrawTableFindAll,
    FindLastDraw : FindLastDraw,
    SaveToDraw : SaveToDraw

}  ;