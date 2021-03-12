// James Landreth
// CS-290_400
// 03/11/2021
// HW6 

var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

var mysql = require('mysql');
var myPool = mysql.createPool({
    host: 'localhost',
    user: 'student',
    password: 'default',
    database: 'student'
});


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);



app.get('/reset-table', function (req, res) {
    var context = {};
    myPool.query("DROP TABLE IF EXISTS workouts", function (err) { //replace your connection pool with the your variable containing the connection pool
        var createString = "CREATE TABLE workouts(" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "name VARCHAR(255) NOT NULL," +
            "reps INT," +
            "weight INT," +
            "date DATE," +
            "lbs BOOLEAN)";
        mysql.myPool.query(createString, function (err) {
            context.results = "Table reset";
            res.render('home', context);
        })
    });
});


app.get('/insert', function (req, res, next) {
    var context = {};
    myPool.query("INSERT INTO workouts (`name`) VALUES (?)", [req.query.c], function (err, result) {
        if (err) {
            next(err);
            return;
        }
        context.results = "Inserted id " + result.insertId;
        res.render('home', context);
    });
});

app.get('/safe-update', function (req, res, next) {
    var context = {};
    myPool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function (err, result) {
        if (err) {
            next(err);
            return;
        }
        if (result.length == 1) {
            var curVals = result[0];
            myPool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
                [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs, req.query.id],
                function (err, result) {
                    if (err) {
                        next(err);
                        return;
                    }
                    context.results = "Updated " + result.changedRows + " rows.";
                    res.render('home', context);
                });
        }
    });
});

function deleteRow(tableID, currentRow) {
    try {
        var table = document.getElementById(tableID);
        var rowCount = table.rows.length;
        for (var i = 0; i < rowCount; i++) {
            var row = table.rows[i];
            /*var chkbox = row.cells[0].childNodes[0];*/
            /*if (null != chkbox && true == chkbox.checked)*/

            if (row == currentRow.parentNode.parentNode) {
                if (rowCount <= 1) {
                    alert("Cannot delete all the rows.");
                    break;
                }
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
    } catch (e) {
        alert(e);
    }
    //getValues();
}


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

app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});


app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});