require('dotenv').config();
const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const db = require('./dbFunction');

app.use(session({
    secret: 'asadlfkj!@#!@#dfgasdg',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host:process.env.host,
        port: process.env.port,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    }),
  }))
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'));
app.engine('hbs',hbs({
    extname:'hbs',
    defaultLayout:'layout',
    layoutsDir:__dirname+'/views/layout',
    partialsDir:__dirname+'/views/partials'
}));
app.set('view engine','hbs');

app.use('/auth',require('./api/auth/index'))

db.setDB()

app.get('/',(req,res)=>{
    var isLogined, username
    if(req.user) {
        var isLogined = true;
        var username = req.user[0].username
    }
    db.getUserInfo(username, req.query.todoname, (todoList,taskList,progressList,doneList)=>{
        console.log(taskList)
        res.render('index',{
            isLogined,
            username,
            todoList,
            taskList,
            progressList,
            doneList,
        })
    })
})

app.post('/',(req,res)=>{
    var isLogined, username
    if(req.user) {
        var isLogined = true;
        var username = req.user[0].username
    }
    db.getUserInfo(username, req.body.todoname, (todoList,taskList,progressList,doneList)=>{
        res.render('index',{
            isLogined,
            username,
            todoList,
            taskList,
            progressList,
            doneList,
        })
    })
})


app.post('/new',(req,res)=>{
    db.createNewToDo(req.user[0].id,req.body.newName)

})

app.post('/create',(req,res)=>{
    var userId = req.user[0].id
    db.createTask(req.body,userId)
})

app.post('/delete',(req,res)=>{
    db.deleteTask(req.body)
})

app.post('/progress',(req,res)=>{
    db.changeState(req.body)
});

app.post('/done',(req,res)=>{
    db.changeState(req.body)
})


app.listen(3000,()=>{
    console.log('Port 3000!')
})