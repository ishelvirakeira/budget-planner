const Expense = require('./models/expense')

module.exports = function (app, passport) {
    app.get('/', (req, res) => {
        res.render('index.ejs', { message: req.flash('loginMessage')});
    })

    app.get('/login', (req, res) => {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    })

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }))

    app.get('/signup', (req, res) => {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    })

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }))

    app.get('/profile', isLoggedIn, async (req, res) => {
        const expenses = await Expense.find({ user: req.user._id });
        res.render('profile.ejs', { user: req.user, expenses, message: req.flash('profileMessage') });
    })

    app.post('/add-expense', isLoggedIn, async (req, res) => {
        await Expense.create({
            user: req.user._id,
            category: req.body.category,
            amount: req.body.amount,
            note: req.body.note
        });
        req.flash('profileMessage', 'Expense added successfully!');
        res.redirect('/profile')
    });

    app.delete('/delete-expense/:id', isLoggedIn, async (req, res) => {
        await Expense.findByIdAndDelete(req.params.id);
        req.flash('profileMessage', 'Expense deleted successfully!');
        res.redirect('/profile')
    });

    app.get('/logout', (req, res) => {
        req.logout(() => {
            res.redirect('/')
        })
    })
}
//check if user is authenticated
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next()
    res.redirect('/')
}
