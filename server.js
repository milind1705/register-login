if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require ('express');
const bcrypt = require('bcrypt');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')
initializePassport(passport,
    email => User.find(User => User.email === email),
    id =>   User.find(User => User.id === id))
const User = []
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.set('view engine', 'ejs')
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


app.get('/', checkAuthenticated, (req, res)=>{
    res.render('home', {name:"milind"})
})

app.get('/register', checkNotAuthenticated, (req, res)=>{
    res.render('register')
})

app.get('/login', checkNotAuthenticated, (req, res)=>{
    res.render('login')
})

//post methods
app.post('/register',checkNotAuthenticated, async (req, res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        User.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password:hashedPassword
        })
         res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    console.log(User)
})

app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

//check authanitication
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}
function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
       return res.redirect('/')
    } next ();
}

//logout
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

app.listen(4444, (req, res)=> {
    console.log('server is running')
})