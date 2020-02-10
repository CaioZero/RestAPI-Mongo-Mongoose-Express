const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Leader = require('../models/leader')

const leaderRouter = express.Router()
leaderRouter.use(bodyParser.json())

/**Whit .route i can chain all methods at the same time and just need to inform to method
 * what is the endpoint for invoke the methods
 * 
/**when i use .route method, i can chain all http methods at same
 * for router, i can just put the endpoint and the method carrys all methods with it
 */

leaderRouter.route('/')
    .get((req, res, next) => {
        /**Using the mongoose methods */
        Leader.find({})
            .then((leaders) => {
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(leaders) /**Returning into Json */
                /**These lines about error it works like this:
                 * if you get an error, this error going to the catch and this error going to be
                 * send to all application to informs that u got an error, an it will going to 
                 * now allow to the application to peform the remainder of the application
                 */
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post((req, res, next) => {
        /**Extract an information from body */
        Leader.create(req.body)
            .then((leader) => {
                console.log(`Leader Created`, leader)
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(leader) /**Returning into Json */
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put((req, res, next) => {
        /**403 is a code for forbidden method http */
        res.statusCode = 403;
        res.end(`PUT operation not supported on /leaders`)
    })
    .delete((req, res, next) => {
        /**Deleting all leaders*/
        Leader.remove({})
            .then((resp) => {
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(resp) /**Returning into Json */
            }, (err) => next(err))
            .catch((err) => next(err))
    })

/**For each Leader
LeaderId */
leaderRouter.route('/:leaderId')
    .get((req, res, next) => {
        /**Generating a response with JSON */
        Leader.findById(req.params.leaderId)
            .then((leader) => {
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(leader) /**Returning into Json */
            }, (err) => next(err))
            .catch((err) => next(err))
    })

    .post((req, res, next) => {
        /**Doesn't makes sense do post at Id */
        res.statusCode = 403;
        res.end(`POST operation not supported on /:leader ${req.params.dishId}`)
    })

    .put((req, res, next) => {
        /**Updating a specify dish with dishId */
        Leader.findByIdAndUpdate(req.params.leaderId, {
                $set: req.body
            }, {
                new: true
            })
            .then((leader) => {
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(leader) /**Returning into Json */
            }, (err) => next(err))
            .catch((err) => next(err))
    })

    .delete((req, res, next) => {
        /**Deleting an specifique dish */
        Leader.findByIdAndRemove(req.params.leaderId)
            .then((resp) => {
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(resp) /**Returning into Json */
            }, (err) => next(err))
            .catch((err) => next(err))
    })
/**Whit this, i export everything in this file */
module.exports = leaderRouter