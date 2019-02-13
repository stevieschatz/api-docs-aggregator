const Koa    = require('koa')
const Router = require('koa-router')
const path   = require('path')
const views  = require('koa-views')
const koa_logger = require('koa-logger')
const env    = require('dotenv').config()
const send   = require('koa-send')
const serve  = require('koa-static');
const api    = require('./lib/api.js')
const logger = require('./logger/logger.js')
const log    = logger.logger

const app    = new Koa()
const router = new Router()

const port   = process.env.PORT || 4200
const node_env_set_to_test = process.env.NODE_ENV  || console.log('==== NODE_ENV not set. ====')

let __this   = {}

app.use(serve(__dirname + '/public'));

if(node_env_set_to_test !== 'test') {
    app.use(koa_logger())
}

router.get('/healthCheck', (ctx) => {
    log.info('==== HealthCheck end point hit ====')
    ctx.response.body = 200;
})

router.get('/write', api.update)

router.get('/index', async (ctx) => {
    await send(ctx, 'src/public/index.html')
})

__this = app.listen(port, () => {
    log.info('=== Listening on port: :'+ port + ' ===')
})

app.use(router.routes())

process.on('SIGINT', () => {
    log.info('SIGINT received')
    process.exit
    log.info('server closed. exit process ...')
})

process.on('uncaughtException', (err) => {
    log.error('Fatal error. process will be terminated:', err)
    process.exit(1)
})

process.on('unhandledRejection', (reason, p) => {
    log.error('Unhandled Rejection at:', p, 'reason:', reason)
    throw reason
});

process.on('warning', (warning) => {
    log.warn(warning.name)
    log.warn(warning.message)
    log.warn(warning.stack)
});

module.exports = __this