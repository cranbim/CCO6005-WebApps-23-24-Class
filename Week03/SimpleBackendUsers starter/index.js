const express=require('express')
const app = express()
app.listen(3000, ()=> console.log('listening at port 3000'))

//serve unspecified static pages from our public dir
app.use(express.static('public'))
//make express middleware for json available
app.use(express.json())

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
    console.log(users.getUsers())
    response.redirect('/loggedin.html')
})


//controller for registering a new user
app.post('/register', (request, response)=>{
    console.log(users.getUsers())
    response.redirect('/registered.html')
})