const express = require('express')
const bodyParser = require('body-parser')

const leaderRouter = express.Router()
leaderRouter.use(bodyParser.json())

/**Whit .route i can chain all methods at the same time and just need to inform to method
 * what is the endpoint for invoke the methods
 * 
/**when i use .route method, i can chain all http methods at same
 * for router, i can just put the endpoint and the method carrys all methods with it
 */

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    next() /**The next it will look for another functions after, the app.get */
})
.get((req, res, next) => {
    /**Generating a response with JSON */
    res.end('Will send all the leaders to you!')
})
.post((req, res, next) => {
    /**Extract an information from body */
    res.end(`Will add the leader: ${req.body.name} with details ${req.body.description}`)
})
.put((req, res, next) => {
    /**403 is a code for forbidden method http */
    res.statusCode = 403;
    res.end(`PUT operation not supported on /leaders`)
})
.delete((req, res, next) => {
    /**Deleting dishes */
    res.end('Deleting all leaders!')
})

/**leaderID */
leaderRouter.route('/:leadersId')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    next() /**The next it will look for another functions after, the app.get */
})
.get((req, res, next) => {
    /**Generating a response with JSON */
    res.end('Will send details of the leader! ' + req.params.leadersId + ' to you!')
})

.post((req, res, next) => {
    /**Doesn't makes sense do post at Id */
    res.statusCode = 403;
    res.end(`PUT operation not supported on /leaders/` + req.params.leadersId)
})

.put((req, res, next) => {
    res.write(`Updating the leader: ${req.params.leadersId}\n`)
    res.end(`Will update the leader: ${req.body.name} with details ${req.body.description}`)
})

.delete((req, res, next) => {
    /**Deleting leaders */
    res.end('Deleting leader: ' + req.params.leadersId)
})

/**Whit this, i export everything in this file */
module.exports = leaderRouter