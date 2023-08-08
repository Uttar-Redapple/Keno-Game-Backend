let setNSP = (gameIo) => {
    let turnCountdown = {};
    let { eventEmitter} = require('../../config/appConfig');
    let auth = require('../middlewares/auth');
    console.log(`socket server listening on NameSpace : ${gameIo.name}`);
    const {mainGameLoop,startDraw} = require('../casino/keno/keno');
    mainGameLoop();
    function fancyTimeFormat(duration) {
        // Hours, minutes and seconds
        const hrs = ~~(duration / 3600);
        const mins = ~~((duration % 3600) / 60);
        const secs = ~~duration % 60;
      
        // Output like "1:01" or "4:03:59" or "123:03:59"
        let ret = "";
      
        if (hrs > 0) {
          ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }
      
        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
      
        return ret;
      }
    gameIo.use(auth.isAuthorizedSocket).on('connection',async (socket) => {
        /**
         * Connection Handler.
        **/
        console.log('user connected');
        console.log(`one socket connected:${socket.id} with user_id:${socket.id}`);
        /**
         * Socket Events For Application Logic.
        **/

        /**
         * Disconnection Handler.
        **/
        socket.on('disconnect',async () => {
            console.log(`one socket disconnected:${socket.id} with user_id:${socket.id}`);
        });
    });

    eventEmitter.on('start-timer', (round_id) => {
        let counter = process.env.TURNTIME;
        // let time_pivot = 1;
        // let time_fract = 1/counter;
        console.log(`Timer started for round ${round_id} Counter : ${counter}`);
        turnCountdown = setInterval(function () {
            gameIo.emit("update-timer", { next_draw_id: round_id, counter: fancyTimeFormat(counter)});
            counter--
            // time_pivot -= time_fract;
            //console.log(`Counter : ${counter}`);
            if (counter == 0) {
                console.log(`Timer stopped for ${round_id} :: starting draw`);
                clearInterval(turnCountdown);
                //console.log('time up fold and updating bet');
                gameIo.emit("update-timer", { next_draw_id: round_id, counter: fancyTimeFormat(counter)});
                startDraw();
            }
        }, 1000);
    });

    eventEmitter.on('start-draw', (queue) => {
        for(let i=0;i<queue.size;i++){
            setTimeout(()=>{
                let data = queue.dequeue();
                if(data.event == "start-draw"){
                    gameIo.emit("update-draw",data.data.data);
                }else{
                    eventEmitter.emit("stop-draw",data.data);
                }
            },i * 1500);
        }
        // if(draw.i == 19){
        //     eventEmitter.emit('stop-draw',{
        //         draw_id:draw.draw_id
        //     })
        // }
    });

    eventEmitter.on('stop-draw', (draw) => {
        setTimeout(()=>{
            gameIo.emit("stop-draw",draw);
        },1500);

        setTimeout(()=>{
            mainGameLoop();
        },90 * 1000);
    });
}

module.exports = {
    setNSP:setNSP
}