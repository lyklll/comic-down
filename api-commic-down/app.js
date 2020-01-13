var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var xmlparser = require('express-xml-bodyparser');
var mainRouter = require('./routes/main');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(xmlparser({ explicitArray: false }))
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'public')));
mainRouter.forEach(router => {
    app.use('/', router);
})
app.use(function (req, res, next) {
    var err = new Error('404 Not Found');
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.json({ issuccess: false, data: err.message })
});

module.exports = app;
