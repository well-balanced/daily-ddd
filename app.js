const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const app = express();
const hbs = require('express-handlebars');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)

app.use(session({
    secret: 'asadlfkj!@#!@#dfgasdg',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host:'localhost',
        port: 3306,
        user: 'root',
        password: 'softkei7&',
        database: 'todo'
    }),
  }))

passport.serializeUser(function(user, done) {
    done(null, user[0].username);
});
  
passport.deserializeUser(function(username, done) {
    db.query("SELECT * FROM users WHERE username = ?;", username, (err,user)=>{
        done(null, user);  
    })
});

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/auth',require('./api/auth/index'))


var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'softkei7&',
    database : 'todo'
  });
db.connect();
   
passport.use(new LocalStrategy(
    function(username, password, done) {
        db.query("SELECT * FROM users WHERE username = ?;", username, (err,user)=>{
            if(err) {
                return done(err);
            }
            if(user.length===0) {
                return done(null,false, {message: '유저가 존재하지 않습니다.'})
            }
            if(password!==user[0].password){
                return done(null,false, {message:'잘못된 비밀번호입니다.'})
            }
            return done(null,user)
        })
    }
));


app.use(express.static(__dirname+'/public'));

app.engine('hbs',hbs({
    extname:'hbs',
    defaultLayout:'layout',
    layoutsDir:__dirname+'/views/layout',
    partialsDir:__dirname+'views/partials'
}));

app.set('view engine','hbs');

// '/' get

function authUser(user) {
    if(user) {
        return true;
    } else {
        return false;
    }
}

function getUserInfo(username,callback) {
    db.query(`SELECT * FROM users WHERE users.username="${username}"`,function (error, user, fields) {
        if (error) {
            console.log(error)
        }
        var todoList = [];
        var taskList = [];
        var progressList = [];
        var doneList = [];
        if (user[0]) {
            db.query(`SELECT state,task,todoname FROM todo LEFT JOIN users ON todo.user_id=${user[0].id}`,function (error, results, fields) {
                if (error) {
                    console.log(error)
                }
                todoList.push(results[0].todoname)
                results.forEach((result,index)=>{
                    if(result.state === 'task') {
                        taskList.push(result.task)
                    } else if(result.state === 'progress') {
                        progressList.push(result.task)
                    } else if(result.state === 'done') {
                        doneList.push(result.task)
                    }
                    todoList.forEach((todo,i)=>{
                        if(todo!==result.todoname) {
                            todoList.push(result.todoname)
                        }
                    })
                })
                todoList = Array.from(new Set(todoList))
                callback(todoList,taskList,progressList,doneList)
            })
        } else {
            callback(todoList,taskList,progressList,doneList)
        } 
    })
}

function createTask(body) {
    db.query(`INSERT INTO todo (task,state,user_id,todoname) values('${body.task}','${body.state}','${body.id}','${todoname}')`)
}

function deleteTask(body) {
    db.query(`DELETE FROM todo WHERE task='${body.task}'`)
}

function changeState(body) {
    db.query(`UPDATE todo SET state='${body.state}' WHERE task='${body.task}'`)
}


function createNewToDo(user,name) {
    console.log(name)
    db.query(`INSERT INTO todo (todoname) values('${name}')`)
}


app.get('/',(req,res)=>{
    var isLogined, username
    if(req.user) {
        var isLogined = authUser(req.user[0])
        var username = req.user[0].username
    }
    getUserInfo(username, (todoList,taskList,progressList,doneList)=>{
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
    createNewToDo('well-balanced',req.body.newName)

})

app.post('/create',(req,res)=>{
    createTask(req.body)
})

app.post('/delete',(req,res)=>{
    deleteTask(req.body)
})

app.post('/progress',(req,res)=>{
    changeState(req.body)
});

app.post('/done',(req,res)=>{
    changeState(req.body)
})

app.post('/auth/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/fail' }), (req,res)=> {
});

app.get('/auth/logout', (req,res)=>{
    req.logout()
    res.redirect('/')
})


app.listen(3000,()=>{
    console.log('Port 3000!')
})