var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser');
var component = require('./simple-component');

var ejs = require('ejs');
var jsonView = '<%= body %>';

// set up request body parsing
router.use(bodyParser.json({type:[
    "application/json",
    "application/vnd.hal+json",
    "application/vnd.siren+json",
    "application/vnd.collection+json"
    ]}));
router.use(bodyParser.urlencoded({extended:true}));

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// config customer object
//var props = ['id','name','email','status','dateUpdated','dateCreated'];
var props = [
  'id',
  'dateCreated',
  'dateUpdated',
  'companyId',
  'companyName',
  'streetAddress',
  'city',
  'stateProvince',
  'postalCode',
  'country',
  'telephone',
  'email',
  'companyStatus',
  'accountId',
  'division',
  'spendingLimit',
  'discountPercentage',
  'accountStatus',
  'activityId',
  'activityType',
  'dateScheduled',
  'notes',
  'activityStatus',
  'dateUpdated'
]
var reqd = ['status'];

/*
status MUST be one of:
- pending
- active
- suspended
- closed
*/

/***************************************
 * handle request events
 ***************************************/
// home
router.get('/', function (req, res) {
  res.send('{"home" : {"name":"onboarding", "rel" : "collection", "href":"/onboarding/list/"}}\n');
})

// create
router.post('/', function(req,res) {
  processPost(req,res).then(function(body) {
    res.send('{"onboarding" : ' + JSON.stringify(body,null,2) + '}\n');
  }).catch(function(err) {
    res.send('{"error" : ' + JSON.stringify(err,null,2) + '}\n');
  });
});

// list
router.get('/list/', function(req, res) {
  processList(req,res).then(function(body) {
    res.send('{"onboarding":' + JSON.stringify(body,null,2) + '}\n');
  }).catch(function(err) {
    res.send('{"error" : ' + JSON.stringify(err,null,2) + '}\n');
  });
});

// filter
router.get('/filter/', function(req, res) {
  processFilter(req,res).then(function(body){
    res.send('{"onboarding":' + JSON.stringify(body,null,2) + '}\n');
  }).catch(function(err) {
    res.send('{"error" : ' + JSON.stringify(err,null,2) + '}\n');
  });
});

// read
router.get('/:onboardingId', function(req, res) {
  processItem(req,res).then(function(body){
    res.send('{"onboarding":' + JSON.stringify(body,null,2) + '}\n');
  }).catch(function(err) {
    res.send('{"error" : ' + JSON.stringify(err,null,2) + '}\n');
  });
});

// update
router.put('/:onboardingId', function(req, res) {
  processUpdate(req,res).then(function(body){
    res.send('{"onboarding":' + JSON.stringify(body,null,2) + '}\n');
  }).catch(function(err) {
    res.send('{"error" : ' + JSON.stringify(err,null,2) + '}\n');
  });
});

// delete
router.delete('/:onboardingId', function(req, res) {
  processDelete(req,res).then(function(body){
    res.send('{"onboarding":' + JSON.stringify(body,null,2) + '}\n');
  }).catch(function(err) {
    res.send('{"error" : ' + JSON.stringify(err,null,2) + '}\n');
  });
});

module.exports = router

/****************************************
 * handle processing of request/responses
 ****************************************/

function processPost(req,res) {
  return new Promise(function(resolve,reject) {
    if(req.body) {
     var body = req.body;
     resolve(component({name:'onboarding',action:'add',item:body,props:props,reqd:reqd}));
    }
    else {
      reject({error:"invalid body"});
    }
  });
};

function processList(req,res) {
  return new Promise(function(resolve,reject) {
    resolve(component({name:'onboarding',action:'list'}));
  });
}

function processFilter(req,res) {
  return new Promise(function(resolve,reject){
    if(req.query && req.query.length!==0) {
      resolve(component({name:'onboarding',action:'filter',filter:req.query}));
    }
    else {
      reject({error:"invalid query string"});
    }
  })
}

function processItem(req,res) {
  return new Promise(function(resolve,reject){
    if(req.params.onboardingId && req.params.onboardingId!==null) {
      var id = req.params.onboardingId;
      resolve(component({name:'onboarding',action:'item',id:id}));
    } 
    else {
      reject({error:"missing id"});
    }
  });
}

function processUpdate(req,res) {
  var id,body;
  return new Promise(function(resolve,reject){
    id = req.params.onboardingId||null;
    body = req.body||null;
    if(id!==null && body!==null) {
       resolve(component(
         {name:'onboarding',
          action:'update',
          id:id,
          item:body,
          props:props,
          reqd:reqd}));
     }
     else {
       reject({error:"missing id and/or body"});
     }
  });
}

function processDelete(req,res) {
  return new Promise(function(resolve,reject){
    if(req.params.onboardingId && req.params.onboardingId!==null) {
      var id = req.params.onboardingId;
      resolve(component({name:'onboarding',action:'delete', id:id}));
    }
    else {
      reject({error:"invalid id"});
    }
  });
}
