const mysql = require('mysql');
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

var db = mysql.createConnection({
    host : process.env.host,
    user : process.env.user,
    password : process.env.password,
    database : process.env.database
});
db.connect();


exports.flashMessage = (req,res) => {
    res.status(409).send(req.flash().error[0])
}

exports.passportLogin = () => {
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/auth/login/fail', failureFlash:true})
}

exports.register = (req,res) => {
    var username = req.body.username;
    var password = req.body.password;
    db.query(`SELECT * FROM users WHERE username='${username}';`, (err,user)=>{
        if(user[0]) {       
            res.status(409).send('이미 존재하는 username 입니다.')
        } else {
            if(username.length > 16 || password.length > 16) {
                res.status(409).send("username과 password는 16자를 넘을 수 없습니다.")
            } else {
                db.query(`INSERT INTO users (username,password) values('${username}','${password}')`)
                res.send('성공적으로 회원가입이 완료되었습니다.')
            }
        }
    })
}

exports.logout = (req,res) => {
    req.logout()
    res.redirect('/')
}

exports.passportSetting = () => {
    passport.serializeUser(function(user, done) {
        done(null, user[0].username);
      });
      
      passport.deserializeUser(function(username, done) {
        db.query("SELECT * FROM users WHERE username = ?;", username, (err,user)=>{
            done(null, user);  
        })
      });
       
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
}
