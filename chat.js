/**
 * Created by su on 17/1/10.
 */
var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

app.get('/',function (req,res) {
   res.sendFile(__dirname + '/index.html');
});

var user_count = 0;
io.on('connection',function (socket) {

    socket.on('add user',function (msg) {
        socket.username = msg;
        console.log('新用户'+msg+'已加入');
        io.emit('add user',{
            username : socket.username
        });
    });

    socket.on('chat message',function (msg) {
        console.log(socket.username+':'+msg);
        io.emit('chat message',{
            username :socket.username,
            msg : msg
        });
    });

    socket.on('disconnect',function (msg) {
        console.log(socket.username+'已离开');
        io.emit('user left',{
            username : socket.username
        });
    });
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:3000');
});