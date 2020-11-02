const express=require('express')
var session = require('express-session');
var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
var body = require('body-parser');
var morgan = require('morgan');
// var passport = require('passport');
var flash = require('connect-flash');
var bcrypt = require('bcrypt-nodejs');
var mysql = require('mysql')

const app = express()



app.set('view engine','ejs')
app.use(express.static('public'))

app.use(body.urlencoded({ extended: false }));
app.use(body.json())

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kumar@123',
  database: 'Chat'
});

connection.connect(function (err) {
  if (err) {
    throw err;
  }
  else {
    console.log("Database connected succesfully");
  }
});

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/index',function(req,res){
  res.render('after-home')
})

app.get('/login',function(req,res){
  res.render('login')
})

app.post('/login', function (req, res, err) {
	if (err) {
		console.log(err);
	}
	var check = {
		email: req.body.email,
		password: req.body.password,
  };
  
  var sql = 'SELECT id FROM user WHERE email = ? AND password = ?';
  connection.query(sql, [check.email,check.password], function (err, result) {
    if(err)
    {
      console.log(err);
    }
    else{
      res.redirect('/chat');
    }
  });
});



app.get('/signup',function(req,res){
  res.render('signup')
})

app.post('/signup', function (req, res, err) {
	if (err) {
		console.log(err);
	}
	// console.log(req.body);
	var payer = {
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
	};
	var insertQuery = 'INSERT INTO user (email,username,password) values (?,?,?)';
	connection.query(insertQuery, [payer.email, payer.username, payer.password], function (err, rows, fields) {
		if (err) {
			throw err;
		} else {
			payer.id = rows.insertId;
			console.log('payer added succesfully');
			res.redirect('/chat');
		}
		// console.log('The solution is: ', rows[0].solution)
	});
});

app.get('/chat',function(req,res){
  res.render('index')  
});

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
