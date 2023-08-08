const NumberTable = require ("../models/NumberTable");
const FindAllFromNumberTable = async(query) => {
    const number = await NumberTable.findAll(query);
    //console.log("number",number);
    return number;

}
const UpdateNumberTable = async(query) => {
    const {occurance,condition,options} = query;
    console.log("occurance",occurance,"condition",condition,"options",options);
    const updatedNumberTable = await NumberTable.update(occurance,condition,options);
    console.log("updatedNumberTable",updatedNumberTable);
    return updatedNumberTable ;
}
module.exports = {
    FindAllFromNumberTable : FindAllFromNumberTable,
    UpdateNumberTable : UpdateNumberTable
}