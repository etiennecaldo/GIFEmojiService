const express = require('express')
const app = express()
var giphy = require('giphy-api')();

app.get('/api/:type/search/', function (req, res) {
    try 
    {
        switch(req.params.type) {
            case 'emoji':
            case 'gif':
                req.query.limit=20
                giphy.search(req.query, function (err, response) {
                    gifs = response.data || []
                    res.send(gifs.map(function(d) { return d["embed_url"]; }));
                });
                break;
            default:
                throw "Unknown type: " + req.params.type;
        }
        //res.send(req.params.type)
    }
    catch(err)
    {
        sendError(res, 404, err);
    }
})

function sendError(res, status, err) {
    res.status(status).send({"error":err});
}


app.get('/', function (req, res) {
    console.log(req.query);
    
    
});
/*
app.get('*', function (req, res) {
    sendError(res, 404, "Cannot get " + req.path);
})
*/
var port = process.env.port || 8080;
app.listen(port, function () {
    console.log('Example app listening on port ' + port + ' !')
})

