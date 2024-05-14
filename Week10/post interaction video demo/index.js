const express=require('express')
const app = express()
app.listen(3000, ()=> console.log('listening at port 3000'))

//serve unspecified static pages from our public dir
app.use(express.static('public'))
//make express middleware for json available
app.use(express.json())

//allows us to process post info in urls
app.use(express.urlencoded({extended: false}));

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
const sendgridAPIKey=process.env.SENDGRID_API_KEY

const mongoose=require('mongoose')
const connectionString=`mongodb+srv://CCO6005-00:${mongoDBPassword}@cluster0.lpfnqqx.mongodb.net/${myUniqueDatabase}?retryWrites=true&w=majority`
mongoose.connect(connectionString)

//mongoose.connect(`mongodb+srv://CCO6005-00:${mongoDBPassword}@cluster0.lpfnqqx.mongodb.net/DJWApp?retryWrites=true&w=majority`)​
const postData=require('./models/post-data.js')

const multer=require('multer')
const upload=multer({dest: './public/uploads'})

//import sendgrid and set API key from .env secrets
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(sendgridAPIKey)

//test that user is logged in with a valid session
function checkLoggedIn(request, response, nextAction){
    if(request.session){
        if(request.session.userid){
            nextAction()
        } else {
            request.session.destroy()
            // return response.redirect('/notloggedin.html')
            response.render('pages/login',{
                isLoggedIn: checkLoggedInState(request)
            })
        }
    }
}

app.set('view engine', 'ejs')

function checkLoggedInState(request){
    return (request.session && request.session.userid)
}

//controller for the main app view, depends on user logged in state
app.get('/app', checkLoggedIn, async (request, response)=>{
    // response.redirect('./application.html')
    response.render('pages/app', {
        username: request.session.userid,
        isLoggedIn: checkLoggedInState(request),
        postData: await postData.getPosts(5)
    })
})

app.get('/viewpost', checkLoggedIn, async (request, response)=>{
    // response.redirect('./application.html')
    let postID=request.query.postid//'66321bf0fdfeacf1d9fb6e88'
    // console.log(postID)
    let retrievedPost=await postData.getPost(postID)
    // console.log(retrievedPost)
    response.render('pages/viewpost', {
        isLoggedIn: checkLoggedInState(request),
        post: await postData.getPost(postID)
    })
})

app.get('/like', checkLoggedIn, async (request, response)=>{
    let postID=request.query.postid
    await postData.likePost(postID)
    response.render('pages/app', {
        username: request.session.userid,
        isLoggedIn: checkLoggedInState(request),
        postData: await postData.getPosts(5)
    })
})

app.post('/comment', checkLoggedIn, async (request, response)=>{
    // let postID=request.query.postid
    await postData.commentOnPost(request.body.postid, request.body.comment, request.session.userid)
    response.render('pages/viewpost', {
        isLoggedIn: checkLoggedInState(request),
        post: await postData.getPost(request.body.postid)
    })
})

app.get('/register', (request, response)=>{
    response.render('pages/register', {
        isLoggedIn: checkLoggedInState(request)
    })
})

app.get('/logout', (request, response)=>{
    response.render('pages/logout', {
        isLoggedIn: checkLoggedInState(request)
    })
})

app.get('/profile', (request, response)=>{
    response.render('pages/profile', {
        isLoggedIn: checkLoggedInState(request)
    })
})

app.get('/login', (request, response)=>{
    response.render('pages/login', {
       isLoggedIn: checkLoggedInState(request)
    })
})

//controller for logout
app.post('/logout', async (request, response)=>{
    
    // users.setLoggedIn(request.session.userid,false)
    request.session.destroy()
    console.log(await users.getUsers())
    response.redirect('./')
})

//controller for login
app.post('/login', async (request, response)=>{
    console.log(request.body)
    let userData=request.body
    console.log(userData)
    if(await users.findUser(userData.username)){
        console.log('user found')
        //with bcrypt we need to pass code as a callback
        await users.checkPassword(userData.username, userData.password, async function(isMatch){
            if(isMatch){
                console.log('password matches')
                request.session.userid=userData.username
                response.redirect('/app')
            } else {
                console.log('password wrong')
                response.redirect('/loginfailed.html')
            }
        })
        // Before using bcrypt we got a boolena from checkPassword
        // if(await users.checkPassword(userData.username, userData.password)){
        //     console.log('password matches')
        //     request.session.userid=userData.username
        //     await users.setLoggedIn(userData.username, true)
        //     response.redirect('/app')
        // } else {
        //     console.log('password wrong')
        //     response.redirect('/loginfailed.html')
        // }
    } else {
        console.log('no such user')
        response.redirect('/loginfailed.html')
    }
})


app.post('/newpost', upload.single('myImage'), async (request, response) =>{
    console.log(request.body)
    console.log(request.session.userid)
    console.log(request.file)
    let filename=null
    if(request.file && request.file.filename){ //check we have a file and that it has a file name
        filename='uploads/'+request.file.filename
    }
    postData.addNewPost(request.session.userid, request.body, filename)
    response.render('pages/app', {
        username: request.session.userid,
        isLoggedIn: checkLoggedInState(request),
        postData: await postData.getPosts(5)
    })
})

app.get('/getposts',async (request, response)=>{
    response.json(
        {posts:await postData.getPosts(5)}
        
    )
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

//test route to demonstrate email
app.get('/testemail', (request, response)=>{
    const msg = {
        to: 'd.webb@bathspa.ac.uk', // Change to your recipient
        from: 'dave.webb@cranbim.com', // Change to your verified sender
        subject: 'WebApps is hard but useful',
        text: 'You are doing great. Keep going!',
        html: '<strong>Nearly at the end!</strong>',
      }
      console.log('sending test email')
      sgMail
        .send(msg)
        .then((response) => {
          console.log(response[0].statusCode)
          console.log(response[0].headers)
        })
        .catch((error) => {
          console.error(error)
        })
    response.redirect('/emailresult.html')
})