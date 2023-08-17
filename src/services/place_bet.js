const Placebet = require ("../models/Placebet");
const FindBetFromDrawId = async(query) => {
    const bet = await Placebet.findOne(query);
    //console.log("number",number);
    return bet;

}
const FindAllBet = async(query) => {
    const bet = await Placebet.findAll(query);
    return bet;

}

module.exports = {
    FindBetFromDrawId : FindBetFromDrawId,
    FindAllBet : FindAllBet
}