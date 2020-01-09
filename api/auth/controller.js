const mysql = require('mysql');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});
db.connect();


exports.flashMessage = (req,res) => {
    res.status(409).send(req.flash().error[0]);
};

exports.passportLogin = () => {
    passport.authenticate('local', { 
        successRedirect: '/', 
        failureRedirect: '/auth/login/fail', 
        failureFlash: true
    });
};

exports.register = (req,res) => {
    var username = req.body.username;
    var password = req.body.password;
    db.query(`SELECT * FROM users WHERE username='${username}';`, (err,user) => {
        if(user[0]) {       
            res.status(409).send('Username already exists.');
        } else {
            if(username.length > 16 || password.length > 16) {
                res.status(409).send("Username and Password can't exceed 16 digits");
            } else {
                db.query(`INSERT INTO users (username,password) values('${username}','${password}')`)
                res.send('Welcome! Register was successfully completed.');
            }
        }
    });
};

exports.logout = (req,res) => {
    req.logout();
    res.redirect('/');
}

exports.passportSetting = () => {
    passport.serializeUser((user, done) => {
        done(null, user[0].username);
      });
      
      passport.deserializeUser((username, done) => {
        db.query("SELECT * FROM users WHERE username = ?;", username, (err,user)=>{
            done(null, user);  
        });
      });
       
      passport.use(new LocalStrategy(
        function(username, password, done) {
            db.query("SELECT * FROM users WHERE username = ?;", username, (err,user) => {
                if(err) {
                    return done(err);
                }
                if(user.length===0) {
                    return done(null,false, {message: 'User does not exist.'});
                }
                if(password!==user[0].password) {
                    return done(null,false, {message:'Invalid Password.'});
                }
                return done(null,user);
            });
        }
      ));
};
