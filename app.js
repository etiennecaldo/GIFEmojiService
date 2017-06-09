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

app.get('/api/:feature/favorite/', function (req, res) {
    if (supportedFeatures.indexOf(req.params.feature) == -1) sendError(res, 404, "Unknown feature: " + req.params.feature);
    try {
        res.send(db.getData("/userid/" + req.params.feature));
    } catch(err) {
        res.send([])
    }
})

app.post('/api/:feature/favorite/', function (req, res) {
    if (supportedFeatures.indexOf(req.params.feature) == -1) sendError(res, 404, "Unknown feature: " + req.params.feature);
    res.send(db.push("/userid/" + req.params.feature + "[]", req.body));
})

var port = process.env.port || 8080;
app.listen(port, function () {
    console.log('Example app listening on port ' + port + ' !')
})

