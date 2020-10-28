const uuid = require('uuid')
const SHA256 = require("crypto-js/sha256")
const bcrypt = require('bcrypt')
const usersModel = require('./../models/usersModels')
const StoriesModel = require('../models/storiesModels')

const controllers = {
    showRegistrationForm: (req, res) => {
        res.render('users/register', {
            pageTitle: 'Register as a User'
        })
    },

    showLoginForm: (req, res) => {
        res.render('users/login', {
            pageTitle: 'User Login'
        })
    },

    register: (req, res) => {
        // validate the users input
        // not implemented yet, try on your own
        usersModel.findOne({
            email: req.body.email
        })
            .then(result => {
                // if found in DB, means email has already been take, redirect to registration page
                // if result is returned , this means the email is already in DB and thus taken
                if (result) {
                    res.redirect('/users/register')
                    return
                }
                // no document found in DB, can proceed with registration
                // generate uuid as salt
                const salt = uuid.v4()
                //conbine actual PW with generated salt
                const combination = salt + req.body.password
                // hash the combination by passing through SHA256
                const hash = SHA256(combination).toString()
                // create user in DB
                usersModel.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    pwsalt: salt,
                    hash: hash
                })
                    .then(createResult => {
                        res.redirect('/stories')
                    })
                    .catch(err => {
                        res.redirect('/users/register')
                    })

            })
            .catch(err => {
                console.log(err)
                res.redirect('/users/register')
            })
    },
    login: (req, res) => {

        // validate input here on your own

          // gets user with the given email
        usersModel.findOne({
            email: req.body.email
        })
            .then(result => {

                // check if result is empty, if it is, no user, so login fail, redirect to login page
                if (!result) {
                    res.redirect('/users/login')
                    return
                }

                // combine DB user salt with given password, and apply hash algo
                const hash = SHA256(result.pwsalt + req.body.password).toString()

                // check if password is correct by comparing hashes
                if (hash !== result.hash) {
                    res.redirect('/users/login')
                    return
                }

                // login successful

                // set session user
                req.session.user = result
                console.log(req.session)

                
                // res.redirect('/products') instead of product redirect to dash board
                res.redirect('/users/dashboard')
            })
            .catch(err => {
                console.log(err)
                res.redirect('/user/login')
            })

    },
    dashboard: (req,res) => {

        // if session or session user is not define send back to login
        if (! req.session || ! req.session.user) {
            res.redirect('/users/login')
        }

        StoriesModel.find({
            created_by : req.session.user._id
        })

            .then(result => {
                res.render('users/dashboard', {
                    pageTitle: 'User Dashboard',
                    data: result
                })
            })

            .catch(err => {
                console.log(err)
                res.redirect('/stories')
            })



    },

    logout: (req,res) => {
        req.session.destroy()
        res.redirect('/users/login')
    }

}

module.exports = controllers