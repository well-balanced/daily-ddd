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

function deleteTask(body) {
    db.query(`DELETE FROM todo WHERE task='${body.task}'`)
}

function changeState(body) {
    db.query(`UPDATE todo SET state='${body.state}' WHERE task='${body.task}'`)
}

const onDelete = (e) => {
    var p = $(e.target).parent();
    $.ajax({ 
      url:'/delete', 
      type:'post', 
      data:{task:`${p.text().trim()}`},
    });
    p.fadeOut('slow',()=>{
      p.remove()
    })
}


app.get('/',(req,res)=>{
    getUserInfo('well-balanced', (taskList,progressList,doneList)=>{
        res.render('index',{
            taskList,
            progressList,
            doneList,
            onDelete
        })
    })
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

app.listen(3000,()=>{
    console.log('Port 3000!')
})