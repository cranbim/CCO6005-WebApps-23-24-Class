const mongoose=require('mongoose')
const {Schema, model} = mongoose

const postSchema = new Schema({
    postedBy: String,
    message: String,
    imagePath: String,
    likes: Number,
    time: Date,
    comments: [
        {
            message: String,
            commentBy: String,
            likes: Number
        }
    ]
})

const Post = model('Post', postSchema)


function addNewPost(userID, post, imageFilename){
    let myPost={
        postedBy: userID,
        message: post.message,
        imagePath: imageFilename,
        likes: 0,
        time: Date.now(),
        comments: []
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
        })
    return data
}

async function getPost(postID){
    let foundPost=null
    await Post.findOne({_id:postID})
        .exec()
        .then(mongoData=>{
            foundPost=mongoData
        })
    return foundPost
}

async function likePost(postID){
    // let foundPost=null  
    await Post.findOneAndUpdate({_id:postID}, {$inc: {likes: 1}})
        .exec()
    //     .then(mongoData=>{
    //         foundPost=mongoData
    //     })
    // return foundPost
}

async function commentOnPost(postID, commentText, commentBy){
    let newComment={
        message: commentText,
        commentBy: commentBy,
        likes: 0
    }
    await Post.findOneAndUpdate({_id:postID}, {$push: {comments: newComment}})
        .exec()
}


module.exports={
    addNewPost,
    getPosts,
    getPost,
    likePost,
    commentOnPost
}