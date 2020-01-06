const mysql = require('mysql');

var db = mysql.createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database
  });

exports.setDB = () => {
    db.connect();
}


exports.getUserInfo = (username,todoname,callback) => {
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

exports.createTask = (body,id) => {
    db.query(`INSERT INTO todo (task,state,user_id,todoname) values('${body.task}','${body.state}','${id}','${body.todoname}')`)
}

exports.deleteTask = (body) => {
    db.query(`DELETE FROM todo WHERE task='${body.task}'`)
}

exports.changeState = (body) => {
    db.query(`UPDATE todo SET state='${body.state}' WHERE task='${body.task}'`)
}


exports.createNewToDo = (id,name) => {
    db.query(`INSERT INTO todo (todoname,user_id) values('${name}','${id}')`)
}