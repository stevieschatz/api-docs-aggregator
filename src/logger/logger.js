const gelfStream = require('gelf-stream')
const bunyan     = require('bunyan')
const env        = require('dotenv').config()
const service = process.env.SWAGGERLOCATION || console.log('==== SWAGGERLOCATION ENV VAR not set. ====')
const port    = process.env.GREYLOGPORT     || console.log('==== GREYLOG ENV VAR not set. ====')
const node_env_set_to_test = process.env.NODE_ENV  || console.log('==== NODE_ENV not set. ====')
let __this = {}

let graylog = gelfStream.forBunyan(service)

__this.logger = bunyan.createLogger({
    name: 'api-docs',
    streams: [{
        stream: process.stdout,
        level: 'info'
    }]
})

if(node_env_set_to_test === "test") {
    __this.logger.level(bunyan.FATAL + 1);
}

// GELF stream has to be explicitly ended
process.on('exit', function () {
    console.error('Exiting...')
    graylog.end()
})

module.exports = __this
