const express = require('express')
const app = express()

app.get('/api/:type/search/:query', function (req, res) {
    try 
    {
        switch(req.params.type) {
            case 'emoji':
            case 'gif':
                console.log(req.params.type);
                break;
            default:
                throw "Unknown type: " + req.params.type;
        }
        res.send(req.params.type)
    }
    catch(err)
    {
        sendError(res, 404, err);
    }
})

function sendError(res, status, err) {
    res.status(status).send({"error":err});
}

app.get('*', function (req, res) {
    sendError(res, 404, "Cannot get " + req.path);
})

var port = process.env.port || 8080;
app.listen(port, function () {
    console.log('Example app listening on port ' + port + ' !')
})