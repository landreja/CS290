// James Landreth
// CS-290_400
// 02/21/2021
// HW5 

var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/', function (req, res) {
    res.render('home.handlebars')
});

app.get('/get', function (req, res) {
    var qParams = [];
    for (var p in req.query) {
        qParams.push({ 'name': p, 'value': req.query[p] })
    }
    var context = {};
    context.dataList = qParams;
    res.render('get', context);
});

var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/post', function (req, res) {
    var qParams = [];
    for (var p in req.body) {
        qParams.push({ 'name': p, 'value': req.body[p] })
    }
    var context = {};
    context.dataList = qParams;
    res.render('post', context);
});

app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});