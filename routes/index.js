const { randomUUID } = require('crypto');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pairing Exercise' });
});

router.post('/api/:account', function(req, res, next) {
  console.log(req.body)
  res.status(200).json({
    "accountId": req.params.account,
    "transactions": [
      {
        "id": randomUUID().toString(), 
        "currency": req.body["account"]["currency"],
        "amount": Math.random()*100,
        "type": "Debit"
      },
      {
        "id": randomUUID().toString(), 
        "currency": req.body["account"]["currency"],
        "amount": Math.random()*100,
        "type": "Credit"
      },
      {
        "id": randomUUID().toString(), 
        "currency": req.body["account"]["currency"],
        "amount": Math.random()*100,
        "type": "Credit"
      },
      {
        "id": randomUUID().toString(), 
        "currency": req.body["account"]["currency"],
        "amount": Math.random()*100,
        "type": "Credit"
      }
    ],
    "signature": randomUUID().toString()
  })
});


module.exports = router;
