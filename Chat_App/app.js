const express=require('express')
const app = express()



app.set('view engine','ejs')

app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.render('index')
})

server=app.listen(3000,function(){
    console.log('Server Started')
})

const io = require('socket.io')(server)

io.on('connection',(socket)=>{
    console.log('New Connetion')

    socket.username = 'Anonymous'

    socket.on('change_username', (data) => {
		socket.username = data.username;
    });
    
    socket.on('new_message', (data) => {
		//broadcast the new message
		io.sockets.emit('new_message', { message: data.message, username: socket.username });
    });
    
    socket.on('typing', (data) => {
		socket.broadcast.emit('typing', { username: socket.username });
	});



})
