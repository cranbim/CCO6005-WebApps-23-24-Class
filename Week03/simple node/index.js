const express=require('express')
const utils=require('./utils.js')

console.log(utils.addTwo(10))
console.log(utils.addTen(10))

const app = express()
app.listen(3000, ()=> console.log('listening on port 3000'))

app.use(express.static('./public'))

app.use(express.urlencoded({extended: false}))

app.post('/login', (request, response) =>{
    console.log(request.body)
    response.redirect('loggedin.html')
})

app.post('/post', (request, response)=>{
    console.log("the message is..."+request.body.message)
})


