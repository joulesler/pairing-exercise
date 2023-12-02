const chai = require('chai');
const chaiHttp = require('chai-http');
const { server, app } = require('../bin/www');

const expect = chai.expect;
chai.use(chaiHttp);

describe('POST /account/transactions', () => {
    it('1. Single request should get the correct transactions', (done) => {
        chai.request(app)
            .post('/account/transactions')
            .send([{
                "FL_ACCOUNT": "12345",
                "FL_CURRENCY": "SGD",
                "FL_AMOUNT": 123.14
            }])
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body[0].FIN_ACCOUNT).to.equal('12345'); // Check if the response contains the correct userId
                done();
            });
    });
});


describe('POST /account/transactions', () => {
    it('2. Should return missing data due to Currency', (done) => {
        chai.request(app)
            .post('/account/transactions')
            .send([{
                "FL_ACCOUNT": "12345",
                "FL_AMOUNT": 123.14
            }])
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.status).to.equal('MISSING_DATA'); // Check if the response contains the correct userId
                expect(res.body.code).to.equal(1002); // Check if the response contains the correct userId
                done();
            });
    });
});


describe('POST /account/transactions', () => {
    it('3. Should return missing data due to account', (done) => {
        chai.request(app)
            .post('/account/transactions')
            .send([{
                "FL_ACCOUNT": "",
                "FL_CURRENCY": "SGD",
                "FL_AMOUNT": 123.14
            }])
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.status).to.equal('MISSING_DATA'); // Check if the response contains the correct userId
                expect(res.body.code).to.equal(1002); // Check if the response contains the correct userId
                done();
            });
    });
});


describe('POST /account/transactions', () => {
    it('4. Multiple request should get the correct transactions', (done) => {
        chai.request(app)
            .post('/account/transactions')
            .send([{
                "FL_ACCOUNT": "12345",
                "FL_CURRENCY": "SGD",
                "FL_AMOUNT": 123.14
            },{
                "FL_ACCOUNT": "123456",
                "FL_CURRENCY": "SGD",
                "FL_AMOUNT": 123.14
            }])
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body[0].FIN_ACCOUNT).to.equal('12345'); // Check if the response contains the correct userId
                done();
            });
    });
});

describe('POST /account/transactions', () => {
    it('5. Multiple currencies should get the correct transactions', (done) => {
        chai.request(app)
            .post('/account/transactions')
            .send([{
                "FL_ACCOUNT": "12345",
                "FL_CURRENCY": "SGD",
                "FL_AMOUNT": 123.14
            },{
                "FL_ACCOUNT": "12345",
                "FL_CURRENCY": "USD",
                "FL_AMOUNT": 123.14
            }])
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body[0].FIN_CURRENCY).to.equal('SGD'); // Check if the response contains the correct userId
                expect(res.body[1].FIN_CURRENCY).to.equal('USD'); // Check if the response contains the correct userId
                done();
            });
    });
});

after((done) => {
    server.close((err) => {
        if (err) {
            console.error('Error closing server:', err);
        } else {
            console.log('Server closed');
        }
        done();
    });
});
