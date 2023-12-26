const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

/* maybe for later idk

// Your "database" of users for this example
// Configure passport.js to use a local strategy
passport.use(new LocalStrategy(
const users = [{ id: 1, username: 'test', password: 'password' }];
    (username, password, done) => {
        let user = users.find(user => user.username === username && user.password === password);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect username or password' });
        }
    }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    let user = users.find(user => user.id === id);
    if (user) {
        done(null, user);
    } else {
        done(new Error('User not found'), null);
    }
});
*/

// Express and Passport Session
app.use(session({secret:randtoken(), resave: false, saveUninitialized: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

function randtoken(){
	let min = 25235341 + 32425356;
	const token = Math.floor(Math.random()*min);
	return btoa(token.toString());
}

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

app.get('/',(req,res) => {
	if(!req.session.logged_in){
		res.render("dashboard_home")
}
	else{
		res.render("dashboard_auth");
}
})

app.post('/auth',(req,res) => {
  const { username, password } = req.body;
  if ((password === 'toor' && username === 'admin') || (password === 'ok' && username === 'ok')){
    req.session.logged_in = true;
    res.render('dashboard_auth');
  } else {
    res.render('fail');
  }
});

app.get("/login",(req,res) => {
    res.render("login")
});


app.get('/dashboard_auth', (req, res) => {
    if (!req.session.logged_in) {
      res.redirect('/login');
    } else {
      res.render('dashboard'); // Ensure this is the name of your user dashboard file
    }
  });


app.get("/home",(req,res) => {
  res.render("home");
})

app.get('/logout',(req,res) => {
  req.session.logged_in = false;
  res.redirect("/")
});

// Define routes for the course pages
app.get('/physics', (req, res) => {
    res.render('physics');
});

app.get('/chemistry', (req, res) => {
    res.render('chemistry')
});

app.get('/math',(req, res) => {
    res.render('math');
});
// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});