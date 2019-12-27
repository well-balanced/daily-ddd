const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const mysql = require('mysql');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'softkei7&',
    database : 'todo'
  });
db.connect();
   



app.use(express.static(__dirname+'/public'));

app.engine('hbs',hbs({
    extname:'hbs',
    defaultLayout:'layout',
    layoutsDir:__dirname+'/views/layout',
    partialsDir:__dirname+'views/partials'
}));

app.set('view engine','hbs');

// '/' get
function getUserInfo(username,callback) {
    db.query(`SELECT * FROM users WHERE users.username="${username}"`,function (error, user, fields) {
        if (error) {
            console.log(error)
        }
        db.query(`SELECT state,task FROM todo LEFT JOIN users ON todo.user_id=${user[0].id}`,function (error, results, fields) {
            if (error) {
                console.log(error)
            }
            var taskList = [];
            var progressList = [];
            var doneList = [];
            results.forEach((result,index)=>{
                if(result.state === 'task') {
                    taskList.push(result.task)
                } else if(result.state === 'progress') {
                    progressList.push(result.task)
                } else if(result.state === 'done') {
                    doneList.push(result.task)
                }
            })
            callback(taskList,progressList,doneList)
        })
    })
}

function createTask(body) {
    db.query(`INSERT INTO todo (task,state,user_id) values('${body.task}','${body.state}','${body.id}')`)
}

getUserInfo('well-balanced', (taskList,progressList,doneList)=>{
    app.get('/',(req,res)=>{
        res.render('index',{
            taskList,
            progressList,
            doneList
        })
    })
})




app.post('/create',(req,res)=>{
    createTask(req.body)
})

app.listen(3000,()=>{
    console.log('Port 3000!')
})