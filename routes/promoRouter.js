const express = require('express')
const bodyParser = require('body-parser')

const promoRouter = express.Router()
promoRouter.use(bodyParser.json())

/**Whit .route i can chain all methods at the same time and just need to inform to method
 * what is the endpoint for invoke the methods
 * 
/**when i use .route method, i can chain all http methods at same
 * for router, i can just put the endpoint and the method carrys all methods with it
 */

promoRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    next() /**The next it will look for another functions after, the app.get */
})
.get((req, res, next) => {
    /**Generating a response with JSON */
    res.end('Will send all the promotions to you!')
})
.post((req, res, next) => {
    /**Extract an information from body */
    res.end(`Will add the promotion: ${req.body.name} with details ${req.body.description}`)
})
.put((req, res, next) => {
    /**403 is a code for forbidden method http */
    res.statusCode = 403;
    res.end(`PUT operation not supported on /promotions`)
})
.delete((req, res, next) => {
    /**Deleting dishes */
    res.end('Deleting all promotions!')
})

/**promotionsID */
promoRouter.route('/:promoId')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    next() /**The next it will look for another functions after, the app.get */
})
.get((req, res, next) => {
    /**Generating a response with JSON */
    res.end('Will send details of the promotion! ' + req.params.promoId + ' to you!')
})
.post((req, res, next) => {
    /**Doesn't makes sense do post at Id */
    res.statusCode = 403;
    res.end(`PUT operation not supported on /promotions/` + req.params.promoId)
})
.put((req, res, next) => {
    res.write(`Updating the promotion: ${req.params.promoId}\n`)
    res.end(`Will update the promotion: ${req.body.name} with details ${req.body.description}`)
})
.delete((req, res, next) => {
    /**Deleting dishes */
    res.end('Deleting promotion: ' + req.params.promoId)
})

/**Whit this, i export everything in this file */
module.exports = promoRouter