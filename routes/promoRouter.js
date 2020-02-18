const express = require('express')
const bodyParser = require('body-parser')

const Promo = require(`../models/promo`)

const authenticate = require('../authenticate')
const promoRouter = express.Router()
promoRouter.use(bodyParser.json())

/**Whit .route i can chain all methods at the same time and just need to inform to method
 * what is the endpoint for invoke the methods
 * 
/**when i use .route method, i can chain all http methods at same
 * for router, i can just put the endpoint and the method carrys all methods with it
 */

promoRouter.route('/')
    .get((req, res, next) => {
        /**Using the mongoose methods */
        Promo.find({})
            .then((promos) => {
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(promos) /**Returning into Json */
                /**These lines about error it works like this:
                 * if you get an error, this error going to the catch and this error going to be
                 * send to all application to informs that u got an error, an it will going to 
                 * now allow to the application to peform the remainder of the application
                 */
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        /**Extract an information from body */
        Promo.create(req.body)
            .then((promo) => {
                console.log(`Promotion Created`, promo)
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(promo) /**Returning into Json */
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        /**403 is a code for forbidden method http */
        res.statusCode = 403;
        res.end(`PUT operation not supported on /promotions`)
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        /**Deleting all promotions */
        Promo.remove({})
            .then((resp) => {
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(resp) /**Returning into Json */
            }, (err) => next(err))
            .catch((err) => next(err))
    })

/**promotionsID */
promoRouter.route('/:promoId')
    .get((req, res, next) => {
        /**Generating a response with JSON */
        Promo.findById(req.params.promoId)
            .then((promo) => {
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(promo) /**Returning into Json */
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        /**Doesn't makes sense do post at Id */
        res.statusCode = 403;
        res.end(`Post operation not supported on /promotions/` + req.params.promoId)
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        /**Updating a specify promotion with promoId */
        Promo.findByIdAndUpdate(req.params.promoId, {
                $set: req.body
            }, {
                new: true
            })
            .then((promo) => {
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(promo) /**Returning into Json */
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        /**Deleting an specifique dish */
        Promo.findByIdAndRemove(req.params.promoId)
            .then((resp) => {
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(resp) /**Returning into Json */
            }, (err) => next(err))
            .catch((err) => next(err)) })

/**Whit this, i export everything in this file */
module.exports = promoRouter