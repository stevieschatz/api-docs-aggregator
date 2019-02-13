const url_mod      = require('url');
const fetch   = require('node-fetch')
const fs      = require('fs')
const env     = require('dotenv').config()
const api     = require('../lib/api.js')
const logger  = require('../logger/logger.js')
const log     = logger.logger

const protocol              = process.env.PROTOCOL || console.log('==== Protocol ENV VAR not set. ====')
const service_info          = process.env.SERVICEINFO || console.log('==== Services ENV VAR not set. ====')
const staging_base_path     = process.env.STAGINGBASEPATH || console.log('==== STAGINGBASEPATH ENV VAR not set. ====')
const swagger_json_path     = process.env.SWAGGERJSON || console.log('==== SWAGGERJSON ENV VAR not set. ====')
const mode                  = process.env.NODE_ENV || console.log('==== NODE ENV VAR not set. ====')
const prod_base_path        = process.env.PRODBASEPATH || console.log('==== NODE ENV VAR not set. ====')
const https_protocol        = process.env.HTTPSPROTOCOL || console.log('==== NODE ENV VAR not set. ====')


let __this = {}

/*
*  @param [ services ]
*
*  1. fetch gets each service_name and port
*  2. Checks swagger.json location: check_service_for_swagger()
*  3. Creates a promise_array
*
*/
__this.retrieve_service_data = (services) => {
    log.info('==== Checking Each Service for http Port  ====')
    let promise_array = []

    for(i = 0; i < services.length; i++) {
        let url = service_info + services[i]
         try {
           let promise = fetch(url, {method: 'GET', timeout: 50000}).then((res) => {
                if(res.status === 200){
                    return res.json()
                } else {
                    log.warn('==== Response from Consul [ service ] Documentation: ' + url + ' : Response Status #: ' + res.status + ' ====')
                }
             }).then((data) => {
                let service_port
                let service_name
                let returned_promise

                for (i = 0; i < data[0].ServiceTags.length; i++) {
                    if(data[0].ServiceTags[i] === 'swagger'){
                        service_port     = data ? data[0].ServicePort : log.warn('==== Error response data from Consul [ service ] ====')
                        service_name     = data ? data[0].ServiceName : log.warn('==== Error response data from Consul [ service ] ====')
                        returned_promise = __this.check_service_for_swagger(service_port, service_name)
                    }
                }
                return returned_promise
             })
             .catch((err) => {
                 log.error('==== Error when trying to resolve service documentation in fetch Promise. Error: ' + err + ' ====')
             })
             promise_array.push(promise)
         } catch(err) {
             log.error('==== Error when creating Fetch Promises. Error: ' + err + ' ====')
             continue
         }
     }

      return promise_array ? promise_array : log.warn('==== * Promise Array undefined * ====')

    }

/*
*   @param service_port  @param and service_name
*
*  1. fetch call to check if swagger.json exists
*  2. if exists @return promise data with url
*  3. if does not exists @return false
*/
__this.check_service_for_swagger = (service_port, service_name) => {
    log.info('==== check_service_for_swagger called ====')
        let url
        // *** make service talk internally by adding .service for prod ***
        if(mode === 'prod'){
            url = protocol + service_name + staging_base_path + ':' + service_port + swagger_json_path
            log.info("==== Production Internal Service Swagger URL Check " + url + " ====");
        } else {
            url = protocol + service_name + staging_base_path + ':' + service_port + swagger_json_path
            log.info("==== Staging Internal Service Swagger URL Check " + url + " ====");
        }
        try {
            let promise = fetch(url, {method: 'GET', timeout: 500000}).then((res) => {
                if(res.status === 200) {
                    return res.json()
                } else {
                    log.warn('==== Failed to Retrieve Service Documentation ** Endpoint:' + url + ' : Response Status #: ' + res.status + ' ====')
                    return false
                }
            }).then((res_body) => {
                let response_keys = Object.keys(res_body)
                let swagger_json_confirmed_flag = response_keys.includes('swagger')

                if(swagger_json_confirmed_flag){
                    let parsed_url = url_mod.parse(url, true)
                    let final_url
                    if(mode === 'prod'){
                        final_url = https_protocol + service_name + prod_base_path + parsed_url.pathname
                        log.info("==== Production Swagger URL Return " + final_url + " ====");
                    } else {
                        final_url = protocol + service_name + staging_base_path + ':' + service_port + swagger_json_path
                        log.info("==== Staging Swagger URL Return " + final_url + " ====");
                    }
                    log.info('==== Swagger Json confirmed at this endpoint: ' + final_url + ' ====')
                    return final_url
                } else {
                    log.warn('==== Failed to confirm response data is in fact a Swagger JSON.. Endpoint: ' + url + ' ====')
                    return false
                }
            }).catch((err) => {
                log.error('==== Error when trying to resolve service documentation in fetch Promise. Error: ' + err + ' ====')
                return false
            })

           return promise
       } catch(err) {
           log.error('==== Error when creating Fetch Promises. Error: ' + err + ' ====')
           return false
       }

}

__this.construct_config_from_promise_array = (promise_array) => {

    Promise.all(promise_array).then((data) => {
        let urls_with_key = {}
        let key

        data = data.filter(i => i != false && i != undefined)
        data.map((url) =>{

            if(mode === 'prod'){
                let num = url.search('TODO FIX')
                num     = num + 8
                key     = url.slice(8,num)
                urls_with_key[key] = url
            } else {
                let num = url.search('service')
                num     = num + 7
                key     = url.slice(7,num)
                urls_with_key[key] = url
            }
        })
        return write_config_file(urls_with_key)
    })
}

function write_config_file(services) {
    let config = {}
    config = JSON.stringify(services)

    if(!services) return log.info('==== no services available ====')
    try {
        fs.writeFile('./src/public/config.json', config, 'utf8', (err, data) => {
            if (err) log.error(err)
            log.info("==== Successfully Updated config.json ====")
            return true
        })
    } catch(err) {
        log.error('==== Error when creating Config... Error: ' + err + ' ====')
    }
}

module.exports = __this