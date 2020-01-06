const mysql = require('mysql');
const db = mysql.createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database
  });

const getUser = (username,callback) => {
    db.query(`SELECT * FROM users WHERE users.username='${username}'`, (error, user) => {
        if (error) {
            throw error;
        }
        callback(user[0].id)
    })
}


exports.setDB = () => {
    db.connect();
}


exports.getChartList = (username,callback) => {
    let todos = [];
    if(!username) {
        callback(todos)
        return
    }
    getUser(username, (id) => {
        db.query(`SELECT todoname FROM todo WHERE user_id=${id}`, (error, results) => {
            results.forEach((data) => {
                todos.push(data.todoname)
            })
            todos = Array.from(new Set(todos))
            callback(todos)
        })
    })
    // db.query(`SELECT * FROM users WHERE users.username="${username}"`,function (error, user, fields) {
    //     if (error) {
    //         console.log(error)
    //     }
    //     var todoList, taskList, progressList, doneList = [];
    //     if (user[0]) {
    //         if(todoname==undefined){
    //             db.query(`SELECT todoname FROM todo WHERE user_id=${user[0].id}`,(error,todos)=>{
    //                 if(todos[0]!==undefined) {
    //                     todos.forEach((data)=>{
    //                         todoList.push(data.todoname)
    //                     })
    //                 }
    //                 todoList = Array.from(new Set(todoList))
    //                 callback(todoList,taskList,progressList,doneList)
    //             })
    //             return
    //         }
    //         db.query(`SELECT state,task,todoname FROM todo WHERE user_id=${user[0].id} AND todoname='${todoname}'`,function (error, results, fields) {
    //             if (error) {
    //                 console.log(error)
    //             } else if (results[0]!==undefined) {
    //                 todoList.push(results[0].todoname)
                    // results.forEach((result,index)=>{
                    //     if(result.state === 'task') {
                    //         taskList.push(result.task)
                    //     } else if(result.state === 'progress') {
                    //         progressList.push(result.task)
                    //     } else if(result.state === 'done') {
                    //         doneList.push(result.task)
                    //     }
                    //     todoList.forEach((todo)=>{
                    //         if(todo!==result.todoname) {
                    //             todoList.push(result.todoname)
                    //         }
                    //     })
                    // })
    //             }
    //             todoList = Array.from(new Set(todoList))
    //             callback(todoList,taskList,progressList,doneList)
    //         })
    //     } else {
    //         callback(todoList,taskList,progressList,doneList)
    //     } 
    // })
}

exports.getChart = (username, chartname, callback) => {
    getUser(username, (id) => {
        db.query(`SELECT todoname FROM todo WHERE user_id=${id}`, (error, datas)=>{
            let tasks =[], doings = [], ends = [], todos = []
            datas.forEach((data)=>{
                todos.push(data.todoname)
            })
            db.query(`SELECT * FROM todo WHERE user_id=${id} AND todoname='${chartname}'`, (error, results) => {
                if (error) {
                    throw error;
                }
                results.forEach((result,index)=>{
                    todos.push(result.todoname)
                    if(result.state === 'task') {
                        tasks.push(result.task)
                    } else if(result.state === 'progress') {
                        doings.push(result.task)
                    } else if(result.state === 'done') {
                        ends.push(result.task)
                    }
                })
                todos = Array.from(new Set(todos))
                callback(todos,tasks,doings,ends)
            })
        })
    })
}

exports.deleteToDo = (todoname) => {
    db.query(`DELETE FROM todo WHERE todoname='${todoname}';`)
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