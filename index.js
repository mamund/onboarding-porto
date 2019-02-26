/*****************************************
 * onboarding api for BigCo, Inc.
 * 2019-01 mamund
 *****************************************/
 
var express = require('express');
var app = express();
var onboarding = require('./onboarding');
var port = process.env.PORT || 8585;
 
app.use('/onboarding',onboarding);
app.listen(port, () => console.log(`onboarding svc listening on port ${port}!`));
