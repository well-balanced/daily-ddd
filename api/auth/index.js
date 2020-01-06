require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const flash = require('connect-flash');
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)

router.use(session({
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


router.use(passport.initialize());
router.use(passport.session());
router.use(flash());



controller.passportSetting()

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/auth/login/fail', failureFlash:true}));

router.get('/login/fail', controller.flashMessage)

router.post('/register', controller.register);

router.get('/logout', controller.logout)

module.exports = router;