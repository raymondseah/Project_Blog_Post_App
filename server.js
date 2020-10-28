// =======================================
//              DEPENDENCIES
// =======================================
require('dotenv').config()
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')
const app = express();
const port = 5000;



// =======================================
//              CONTROLLERS
// =======================================
const storiesControllers = require('./controllers/storiesControllers')
const usersControllers = require('./controllers/usersControllers')

// =======================================
//              MONGOOSE
// =======================================
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
mongoose.set('useFindAndModify', false)

// =======================================
//              EJS
// =======================================
// sets template engine to use
app.set('view engine', 'ejs')


// =======================================
//           METHOD-OVERRIDE
// =======================================
// tells Express app to make use of the imported method-override library
app.use(methodOverride('_method'))

// =======================================
//             EXPRESS
// =======================================
// tells Express app where to find our static assets
app.use(express.static('public'))

// tells Express app to parse incoming form requests,
// and make it available in req.body
app.use(express.urlencoded({
    extended: true
  }))

// =======================================
//          EXPRESS SESSION
// =======================================
app.use(session({
  secret: process.env.SECRET_SESSION,
  name: "app_session",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 3600000 } // 3600000ms = 3600s = 60mins, cookie expires in an hour
}))

app.use(setUserVarMiddleware)
// =======================================
//              STORIES ROUTES
// =======================================

//info route
app.get('/info', storiesControllers.showInfo)

//index route
app.get('/stories', storiesControllers.listAllStories)

//new route
app.get('/stories/new', storiesControllers.newStories)

//show route
app.get('/stories/:id' , storiesControllers.selectedStories)

// create route
app.post('/stories', storiesControllers.createStories)

// edit route
app.get('/stories/:id/edit', storiesControllers.editStories)

// update route
app.patch('/stories/:id', storiesControllers.updateStories)

// delete route
app.delete('/stories/:id', storiesControllers.deleteStories)

// // route for info page
// app.get('/stories/info' , storiesControllers.showInfo)

// =======================================
//              USER ROUTES
// =======================================
// user registration form route
app.get('/users/register', guestOnlyMiddleware,usersControllers.showRegistrationForm)

// user registration
app.post('/users/register', guestOnlyMiddleware,usersControllers.register)

// user login form route
app.get('/users/login', guestOnlyMiddleware,usersControllers.showLoginForm)

// user login route
app.post('/users/login', guestOnlyMiddleware, usersControllers.login)

// =======================================
//          USER ONLY ROUTES
// =======================================
app.get('/users/dashboard',authenticatedOnlyMiddleware,usersControllers.dashboard)

// =======================================
//            LOGOUT ROUTES
// =======================================
// user logout
app.post('/users/logout', authenticatedOnlyMiddleware,usersControllers.logout)



// =======================================
//              LISTENER
// =======================================
mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(response => {
    // DB connected successfully
    console.log('DB connection successful')
    app.listen(port, () => {
      console.log(`App listening on port: ${port}`)
    })
  })

  .catch(err => {
    console.log(err)
  })

// =======================================
//             MIDDLEWARE
// =======================================
// this function ensure non-login users to only be able to go to the register and login page
function guestOnlyMiddleware(req, res, next) {
  // check if user if logged in,
  // if logged in, redirect back to dashboard
  if (req.session && req.session.user) {
    res.redirect('/users/dashboard')
    return
  }

  // for to be able to proceed to next lifecycle, ensure req pass on to controller
  next()
}

function authenticatedOnlyMiddleware(req, res, next) {
  if ( ! req.session || ! req.session.user ) {
    res.redirect('/users/login')
    return
  }

  next()
}


// this help to set the template of ejs header depending on whether user is a null or not
function setUserVarMiddleware(req, res, next) {
  // default user template var set to null

  res.locals.user = null

  // check if req.session.user is set,
  // if set, template user var will be set as well

  if (req.session && req.session.user) {
    res.locals.user = req.session.user

  }

  next()
}

