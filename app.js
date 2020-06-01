const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const config = require('./config.json');
const indexRouter = require('./routes/index');
const loginRouter = require ('./routes/login');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const app = express();
//option session never expire (Approximately Friday, 31 Dec 9999 23:59:59 GMT)
let options = {
    name: 'Cookie',
    secret: 'cookiesecret',
    cookie: {expires: new Date(253402300000000)}
    //etc
}
app.use(session(options));
app.use(checkConnexion);


app.engine('hbs', exphbs({
        defaultLayout: 'layout',
        extname: 'hbs',
        // ...implement newly added insecure prototype access
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    })
);
app.set('view engine', 'hbs');
app.set('views', 'views');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', loginRouter);
app.use('/index', indexRouter);
app.use('/index/next', indexRouter);
app.use('/login', loginRouter);


function checkConnexion(req,res,next){
    if (typeof req.session.userId === 'undefined') {
        app.locals.checkconnexion = false;
        next();
    }
    else{
        app.locals.checkconnexion = true;
        next();
    }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

