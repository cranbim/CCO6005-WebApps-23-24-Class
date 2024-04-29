const express=require('express')
const app = express()
app.listen(3000, ()=> console.log('listening at port 3000'))

//serve unspecified static pages from our public dir
app.use(express.static('public'))
//make express middleware for json available
app.use(express.json())

//allows us to process post info in urls
app.use(express.urlencoded({extended: false}));

app.set('view engine', 'ejs')

const path = require('path');

//importing our own node module
const users=require('./models/users.js')

//consts to hold expiry times in ms
const threeMins = 1000 * 60 * 3;
const oneHour = 1000 * 60 * 60;

//use the sessions module and the cookie parser module
const sessions = require('express-session');
const cookieParser = require("cookie-parser");

//make cookie parser middleware available
app.use(cookieParser());

//load sessions middleware, with some config
app.use(sessions({
    secret: "a secret that only i know",
    saveUninitialized:true,
    cookie: { maxAge: oneHour },
    resave: false 
}));

require('dotenv').config()
const mongoDBPassword=process.env.MONGODBPASSWORD
const myUniqueDatabase="DaveWeek6Demo"

const mongoose=require('mongoose')
const connectionString=`mongodb+srv://CCO6005-00:${mongoDBPassword}@cluster0.lpfnqqx.mongodb.net/${myUniqueDatabase}?retryWrites=true&w=majority`
mongoose.connect(connectionString)

//mongoose.connect(`mongodb+srv://CCO6005-00:${mongoDBPassword}@cluster0.lpfnqqx.mongodb.net/DJWApp?retryWrites=true&w=majority`)​
const postData=require('./models/post-data.js')

const multer=require('multer')
const upload=multer({dest: './public/uploads'})

function userIsLoggedIn(request){
    return (request.session && request.session.userid)
}

//test that user is logged in with a valid session
function checkLoggedIn(request, response, nextAction){
    if(request.session){
        if(request.session.userid){
            nextAction()
        } else {
            request.session.destroy()
            // return response.redirect('/notloggedin.html')
            return response.render('pages/notloggedin', {
                isLoggedIn: userIsLoggedIn(request),
            })
        }
    }
}



//controller for the main app view, depends on user logged in state
// app.get('/app', checkLoggedIn, (request, response)=>{
app.get('/app', checkLoggedIn, async (request, response)=>{
    // response.redirect('./application.html')
    let recentPosts=await postData.getPosts(5)
    response.render('pages/app', {
        isLoggedIn: userIsLoggedIn(request),
        posts: recentPosts
    })
})

//controller for landing/home page
app.get('/', (request, response)=>{
    response.render('pages/index', {
        isLoggedIn: userIsLoggedIn(request)
    })
})

//controller to serve login page
app.get('/loginpage', (request, response)=>{
    console.log(request.session, request.session.username)
    console.log("!!! "+userIsLoggedIn(request)+" "+false)
    response.render('pages/loginpage', {
        isLoggedIn: userIsLoggedIn(request),
        // alreadyTriedLogin: false
    })
})

//controller to serve register page
app.get('/registerpage', (request, response)=>{
    response.render('pages/registerpage', {
        isLoggedIn: userIsLoggedIn(request)
    })
})

//controller to serve logout page
app.get('/logoutpage', (request, response)=>{
    response.render('pages/logout', {
        isLoggedIn: userIsLoggedIn(request)
    })
})

//controller to serve profile page
app.get('/profilepage', (request, response)=>{
    response.render('pages/profile', {
        isLoggedIn: userIsLoggedIn(request)
    })
})

//controller for logout
app.post('/logout', async (request, response)=>{
    
    // users.setLoggedIn(request.session.userid,false)
    request.session.destroy()
    console.log(await users.getUsers())
    response.render('pages/index', {
        isLoggedIn: userIsLoggedIn(request)
    })
})

//controller for login
app.post('/login', async (request, response)=>{
    console.log(request.body)
    let userData=request.body
    console.log(userData)
    if(await users.findUser(userData.username)){
        console.log('user found')
        if(await users.checkPassword(userData.username, userData.password)){
            console.log('password matches')
            request.session.userid=userData.username
            // users.setLoggedIn(userData.username, true)
            let recentPosts=await postData.getPosts(5)
            console.log(recentPosts)
            response.render('pages/app', {
                isLoggedIn: userIsLoggedIn(request),
                posts: recentPosts
            })
         } else {
            console.log('password wrong')
            response.render('pages/loginpage', {
                isLoggedIn: userIsLoggedIn(request),
                // alreadyTriedLogin: true
            })
        }
    }
    console.log(await users.getUsers())
})


app.post('/newpost', upload.single('myImage'), (request, response) =>{
    console.log(request.body)
    console.log(request.session.userid)
    console.log(request.file)
    let filename=null
    if(request.file && request.file.filename){ //check we have a file and that it has a file name
        filename='uploads/'+request.file.filename
    }
    postData.addNewPost(request.session.userid, request.body, filename)
    response.redirect('/postsuccessful.html')
})

app.get('/getposts',async (request, response)=>{
    response.json(
        {posts:await postData.getPosts(5)}
        
    )
})

app.get('/viewpost',async (request, response)=>{
    // console.log(request.query)
    let post=await postData.getPost(request.query.post)
    console.log(post)
    response.render('pages/viewpost', {
        isLoggedIn: userIsLoggedIn(request),
        post: post
    })
})

//controller for registering a new user
app.post('/register', async (request, response)=>{
    console.log(request.body)
    let userData=request.body
    // console.log(userData.username)
    if(await users.findUser(userData.username)){
        console.log('user exists')
        response.json({
            status: 'failed',
            error:'user exists'
        })
    } else {
        await users.newUser(userData.username, userData.password)
        response.redirect('/registered.html')
    }
    console.log(await users.getUsers())
})