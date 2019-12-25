const express = require('express');
const app = express();
const hbs = require('express-handlebars');

app.use(express.static(__dirname+'/public'));

app.engine('hbs',hbs({
    extname:'hbs',
    defaultLayout:'layout',
    layoutsDir:__dirname+'/views/layout',
    partialsDir:__dirname+'views/partials'
}));

app.set('view engine','hbs');

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/create',(req,res)=>{
    res.render('index', {
        create:true
    })
})

app.listen(3000,()=>{
    console.log('Port 3000!')
})