const DrawTableServices = require("../../services/bet_draw");
const NumberTableServices = require("../../services/number_count");
const PayoutTableService = require("../../services/payoutTable");
//const number_controller = require("../../controllers/number_match")
const {PayOutTableServices} = PayoutTableService;
const {DrawTableFindAll,FindLastDraw,SaveToDraw} = DrawTableServices ;
const {FindAllFromNumberTable,UpdateNumberTable} = NumberTableServices;
const appConfig = require("../../../config/appConfig");
const { eventEmitter } = require("../../../config/appConfig");
const pRNG = appConfig.pRNG;
let queue = appConfig.queue;

//previous_draw numbers
let previous_draw = async() => {
    const query_for_last_draw = {
        order: [ [ 'draw_id', 'DESC']],
        limit: 1,
        raw : true
    };
    const last_draw = await FindLastDraw(query_for_last_draw);
    console.log("last_draw",last_draw);
    let {draw_id} = last_draw ;
    draw_id = draw_id+1;
    console.log("last_draw",draw_id);
    return draw_id;
}

//current_draw numbers
let current_draw = async () => {
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
        console.log("dup_removed",dup_removed, dup_removed.length);
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
        console.log("llast_draw",draw_id);
        eventEmitter.emit("update-db",{
            draw_id : draw_id,
            draw_array : twenty_random_number_without_repetition
        });
        return {
            draw_id : draw_id,
            draw_array : twenty_random_number_without_repetition
        }
}
let gameLoop = async ()=>{
    let next_draw_id = await previous_draw();
    eventEmitter.emit("start-timer",next_draw_id);
}

let startDraw = async () => {
    let current_round = await current_draw();
    let drawArr = current_round.draw_array;
    for(let i=0;i<drawArr.length;i++){

    queue.enqueue({
            event:"start-draw",
            data:{
                i:i,
                data:{
                    draw_id:current_round.draw_id,
                    number:drawArr[i]
                }
            }
     });
    };
    queue.enqueue({
        event:"stop-draw",
        data:{
            draw_id:current_round.draw_id
        }
    });
    eventEmitter.emit("start-draw",queue);
}

eventEmitter.on("update-db",async (data)=>{
    console.log("Updating DB : ",data)
    let draw_id = data.draw_id;
    let twenty_random_number_without_repetition = data.draw_array;
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
    for(let i = 0;i<all_numbers.length;i++){
      query_for_update = {
        occurance : {occurance : all_numbers[i].occurance},
        condition : { where :{number: all_numbers[i].number} }, 
        options : { raw : true }

      };
      console.log("all_numbers.occurance",all_numbers[i].occurance);
      const updatedTable = await UpdateNumberTable(query_for_update);

    }

})

// let number_match = async (draw_id,selected_numbers_by_user) => {
//   const query_to_find_numbers_by_draw_id = {where : {draw_id : draw_id}};
//   const twenty_numbers = await FindLastDraw(query_to_find_numbers_by_draw_id);
//   const matched_numbers = findCommonElements(selected_numbers_by_user,twenty_numbers);
//   const numbers_selected = selected_numbers_by_user.length;
//   const query_to_find_a_particular_payout = {

//   };
//   const payout_for_a_particular_select = PayOutTableServices(query);
//   return {
//          matched_numbers : matched_numbers,
//          win_amount : win_amount
//         } ;
// }


// eventEmitter.on("number_match", async (data) => {
//   console.log("req number_match",data)
//   try {
//     if (typeof data == 'string') {
//       data = JSON.parse(data);
//     }
//     let userResult = await number_controller.number_match(data);
//     console.log("setPlayerOrderDeatails",userResult)
//     io.sockets.in(socket.id).emit("number_match", userResult);
//   } catch (error) {
//     console.log("In practice details event===>>>", error);
//   }
// });

module.exports = {
    mainGameLoop : gameLoop,
    startDraw : startDraw,
    //number_match :number_match,
    
}