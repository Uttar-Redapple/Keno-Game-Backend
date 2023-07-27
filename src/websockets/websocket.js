let setNSP = (gameIo) => {
    let auth = require('../middlewares/auth');
    console.log(`socket server listening on NameSpace : ${gameIo.name}`);
    gameIo.on('connection',async (socket) => {

        

        /**
         * Connection Handler.
        **/
        console.log('user connected');
        console.log(`one socket connected:${socket.id} with user_id:${socket.id}`);
        let draw_id = 80000  ;
        

        
        socket.emit('draw_id',async () => {
            setInterval(function displayDrawid() {
                draw_id = draw_id + 1;
                console.log ("draw_id",draw_id);
          
                }, 12000);
            
        });
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
}

module.exports = {
    setNSP:setNSP
}