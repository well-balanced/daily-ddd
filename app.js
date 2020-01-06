const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const mysql = require('mysql');
const bodyParser = require('body-parser');
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


var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'softkei7&',
    database : 'todo'
  });
db.connect();




// '/' get


function getUserInfo(username,todoname,callback) {
    db.query(`SELECT * FROM users WHERE users.username="${username}"`,function (error, user, fields) {
        if (error) {
            console.log(error)
        }
        var todoList = [];
        var taskList = [];
        var progressList = [];
        var doneList = [];
        if (user[0]) {
            if(todoname==undefined){
                db.query(`SELECT todoname FROM todo WHERE user_id=${user[0].id}`,(error,todos)=>{
                    if(todos[0]!==undefined) {
                        todos.forEach((data)=>{
                            todoList.push(data.todoname)
                            // todoList.forEach((todo)=>{
                            //     if(todo!==todoname.todoname) {
                            //         todoList.push(todoname.todoname)
                            //     }
                            // })
                        })
                    }
                    todoList = Array.from(new Set(todoList))
                    callback(todoList,taskList,progressList,doneList)
                })
                return
            }
            db.query(`SELECT state,task,todoname FROM todo WHERE user_id=${user[0].id} AND todoname='${todoname}'`,function (error, results, fields) {
                if (error) {
                    console.log(error)
                } else if (results[0]!==undefined) {
                    todoList.push(results[0].todoname)
                    results.forEach((result,index)=>{
                        if(result.state === 'task') {
                            taskList.push(result.task)
                        } else if(result.state === 'progress') {
                            progressList.push(result.task)
                        } else if(result.state === 'done') {
                            doneList.push(result.task)
                        }
                        todoList.forEach((todo)=>{
                            if(todo!==result.todoname) {
                                todoList.push(result.todoname)
                            }
                        })
                    })
                }
                todoList = Array.from(new Set(todoList))
                callback(todoList,taskList,progressList,doneList)
            })
        } else {
            callback(todoList,taskList,progressList,doneList)
        } 
    })
}

function createTask(body,id) {
    db.query(`INSERT INTO todo (task,state,user_id,todoname) values('${body.task}','${body.state}','${id}','${body.todoname}')`)
}

function deleteTask(body) {
    db.query(`DELETE FROM todo WHERE task='${body.task}'`)
}

function changeState(body) {
    db.query(`UPDATE todo SET state='${body.state}' WHERE task='${body.task}'`)
}


function createNewToDo(id,name) {
    console.log(name)
    db.query(`INSERT INTO todo (todoname,user_id) values('${name}','${id}')`)
}
app.get('/',(req,res)=>{
    var isLogined, username
    if(req.user) {
        var isLogined = true;
        var username = req.user[0].username
    }
    getUserInfo(username, req.query.todoname, (todoList,taskList,progressList,doneList)=>{
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
    getUserInfo(username, req.body.todoname, (todoList,taskList,progressList,doneList)=>{
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
    createNewToDo(req.user[0].id,req.body.newName)

})

app.post('/create',(req,res)=>{
    var userId = req.user[0].id
    createTask(req.body,userId)
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



app.listen(3000,()=>{
    console.log('Port 3000!')
})