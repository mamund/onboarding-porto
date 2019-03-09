/*****************************************
 * onboarding api for BigCo, Inc.
 * 2019-01 mamund
 *****************************************/
 
var express = require('express');
var app = express();
var onboarding = require('./onboarding');
var port = process.env.PORT || 8585;
 
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://mamund.auth0.com/.well-known/jwks.json"
    }),
    audience: 'http://example.com/porto-workshop',
    issuer: "https://mamund.auth0.com/",
    algorithms: ['RS256']
});

// app.use(jwtCheck);

app.use('/onboarding',onboarding);
app.listen(port, () => console.log(`onboarding svc listening on port ${port}!`));
