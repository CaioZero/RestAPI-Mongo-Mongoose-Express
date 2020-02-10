const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');


const Dishes = require(`../models/dishes`) /**Two pointo to back the folders */


const dishRouter = express.Router()
dishRouter.use(bodyParser.json())

/**Whit .route i can chain all methods at the same time and just need to inform to method
 * what is the endpoint for invoke the methods
 * 
/**when i use .route method, i can chain all http methods at same
 * for router, i can just put the endpoint and the method carrys all methods with it
 */

dishRouter.route('/')
    .get((req, res, next) => {
        /**Using the mongoose methods */
        Dishes.find({})
            .then((dishes) => {
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(dishes) /**Returning into Json */
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
        Dishes.create(req.body)
            .then((dish) => {
                console.log(`Dish Created`, dish)
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(dish) /**Returning into Json */
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put((req, res, next) => {
        /**403 is a code for forbidden method http */
        res.statusCode = 403;
        res.end(`PUT operation not supported on /dishes`)
    })
    .delete((req, res, next) => {
        /**Deleting all dishes */
        Dishes.remove({})
            .then((resp) => {
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(resp) /**Returning into Json */
            }, (err) => next(err))
            .catch((err) => next(err))
    })

/**For each Dish
 * dishID */
dishRouter.route('/:dishId')
    .get((req, res, next) => {
        /**Generating a response with JSON */
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(dish) /**Returning into Json */
            }, (err) => next(err))
            .catch((err) => next(err))
    })

    .post((req, res, next) => {
        /**Doesn't makes sense do post at Id */
        res.statusCode = 403;
        res.end(`PUT operation not supported on /:dishes ${req.params.dishId}`)
    })

    .put((req, res, next) => {
        /**Updating a specify dish with dishId */
        Dishes.findByIdAndUpdate(req.params.dishId, {
                $set: req.body
            }, {
                new: true
            })
            .then((dish) => {
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(dish) /**Returning into Json */
            }, (err) => next(err))
            .catch((err) => next(err))
    })

    .delete((req, res, next) => {
        /**Deleting an specifique dish */
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(resp) /**Returning into Json */
            }, (err) => next(err))
            .catch((err) => next(err))
    })
/**Whit this, i export everything in this file */
module.exports = dishRouter