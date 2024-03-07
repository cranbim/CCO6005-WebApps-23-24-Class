const express=require('express')
const app = express()
app.listen(3000, ()=> console.log('listening at port 3000'))

//serve unspecified static pages from our public dir
app.use(express.static('public'))
//make express middleware for json available
app.use(express.json())

app.use(express.urlencoded({extended: false}));

const session=require('express-session')
const cookieParser=require('cookie-parser')
app.use(cookieParser())

let oneHour=1000 * 60 * 60;
let threeMinutes=1000 * 60 *3;

app.use(session({
    secret:"this is my secret code",
    saveUninitialized:true,
    cookie: {maxAge: oneHour},
    resave: false
}))

//importing our own node module
const users=require('./users.js')


//test that user is logged in with a valid session
function checkLoggedIn(request, response, nextAction){
    if(true){
        nextAction()
    }
}

//controller for the main app view, depends on user logged in state
app.get('/app', checkLoggedIn, (request, response)=>{
    response.redirect('./application.html')
})


//controller for logout
app.post('/logout', (request, response)=>{
    console.log(users.getUsers())
    response.redirect('./loggedout.html')
})

//controller for login
app.post('/login', (request, response)=>{
    let userData=request.body

    console.log(request.body)
    if(users.checkPassword(userData.username, userData.password)){
        request.session.userid=userData.username
        response.redirect('/loggedin.html')
    } else {
        request.session.destroy()
        response.redirect('/notloggedin.html')
    }
})


//controller for registering a new user
app.post('/register', (request, response)=>{
    console.log(users.getUsers())
    response.redirect('/registered.html')
})