class Account {
    constructor(_currency, _amount){
        this.account = {
            currency : _currency,
            amount : _amount
        }
    }
}

class OutputTransactions {
    constructor(_account, _currency, _debit=0, _credit=0){
        this.FIN_ACCOUNT = _account;
        this.FIN_CURRENCY = _currency;
        this.FIN_DEBIT = _debit;
        this.FIN_CREDIT = _credit;
    }
}

module.exports = {
    Account,
    OutputTransactions
}