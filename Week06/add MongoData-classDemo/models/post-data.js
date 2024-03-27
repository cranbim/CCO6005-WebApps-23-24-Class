const mongoose=require('mongoose')
const {Schema, model} = mongoose

const postSchema= new Schema({
    postedBy: String,
    message: String,
    likes: Number,
    time: Date,
})

const Post = model('NewtonPark', postSchema)

// postData.addNewPost(request.session.userid, request.body)
function addNewPost(userID, post){
    console.log("user:"+ userID)
    let myPost={
        postedBy: userID,
        message: post.message,
        likes: 0,
        time: Date.now()
    }
    Post.create(myPost)
        .catch(err=>{
            console.log("Error: "+err)
        })
}

async function getPosts(n=3){
    let data=[]
    await Post.find({})
        .sort({'time': -1})
        .limit(n)
        .exec()
        .then(mongoData=>{
            data=mongoData
            console.log(data)
        })
        
    return data
    // return posts.slice(0,n)
}

// let myPost={
//     postedBy: userID,
//     message: post.message,
//     likes: 0,
//     time: Date.now()
// }

module.exports={
    addNewPost,
    getPosts
}