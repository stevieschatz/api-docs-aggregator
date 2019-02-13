const request = require('request')
const env     = require('dotenv').config()
const swagger_endpoint = process.env.SERVICES || console.log('==== Services ENV VAR not set. ====')
const script = require('../scripts/write_config_controller.js')
const logger = require('../logger/logger.js')
const log    = logger.logger

let __this = {}


__this.get_all_services = async () => {
    return new Promise( (resolve, reject) => request(swagger_endpoint, (err, res, body) => {
        log.info('==== Response from consul services Response Status Code: ' + JSON.stringify(res.statusCode) + ' ====')
        if(err){ return reject(err)}
        body = JSON.parse(body)
        body = Object.keys(body)
        resolve(body)
    }))
}

__this.update = async (ctx) => {
    try {
        let services = await __this.get_all_services()
        let promise_array = services ? script.retrieve_service_data(services) : ctx.throw()
        promise_array ? script.construct_config_from_promise_array(promise_array) : log.warn('==== * Promise Array undefined * ====')
        ctx.response.body = 200
    } catch(err) {
        log.error('==== Error /write ==== Error:' + err)
        ctx.throw(500, '=== Error /write ===' )
    }
}


module.exports = __this