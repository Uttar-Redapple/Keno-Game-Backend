const apiError = require("../libs/apiError");
const responseMessage = require("../libs/responseMessage");
const appConfig = require("../../config/appConfig");
const FindBet = require("../services/place_bet");
const {FindBetFromDrawId} = FindBet;
const DrawTableServices = require("../services/bet_draw");
const {DrawTableFindAll,FindLastDraw,SaveToDraw} = DrawTableServices ;
const PayOutTableService = require("../services/payoutTable");
const {PayOutTableServices} = PayOutTableService ;

// let number_match = async(req,res,next) =>{
//     const query_for_last_draw = {
//         order: [ [ 'draw_id', 'DESC']],
//         limit: 1,
//         raw : true
//     };
//       const last_draw = await FindLastDraw(query_for_last_draw);
//       let {draw_id} = last_draw ;
//       console.log("last_draw.numbers_drawn",last_draw.numbers_drawn);
//       draw_id = draw_id+1;
//       console.log("last_draw",draw_id);  
//       const query_to_find_bet_from_bet_id = {
//         where: { draw_id: 83754 },
//         raw : true
//       }
//     const find_bet_from_bet_id = await FindBetFromDrawId(query_to_find_bet_from_bet_id); 
//     console.log("find_bet_from_bet_id",find_bet_from_bet_id); 
//     console.log("num10type",typeof(find_bet_from_bet_id.num10));
//     const arr = find_bet_from_bet_id.num10.slice(1, -1);
//     console.log("arr",arr);
//     const numbers_selected_by_bet_placer = arr.split(",");
//     const draw_numbers = last_draw.numbers_drawn.split(",");
//     console.log("numbers_selected_by_bet_placer",numbers_selected_by_bet_placer);
//     console.log("type of last_draw.numbers_drawn",typeof(last_draw.numbers_drawn));
//     console.log("type of last_draw.numbers_drawn",last_draw.numbers_drawn);
//     console.log("draw_numbers",draw_numbers);
//     function findCommonElements(arr1, arr2) {
//         const commonElements = [];
    
//         for (const element of arr1) {
//             if (arr2.includes(element)) {
//                 commonElements.push(element);
//             }
//         }
    
//         return commonElements;
//     }
    
//     const commonElements = findCommonElements(draw_numbers, numbers_selected_by_bet_placer);
//     console.log(commonElements);
//     const query = {attributes: ["numbers_match","payout"], raw: true};
//     const payout_table = await PayOutTableServices(query);
//     console.log("payout_table",payout_table);
//     const total_number_selected_by_bet_placer = numbers_selected_by_bet_placer.length;
//     console.log(numbers_selected_by_bet_placer.length);
//     const numbers_matched = commonElements.length ;
//     console.log("numbers_matched",numbers_matched);
//     let rtp ;
//     for(i of payout_table){
//         if(i.numbers_match == numbers_selected_by_bet_placer.length){
//             rtp = i.payout ;
            
//         }
        
//     }
//     console.log("rtp",rtp);
    
//     const obj_of_rtp = JSON.parse(rtp)
//     console.log("obj_of_rtp",obj_of_rtp);
//     let rtp_for_winning_number ;
//     for (const each in obj_of_rtp) {
        
//         if(each == numbers_matched)
//         {
//             rtp_for_winning_number = obj_of_rtp[each];
            
//         }

        
//       }
//       console.log("winned rtp",rtp_for_winning_number);
//       const placed_bet_amount = find_bet_from_bet_id.bet_amount ;
//       const win_amount = placed_bet_amount*rtp_for_winning_number ;
//       console.log("win_amount",win_amount);
//       return res.status(200).send({
//       win_amount : win_amount,
//       error: false,
//       });
    
    
    

// }


let number_match = async(req) =>{

    return new Promise(async (resolve, reject) => {
        var res;

        const query_for_last_draw = {
            order: [ [ 'draw_id', 'DESC']],
            limit: 1,
            raw : true
        };
          const last_draw = await FindLastDraw(query_for_last_draw);
          let {draw_id} = last_draw ;
          console.log("last_draw.numbers_drawn",last_draw.numbers_drawn);
          //draw_id = draw_id+1;
          console.log("last_draw",draw_id);  
          const query_to_find_bet_from_bet_id = {
            where: { draw_id: 83754 },
            raw : true
          }
        const find_bet_from_bet_id = await FindBetFromDrawId(query_to_find_bet_from_bet_id); 
        console.log("find_bet_from_bet_id",find_bet_from_bet_id); 
        console.log("num10type",typeof(find_bet_from_bet_id.num10));
        const arr = find_bet_from_bet_id.num10.slice(1, -1);
        console.log("arr",arr);
        const numbers_selected_by_bet_placer = arr.split(",");
        const draw_numbers = last_draw.numbers_drawn.split(",");
        console.log("numbers_selected_by_bet_placer",numbers_selected_by_bet_placer);
        console.log("type of last_draw.numbers_drawn",typeof(last_draw.numbers_drawn));
        console.log("type of last_draw.numbers_drawn",last_draw.numbers_drawn);
        console.log("draw_numbers",draw_numbers);
        function findCommonElements(arr1, arr2) {
            const commonElements = [];
        
            for (const element of arr1) {
                if (arr2.includes(element)) {
                    commonElements.push(element);
                }
            }
        
            return commonElements;
        }
        
        const commonElements = findCommonElements(draw_numbers, numbers_selected_by_bet_placer);
        console.log(commonElements);
        const query = {attributes: ["numbers_match","payout"], raw: true};
        const payout_table = await PayOutTableServices(query);
        console.log("payout_table",payout_table);
        const total_number_selected_by_bet_placer = numbers_selected_by_bet_placer.length;
        console.log(numbers_selected_by_bet_placer.length);
        const numbers_matched = commonElements.length ;
        console.log("numbers_matched",numbers_matched);
        let rtp ;
        for(i of payout_table){
            if(i.numbers_match == numbers_selected_by_bet_placer.length){
                rtp = i.payout ;
                
            }
            
        }
        console.log("rtp",rtp);
        
        const obj_of_rtp = JSON.parse(rtp)
        console.log("obj_of_rtp",obj_of_rtp);
        let rtp_for_winning_number ;
        for (const each in obj_of_rtp) {
            
            if(each == numbers_matched)
            {
                rtp_for_winning_number = obj_of_rtp[each];
                
            }
    
            
          }
          console.log("winned rtp",rtp_for_winning_number);
          const placed_bet_amount = find_bet_from_bet_id.bet_amount ;
          const win_amount = placed_bet_amount*rtp_for_winning_number ;
          console.log("win_amount",win_amount);


          //res = new response(result, responseMessage.DATA_FOUND)
          
           res={ win_amount : win_amount,
            error: false,}
           
            
          resolve(res);
         
     
    })
}

module.exports = {
    number_match: number_match
  };