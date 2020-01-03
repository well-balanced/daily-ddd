const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;


var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'softkei7&',
    database : 'todo'
  });
db.connect();
passport.use(new LocalStrategy(
    function(username, password, done) {
    //   User.findOne({ username: username }, function(err, user) {
    //     if (err) { return done(err); }
    //     if (!user) {
    //       return done(null, false, { message: 'Incorrect username.' });
    //     }
    //     if (!user.validPassword(password)) {
    //       return done(null, false, { message: 'Incorrect password.' });
    //     }
    //     return done(null, user);
    //   });
    }
));
router.post('/login', passport.authenticate('local', {failureRedirect: '/auth/login', failureFlash: true}), // 인증 실패 시 401 리턴, {} -> 인증 스트레티지
  function (req, res) {
    res.redirect('/');
  });

// router.post('/login',function (req,res,next) {
//     console.log(req.body)
//     var user_id = req.body.username;
//     var password = req.body.password;
//     db.query("SELECT * FROM users WHERE username = ?;", user_id, (err,result)=>{
//         if (err) {
//             console.log(err)
//         } else {
//             console.log(result)
//             if (result.length === 0) {
//                 res.json({success: false, msg: '해당 유저가 존재하지 않습니다.'})
//             } else {
//                 if (!bcrypt.compareSync(password, result[0].password)) {
//                     res.json({success: false, msg: '비밀번호가 일치하지 않습니다.'})
//                 } else {
//                     res.json({success: true})
//                 }
//             }
//         }
//     })
// });

module.exports = router;
