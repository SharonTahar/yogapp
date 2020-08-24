const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const pws = require('p4ssw0rd');
const cors = require('cors');
const DB = require('./modules/db');
const { response } = require('express');
const { getAllPoses } = require('./modules/db');
const { myFavorites } = require('./modules/db');

// const morgan = require('morgan');
// const User = require('./model/user');

// invoke an instance of express application.
const app = express();

app.use('/', express.static(__dirname+'/public'));

// // set our application port
// app.set('port', 9899);

// set morgan to log info about our requests for development use.
// app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters
// requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// initialize cookie-parser to allow us access
// the cookies stored in the browser.
app.use(cookieParser());

// initialize express-session to allow us track
// the logged-in user across sessions.
app.use(
  session({
    key: 'user_sid',
    secret: 'some_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
  })
);


// This middleware will check if user's cookie is still saved
// in browser and user is not set, then automatically log
// the user out.
// This usually happens when you stop your express server
// after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});


// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
      res.redirect('/dashboard');
  } else {
      next();
  }
};

// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

// route for user signup
app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/signup.html');
    })
    .post((req, res) => {
        console.log('signup:', req.body);
        DB.createUser(req.body)
        .then(user => {
            req.session.user = user[0];
            res.redirect('/dashboard');
        })
        .catch(error => {
            console.log(error);
            res.redirect('/signup');
        });
    });


// route for user Login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    })
    .post((req, res) => {
        const {email, password} = req.body;
        DB.findUser(email)
        .then( user => {
            if (!user) {
                res.redirect('/signup');
            } else if (!pws.check(password,user[0].password, 10)) {
                res.redirect('/login');
            } else {
                req.session.user = user[0];
                res.redirect('/dashboard');
            }
        })
        .catch(error => {
          res.redirect('/login');
        });
    });


// route for user's dashboard 
app.route('/dashboard')
  .get( (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/dashboard.html');
    } else {
        res.redirect('/login');
    }
  })
  .post( (req, res) => {

  });

  //route to favorites page 
  app.route('/favorites')
  .get( (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/favorites.html');
    } else {
        res.redirect('/login');
    }
  })
  .post( (req, res) => {

  });


// showcase all favorite on the dashboard, otherwise sends to login
app.get('/myFavorites/', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        // console.log(req.session.user.id);
        // console.log('myFavorites => ', req.params);
      DB.myFavorites(req.session.user.id, req.params.id)
      .then (data => {
          res.send(data)
      })
      .catch(err =>{
          res.send({message: err});
      })
    } else {
        res.redirect('/login');
    }
  });
  
// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

app.get('/saveFavorites/:id', (req,res) => {
    if (req.session.user && req.cookies.user_sid) {
        const {id} = req.params
        console.log('server:', id, req.session.user.id);
        DB.sFavorites(req.session.user.id, req.params.id)
        .then (data => {
            console.log('sfavorites:', data);
            res.send(data)
        })
        .catch(err =>{
            console.log('err:', err);
            res.send({message: err});
        })
    } else {
        res.redirect('/login');
    }
    // DB.myFavorites()s
    // .then (mydata => {
    //     console.log(mydata);
    //     res.send(mydata);
    // })
    // .catch(err => {
    //     res.send({message: err});
    // })
});

//showcase all poses on the dashboard, otherwise sends to login
app.get('/getAllPoses', (req, res) => {
//   if (req.session.user && req.cookies.user_sid) {
    //   console.log(req.session.user.id);
    //   console.log(req.cookies);
    // myFavorites(req.session.user.id)
    DB.getAllPoses(req.session.user.id)
    .then (data => {
        console.log(data);
        res.send(data)
    })
    .catch(err =>{
        res.send({message: err});
    })
//   } else {
//       res.redirect('/login');
//   }
});


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
  });
  

// start the express server
app.listen(6102)
