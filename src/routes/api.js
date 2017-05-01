var express = require('express');
var router = express.Router();
var Api = require("../bin/req");
/*================================================================
 ROUTES
 ================================================================*/
/*================================================================
 API
 ================================================================*/
router.get('/blacklist', function (req, res, next) {
    if (req.session.token)
        Api.GET(req.session.token, "clients/blacklist", function (err, blacklist) {
            if (err) res.status(500).json(err);
            else res.json(blacklist);
        })
    else res.status(401).json("no session");
});
router.delete('/blacklist', function (req, res, next) {
    if (req.session.token)
        if (req.query.clientMacs) {
            if (typeof req.query.clientMacs == "string")
                Api.DELETE(req.session.token, "clients/blacklist?clientMacs=" + req.query.clientMacs, function (err, blacklist) {
                    if (err) res.status(500).json(err);
                    else res.json(blacklist);
                })
        } else res.status(500).json("no MAC Address");
    else res.status(401).json("no session");
});

module.exports = router;
