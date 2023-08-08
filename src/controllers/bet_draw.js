const DrawTableServices = require("../services/bet_draw");
const NumberTableServices = require("../services/number_count");
const {DrawTableFindAll,FindLastDraw,SaveToDraw} = DrawTableServices ;
const {FindAllFromNumberTable,UpdateNumberTable} = NumberTableServices;
const appConfig = require("../../config/appConfig");
const pRNG = appConfig.pRNG;
let previous_10_bet_draw = async (req,res,next) => {
    const query = {
        order: [ [ 'draw_id', 'DESC']],
        limit: 10,
        raw : true
    };
    const draw_bet = await DrawTableFindAll(query);
    console.log("draw_bet",draw_bet);
    res.status(200).send({
        draw_bet :draw_bet,
        error : false 
    })
    

}
//previous_draw numbers
let previous_draw = async(req,res,next) => {
    const query_for_last_draw = {
        order: [ [ 'draw_id', 'DESC']],
        limit: 1,
        raw : true
    };
    const last_draw = await FindLastDraw(query_for_last_draw);
    let {draw_id} = last_draw ;
    draw_id = draw_id+1;
    console.log("last_draw",draw_id);
    //twenty_random_number_without_repetition : Object.assign({},twenty_random_number_without_repetition),
    res.status(200).json({
      last_draw : last_draw
    });

}
//current_draw numbers
let current_draw = async (req,res,next) => {
  let rand_num = [];
  let rand;
    function getRandomArbitrary(min, max) {
        return pRNG.random() * (max - min) + min;
      }
      for (i = 0; i < 40; i++) {
        rand = Math.floor(getRandomArbitrary(1, 80));
        rand_num.push(rand);
      }
    
      function hasDuplicates(a) {
        const noDups = new Set(a);
    
        return noDups;
      }
      const dup_removed = hasDuplicates(rand_num);
      const array = Array.from(dup_removed);
      const twenty_random_number_without_repetition = array.splice(array.length-20);
      console.log(dup_removed, dup_removed.length);
      console.log("rand", rand_num, rand_num.length);
      console.log("array", array);
      console.log("twenty_random_number_without_repetition", twenty_random_number_without_repetition);
      const query_for_last_draw = {
        order: [ [ 'draw_id', 'DESC']],
        limit: 1,
        raw : true
    };
      const last_draw = await FindLastDraw(query_for_last_draw);
      let {draw_id} = last_draw ;
      draw_id = draw_id+1;
      console.log("last_draw",draw_id);
      //twenty_random_number_without_repetition : Object.assign({},twenty_random_number_without_repetition),
      res.status(200).json({
        draw_id : draw_id,
        twenty_random_number_without_repetition : twenty_random_number_without_repetition
      });
      let twenty_random_number_without_repetition_string = twenty_random_number_without_repetition.join();
      const query_for_save_to_draw = {
        draw_id : draw_id,
        numbers_drawn : twenty_random_number_without_repetition_string,
        raw : true
    };
      const save_to_draw = await SaveToDraw(query_for_save_to_draw); 
      console.log("save_to_draw",save_to_draw); 
      query_for_all_numbers = {raw : true};
      const all_numbers = await FindAllFromNumberTable(query_for_all_numbers);
      
      
      for(let i = 0 ;i<twenty_random_number_without_repetition.length;i++){
        for(let j = 0;j<80;j++){
            if(twenty_random_number_without_repetition[i] == all_numbers[j].number){
                all_numbers[j].occurance++ ;

            }
          }

      }
      console.log("all_numbers",all_numbers);
      let number_of_number_table,occurance_of_numbers ;
      for(let i = 0;i<all_numbers.length;i++){

        // let {id,number,occurance} = all_numbers[i];
        // console.log("occurance",occurance);
        // number_of_number_table = number;
        // occurance_of_numbers = occurance; 
        query_for_update = {
          occurance : {occurance : all_numbers[i].occurance},
          condition : { where :{number: all_numbers[i].number} }, 
          options : { raw : true }
  
        };
        console.log("all_numbers.occurance",all_numbers[i].occurance);
        const updatedTable = await UpdateNumberTable(query_for_update);

      }
      // query_for_update = {
      //   occurance : occurance_of_numbers,
      //   condition : { where :{number: number_of_number_table} }, 
      //   options : { multi: true,raw : true }

      // };
     
      
      //console.log(updatedTable);
      

}
//hot and cold number
let hot_and_cold = async(req,res,next) => {
    try{
    query_for_all_numbers = {raw : true};
    const all_numbers = await FindAllFromNumberTable(query_for_all_numbers);
    const query_for_hot_no = {
      order: [ [ 'occurance', 'DESC']],
      limit: 6,
      raw : true
  };
  const query_for_cold_no = {
    order: [ [ 'occurance', 'ASC']],
    limit: 6,
    raw : true
};
const hot_numbers = await FindAllFromNumberTable(query_for_hot_no);
const cold_numbers = await FindAllFromNumberTable(query_for_cold_no);
    //console.log("all_numbers",all_numbers);
    console.log("hot_numbers",hot_numbers,"cold_numbers",cold_numbers);
    res.status(200).json({
        hot_numbers : hot_numbers,
        cold_numbers : cold_numbers
      });

    }catch(e){
        console.log("error",e);
    }
    
}
module.exports = {
    previous_10_bet_draw : previous_10_bet_draw,
    current_draw : current_draw,
    previous_draw : previous_draw,
    hot_and_cold : hot_and_cold

}