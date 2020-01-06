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
const checkLogined = (user) => {
    var username
    if(user) {
        username = user[0].username
    }
    return username
}
app.get('/',(req,res) => {
    var username = checkLogined(req.user)
    db.getChartList(username, (todoList) => {
        res.render('index',{
            root : true,
            username,
            todoList,
        })
    })
})


app.get('/chart/:id',(req,res)=>{
    var chartname = req.params.id;
    var username = checkLogined(req.user)
    db.getChart(username, chartname, (todoList, taskList, progressList, doneList) => {
        res.render('index',{
            username,
            todoList,
            taskList,
            progressList,
            doneList,
            chartname
        })
    })
})

app.delete('/chart/:id',(req,res)=>{
    db.deleteToDo(req.body.todoname);
    res.send('성공')
})


app.post('/new',(req,res)=>{
    db.createNewToDo(req.user[0].id,req.body.newName)
})

app.post('/create',(req,res)=>{
    var userId = req.user[0].id
    db.createTask(req.body,userId)
    res.redirect('/');
})

app.post('/progress',(req,res)=>{
    db.changeState(req.body)
});

app.post('/done',(req,res)=>{
    db.changeState(req.body)
})

app.post('/delete',(req,res)=>{
    db.deleteTask(req.body)
})

app.listen(3000,()=>{
    console.log('Port 3000!')
})