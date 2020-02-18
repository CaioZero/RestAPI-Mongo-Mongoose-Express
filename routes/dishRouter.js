const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

/**Import authenticate js file for GET operations for any user */
const authenticate = require('../authenticate')

const Dishes = require(`../models/dishes`) /**Two points to back the folders */

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
    /**For POST, you will need authentication */
    .post(authenticate.verifyUser,(req, res, next) => {
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
    /**For PUT, you will need authentication */
    .put(authenticate.verifyUser,(req, res, next) => {
        /**403 is a code for forbidden method http */
        res.statusCode = 403;
        res.end(`PUT operation not supported on /dishes`)
    })
       /**For DELETE, you will need authentication */
    .delete(authenticate.verifyUser,(req, res, next) => {
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
    /**For POST, you will need authentication */
    .post(authenticate.verifyUser,(req, res, next) => {
        /**Doesn't makes sense do post at Id */
        res.statusCode = 403;
        res.end(`POST operation not supported on /:dishes ${req.params.dishId}`)
    })
    /**For PUT, you will need authentication */
    .put(authenticate.verifyUser,(req, res, next) => {
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
       /**For DELETE, you will need authentication */
    .delete(authenticate.verifyUser,(req, res, next) => {
        /**Deleting an specifique dish */
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200 /**Inform a http request that it`s all ok */
                res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                res.json(resp) /**Returning into Json */
            }, (err) => next(err))
            .catch((err) => next(err))
    })

/**For the comments into each dishId */
dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        /**Using the mongoose methods */
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                /**If the dish exists */
                if (dish) {
                    res.statusCode = 200 /**Inform a http request that it`s all ok */
                    res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                    res.json(dish.comments) /**Returning into Json */
                    /**These lines about error it works like this:
                     * if you get an error, this error going to the catch and this error going to be
                     * send to all application to informs that u got an error, an it will going to 
                     * now allow to the application to peform the remainder of the application
                     */
                } else {
                    /**If the dish doesn't exists */
                    err = new Error(`Dish ${req.params.dishId} not found`)
                    err.status = 404
                    /*This return goes to app.js to return into the render error page to informe that
                    you got an error with the dish */
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
           /**For POST, you will need authentication */
    .post(authenticate.verifyUser,(req, res, next) => {
        /**Extract an information from body */
        /**Using the mongoose methods */
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                /**If the dish exists */
                if (dish) {
                    /**Push the information to the body of the object */
                    dish.comments.push(req.body)
                    /**Saving the comment */
                    dish.save()
                        /**And the after save, we return the updated dish to user  */
                        .then((dish) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(dish)
                        }, (err) => next(err))

                } else {
                    /**If the dish doesn't exists */
                    err = new Error(`Dish ${req.params.dishId} not found`)
                    err.status = 404
                    /*This return goes to app.js to return into the render error page to informe that
                    you got an error with the dish */
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    /**For PUT, you will need authentication */
    .put(authenticate.verifyUser,(req, res, next) => {
        /**403 is a code for forbidden method http */
        res.statusCode = 403;
        res.end(`PUT operation not supported on /dishes/${req.params.dishId}/comments`)
    })
    /**For DELETE, you will need authentication */
    .delete(authenticate.verifyUser,(req, res, next) => {
        /**Deleting all dishes */
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                /**If the dish exists */
                if (dish) {
                    /**Do a for to delete each comment one by one looking into array of comments*/
                    for (var i = (dish.comments.length - 1); i >= 0; i--) {
                        dish.comments.id(dish.comments[i]._id).remove()
                    }
                    /**Saving the deleted */
                    dish.save()
                        /**And the after save, we return the updated dish to user  */
                        .then((dish) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(dish)
                        }, (err) => next(err))
                } else {
                    /**If the dish doesn't exists */
                    err = new Error(`Dish ${req.params.dishId} not found`)
                    err.status = 404
                    /*This return goes to app.js to return into the render error page to informe that
                    you got an error with the dish */
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })

/**For each Comment
 * CommentID */
dishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        /**Generating a response with JSON */
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                /**Check if the dish exists and the comment isn't null */
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200 /**Inform a http request that it`s all ok */
                    res.setHeader(`Content-type`, `application/json`) /**The type of the object */
                    res.json(dish.comments.id(req.params.commentId)) /**Returning into Json */
                    /**These lines about error it works like this:
                     * if you get an error, this error going to the catch and this error going to be
                     * send to all application to informs that u got an error, an it will going to 
                     * now allow to the application to peform the remainder of the application
                     */
                } else if (!dish) {
                    /**If the dish doesn't exists */
                    err = new Error(`Dish ${req.params.dishId} not found`)
                    err.status = 404
                    /*This return goes to app.js to return into the render error page to informe that
                    you got an error with the dish */
                    return next(err)
                } else {
                    /**If the comment doesn't exists */
                    err = new Error(`Comment ${req.params.commentId} not found`)
                    err.status = 404
                    /*This return goes to app.js to return into the render error page to informe that
                    you got an error with the dish */
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })

    .post(authenticate.verifyUser,(req, res, next) => {
        /**Doesn't makes sense do post at Id */
        res.statusCode = 403;
        res.end(`POST operation not supported on /dishes/${req.params.dishId}/comments/${req.params.commentId}`)
    })

    .put(authenticate.verifyUser,(req, res, next) => {
        /**Updating a specify dish with dishId */
        /**Generating a response with JSON */
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                /**Check if the dish exists and the comment isn't null */
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    /**Updating a rating */
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating
                    }
                    /**Updating comment */
                    if (req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.body.comment
                    }

                    /**Saving the comment */
                    dish.save()
                        /**And the after save, we return the updated dish to user  */
                        .then((dish) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(dish)
                        }, (err) => next(err))
                } else if (!dish) {
                    /**If the dish doesn't exists */
                    err = new Error(`Dish ${req.params.dishId} not found`)
                    err.status = 404
                    /*This return goes to app.js to return into the render error page to informe that
                    you got an error with the dish */
                    return next(err)
                } else {
                    /**If the comment doesn't exists */
                    err = new Error(`Comment ${req.params.commentId} not found`)
                    err.status = 404
                    /*This return goes to app.js to return into the render error page to informe that
                    you got an error with the dish */
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })

    .delete(authenticate.verifyUser,(req, res, next) => {
        /**Deleting a specifique comment */
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                /**If the dish exists */
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    /**Do a for to delete a specifique comment*/
                    dish.comments.id(req.params.commentId).remove()

                    /**Saving the deleted */
                    dish.save()
                        /**And the after save, we return the updated dish to user  */
                        .then((dish) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(dish)
                        }, (err) => next(err))
                } else if (!dish) {
                    /**If the dish doesn't exists */
                    err = new Error(`Dish ${req.params.dishId} not found`)
                    err.status = 404
                    /*This return goes to app.js to return into the render error page to informe that
                    you got an error with the dish */
                    return next(err)
                } else {
                    /**If the comment doesn't exists */
                    err = new Error(`Comment ${req.params.commentId} not found`)
                    err.status = 404
                    /*This return goes to app.js to return into the render error page to informe that
                    you got an error with the dish */
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
/**Whit this, i export everything in this file */
module.exports = dishRouter