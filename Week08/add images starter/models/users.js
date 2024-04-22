
const mongoose=require('mongoose')
const {Schema, model} = mongoose
const userSchema = new Schema({
    username: String,
    password: String,
    loggedin: Boolean
})

// const users=[
//     {username:'user1', password:'123', loggedin:false},
//     {username:'user2', password:'123', loggedin:false}
// ]

const User = model('MyDemoUser', userSchema)

async function newUser(username, password){
    const user={username:username, password:password, loggedin:false}
    // users.push(user)
    await User.create(user)
    .catch(err=>{
        console.log('Error:'+err)
    })
}

async function getUsers(){
    // return users
    let users=[]
    await User.find({}).exec()
        .then(dataFromMongo =>{
            users=dataFromMongo
        })
        .catch(err=>{
            console.log('Error:'+err)
        })
    return users
}

async function findUser(userToFind){
    // return users.find(user=>user.username==username)
    let foundUser=null
    await User.findOne({username: userToFind}).exec()
        .then(mongoData =>{
            foundUser=mongoData
        })
        .catch(err=>{
            console.log('Error:'+err)
        })
    return foundUser
}

async function checkPassword(username, password){
    let user=await findUser(username)
    if(user){
        return user.password==password
    }
    return false
}

// function setLoggedIn(username, state){
//     let user=findUser(username)
//     if(user){
//         user.loggedin=state
//     }
// }

// function isLoggedIn(username){
//     let user=findUser(username)
//     if(user){
//         return user.loggedin=state
//     }
//     return false
// }

exports.newUser=newUser;
exports.getUsers=getUsers;
exports.findUser=findUser;
exports.checkPassword=checkPassword;
// exports.setLoggedIn=setLoggedIn;
// exports.isLoggedIn=isLoggedIn;

