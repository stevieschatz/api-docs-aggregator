const chai     = require('chai')
const chaiHttp = require('chai-http')
const chaiUrl  = require('chai-url')
const expect   = chai.expect
const should   = chai.should()
const server   = require('../src/app')
const chaiAsPromised = require('chai-as-promised')
const api      = require('../src/lib/api')
const script   = require('../src/scripts/write_config_controller.js')

chai.use(chaiUrl);
chai.use(chaiAsPromised).should();
chai.use(chaiHttp);

const services_promise =  new Promise( async (resolve) => {
    let services = await api.get_all_services()
    resolve(services)
})

describe('Api get_all_services', () => {
    it('Services array should be populated', async () => {
        let services = await services_promise
        expect(services).to.be.an('array').to.be.not.empty
    })
})

describe('Script check_service_with_port', () => {
    it('Returns url where /api-docs/swagger.json exists', async () => {
        let promise = await script.check_service_with_port(80, 'TODO FIX')
        expect(promise).to.have.path('/api-docs/swagger.json')
        expect(promise).to.have.hostname('TODO FIX')
    })
})

describe('Script retrieve_http_port', () => {
    it('Promise array should be populated', async () => {
        let services = await api.get_all_services()
        let promise_array = await script.retrieve_http_port(services)
        expect(promise_array).to.be.an('array').to.be.not.empty

    })
})

describe('GET /index Endpoint', () => {
    it('Should return all resources', done => {
    const agent = chai.request.agent(server)
       agent.get('/index').end((err, res) => {
                should.not.exist(err)
                res.status.should.eql(200)
                res.type.should.eql('text/html');
                done()
            })
    })
})

describe('GET /healthCheck Endpoint', () => {
    it('Should return status code 200', done => {
    const agent = chai.request.agent(server)
       agent.get('/healthCheck').end((err, res) => {
                should.not.exist(err)
                res.status.should.eql(200)
                done()
            })
    })
})

describe('GET /write Endpoint', () => {
    const agent = chai.request.agent(server)
    it('Should return status code 200', done => {
        agent
        .get('/write')
        .then((res) => {
            res.status.should.eql(200)
        }).then(done, done)
    })
})


