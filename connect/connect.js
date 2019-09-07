const socket = io.connect();

const playInit = document.querySelector('#playCreate');
const tokenBox = document.querySelector('#tokenBox');
const tokenValue = document.querySelector("#tokenValue");
const sendMessage = document.querySelector("#sendMessage");

let selfIdInit;
let joinId;
let peerInit
let peerJoin


playInit.addEventListener("click",(e)=>{
    peerInit = new SimplePeer({
        initiator:true,trickle:false,objectMode:true
    });
    peerInit.on('signal', (data)=>{
        selfIdInit = JSON.stringify(data);
        tokenBox.value = selfIdInit;
        
    })
    peerInit.on('data', (data)=>{
        appendMessage("oppo", data);
    });
})

playToken.addEventListener("click",(e)=>{
    peerJoin = new SimplePeer({
        initiator:false,trickle:false,objectMode:true
    });
    joinId = tokenValue.value;
    peerJoin.signal(joinId);
    
    peerJoin.on('signal',(data)=>{
        const obj = {
            "mine":JSON.stringify(data),
            "their":joinId
        }
        socket.emit('send message', obj );
        
    })
    peerJoin.on('data', (data)=>{
        appendMessage("self", data);
    });
})

sendMessage.addEventListener("click", ()=>{
    let message = document.querySelector("#message").value;
    if(selfIdInit){
        message.user = "self";
        peerInit.send(message);
        appendMessage("self", message);
    }else{
        message.user = "oppo";
        peerJoin.send(message);
        appendMessage("oppo", message);
    }
});

socket.on('new message',(data)=>{
    if( data.msg.their == selfIdInit){
        peerInit.signal(JSON.parse(data.msg.mine));
    }
});




