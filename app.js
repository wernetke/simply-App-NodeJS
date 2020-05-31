const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const loginRouter = require ('./routes/login');

const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');

const app = express();

let options = {
    name: 'Cookie',
    secret: 'cookiesecret',
    cookie: { maxAge: 60000 }
    //etc
}
app.use(session(options));
app.use(checkConnexion);

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({defaultLayout: 'login', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', loginRouter);
app.use('/index', indexRouter);
app.use('/login', loginRouter);

function checkConnexion(req,res,next){

    if (typeof req.session.username === 'undefined') {

        app.locals.checkconnexion = false;
        next();
    }
    else{
        console.log("not connected");
        app.locals.hello = req.session.username;
        app.locals.checkconnexion = true;
        app.locals.choucroute= true;
        next();
    }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

