const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();

const transactionModel = require('../models/transactions');
const forwarder = require('../controllers/forward');
const validate = require('../controllers/validate');

router.post('/transactions', async (req, res) => {
    const data = req.body;
    res.status(200)
    if (!req.body || !Array.isArray(req.body)) {
        return res.status(400).json({
            status: 'EMPTY_REQUEST',
            code: 1001
        });
    }

    const promises = req.body.map(entry => {
        if (!entry["FL_CURRENCY"] || !entry["FL_AMOUNT"] || !entry["FL_ACCOUNT"] ) {
            return Promise.reject({
                httpStatus: 400,
                status: 'MISSING_DATA',
                code: 1002
            });
        }

        const transformedRequest = new transactionModel.Account(entry["FL_CURRENCY"], entry["FL_AMOUNT"])
        console.debug("Transformed Request is: ", transformedRequest)
        return forwarder.sendData(
                transformedRequest, 
                entry["FL_ACCOUNT"], 
                forwarder.getSignature(transformedRequest)
        );
    })

    try {
        const responses = await Promise.all(promises);
        const responseBody = [];
 
        for (let i = 0; i < responses.length; i++) {
            const externalRes = responses[i]
            console.debug(externalRes)
            if (!externalRes["transactions"] || !externalRes["signature"] ||  !Array.isArray(externalRes["transactions"] )) {
                res.status(500).json({
                    status: 'DOWNSTREAM_ERROR',
                    code: 1003
                })
                return
            }

            if (process.env.VALIDATE_SIG ==='true' && !validate.validateSignature(externalRes["transactions"], externalRes["signature"])){
                res.status(500).json({
                    status: 'INVALID_SIGNATURE',
                    code: 1004
                })
                return
            }
            var responseTransaction

            if (externalRes["transactions"].length == 0){
                responseTransaction = new transactionModel.OutputTransactions(externalRes["accountId"], req.body[i]["FL_CURRENCY"])
            } else {
                responseTransaction = new transactionModel.OutputTransactions(externalRes["accountId"], externalRes["transactions"][0]["currency"] )
            }

            // Iterate though all the transactions in the list and combine the debit and credits
            externalRes["transactions"].forEach( transaction => {
                console.debug(transaction)
                // TODO: Deal with mis-matched currencies and accounts, create separate object
                if (transaction["currency"] != responseTransaction["FIN_CURRENCY"]){
                    return
                }
                if (transaction["type"] == 'Debit'){
                    responseTransaction.FIN_DEBIT += transaction["amount"]
                } else if (transaction["type"] == 'Credit'){
                    responseTransaction.FIN_CREDIT += transaction["amount"]
                }
            })
            responseBody.push(responseTransaction)
        } 
        res.status(200).json(
            responseBody
        )
    } catch(externalErr) {
        console.error(externalErr)
        if (externalErr.httpStatus){
            res.status(externalErr.httpStatus).json({
                status: externalErr.status,
                code:   externalErr.code
        }) }
        else {
            res.status(500).json({
                status: 'INTERNAL_ERROR',
                code:   1005
            })
        }          
    }
})

module.exports = router;