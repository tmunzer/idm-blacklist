var express = require('express');
var router = express.Router();

/*================================================================
 ROUTES
 ================================================================*/
/*================================================================
 LOGIN
 ================================================================*/
router.get('/', function (req, res, next) {
    if (req.session.token) res.redirect("/web-app/");
    else {
        var errorcode;
        if (req.query.errorcode) errorcode = req.query["errorcode"];
        res.render('login', {
            title: 'IDM lock out',
            errorcode: errorcode
        });
    }
});
router.post('/', function (req, res, next) {
    if (req.body.token) {
        req.session.token = req.body.token,
            res.redirect('/web-app/');
    } else res.redirect("/login");
});
router.get('/howto/', function (req, res, next) {
    res.render('howto', {
        title: 'Api Test Tool',
        clientID: devAccount.clientID,
        apiServers: apiServers
    });
});
router.get('/logout/', function (req, res, next) {
    req.session.destroy(function (err) {
        if (err) logger.error(err);
        else res.redirect('/login');
    });
});
router.get('/web-app', function (req, res, next) {
    if (req.session.token) res.render('web-app', { title: 'IDM lock out' });
    else res.redirect('/login');
})
module.exports = router;
