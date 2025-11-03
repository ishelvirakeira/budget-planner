//got help from housemates with debugging

const express = require('express');
const app = express();
const port = 3500;

const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');

const configDB = require('./config/database.js');

//connecting to mongodb
mongoose.connect(configDB.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

//passport configuration
require('./config/passport')(passport);

//middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

//express session
app.use(session({
    secret: 'budgetplannersecret',
    resave: true,
    saveUninitialized: true
}));

//passport initialization
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
require('./app/routes.js')(app, passport);

app.listen(port, () => {
    console.log(`Budget Planner running on http://localhost:${port}`);
});
