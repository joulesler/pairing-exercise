const fs = require('fs');
const crypto = require('crypto')

const dotenv = require('dotenv').config();
const pubKey = fs.readFileSync(process.env.PUB_KEY, 'utf8')

/**
 * 
 * @param {transactions message} payload 
 * @param {signature provided by other system} signature 
 * @returns 
 */
function validateSignature(payload, signature){
    var verf = crypto.createVerify('RSA-SHA256')
    verf.update(JSON.stringify(payload))
    return verf.verify(pubKey, signature, 'base64')
}

module.exports = {validateSignature}