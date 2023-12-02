const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto')

const dotenv = require('dotenv').config();
const endpoint = process.env.ENDPOINT
const priKey = fs.readFileSync(process.env.PRI_KEY, 'utf8')
const pubKey = fs.readFileSync(process.env.PUB_KEY, 'utf8')


/**
 * 
 * @param {Unhashed input body to be hashed to message digest and signed} payload 
 */
function getSignature(payload){
    var sign = crypto.createSign('RSA-SHA256')
    sign.update(JSON.stringify(payload))
    return sign.sign(priKey, 'base64')
}


/**
 * 
 * @param {Outbound data to send, to receive transactions} transformedData 
 * @param {original fin account} account 
 * @param {RSA-SHA256 signature for verification} signature 
 * @returns Promise of response data
 */
function sendData(transformedData, account, signature) {
    var uri = endpoint + "/" + account + "?" + "signature=" + signature
    console.info("Parsed request is: ", uri, transformedData)
    return new Promise((res, err) => {
        setTimeout(() => {
            axios.post(
                uri,
                transformedData
            ).then(resp => {
                res(resp.data)
            }).catch(error => {
                err(error)
            })
        })
        // Timeout ms
        ,500
    })
}

module.exports = {
    sendData,
    getSignature
}