const express = require('express')
const app = express()
var giphy = require('giphy-api')();
var emoji = require('node-emoji')
var JsonDB = require('node-json-db');
var db = new JsonDB("myDataBase", true, true);

var supportedFeatures = ["emojis", "gifs"];

function sendError(res, status, err) {
    res.status(status).send({"error":err});
};

var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    sendError(res, 422, "Syntax Error");
  } else {
    next();
  }
});

app.get('/api/:feature/search/', function (req, res) {
    try {
        switch(req.params.feature) {
            case 'emojis':
                res.send(emoji.search(req.query.q).map(function(d) { return d["emoji"]; }).slice(0,20));
                break;
            case 'gifs':
                req.query.limit=20
                giphy.search(req.query, function (err, response) {
                    gifs = response.data || []
                    res.send(gifs.map(function(d) { return d["embed_url"]; }));
                });
                break;
            default:
                throw "Unknown feature: " + req.params.feature;
        }
    } catch(err) {
        sendError(res, 404, err);
    }
})

app.all('/api/:feature/favorite/', function (req, res) {
    try {
        if (supportedFeatures.indexOf(req.params.feature) == -1) throw "Unsupported feature: " + req.params.feature;
        if (!req.header("x-auth-user")) throw "No Authentification";

        var nodeDB = [,req.header("x-auth-user"), req.params.feature].join("/");
        console.log(nodeDB)
        console.log(req.method)
        switch(req.method.toLowerCase()) {
            case "post":
                res.status(204).send(db.push(nodeDB + "[]", req.body));
                break;
            case "get":
                try {
                    res.send(db.getData(nodeDB));
                } catch(err) {
                    res.send([]);
                }
                break;
            default:
                throw "Unsupported method"
        }
    } catch(err) {
        sendError(res, 404, err);
    }
})

var port = process.env.port || 8080;
app.listen(port, function () {
    console.log('Example app listening on port ' + port + ' !')
})

