const express = require('express');
const router = express.Router();
const controller = require('./controller');
const flash = require('connect-flash');
const passport = require('passport')

router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

controller.passportSetting()

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/auth/login/fail', failureFlash:true}));

router.get('/login/fail', controller.flashMessage)

router.post('/register', controller.register);

router.get('/logout', controller.logout)

module.exports = router;