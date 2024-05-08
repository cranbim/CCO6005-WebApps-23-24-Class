const mongoose=require('mongoose')
const {Schema, model} = mongoose

const postSchema = new Schema({
    postedBy: String,
    message: String,
    imagePath: String,
    likes: Number,
    time: Date,
    comments: [{
        commentBy: String,
        message: String,
        likes: Number
    }]
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

async function likePost(likedPostID, likedByUser){
    let found
    await Post.findByIdAndUpdate(likedPostID,{$inc: {likes: 1}}).exec()
        .then(foundData=>found=foundData)
    console.log(found)
}

async function commentOnPost(commentedPostID, commentByUser, comment){
    // await Post.findByIdAndUpdate(likedPostID,{$inc: { likes: 1 }})
    let found
    let newComment={
        commentBy: commentByUser,
        message: comment,
        likes: 0
    }
    await Post.findByIdAndUpdate(commentedPostID,{$push: {comments: newComment}}).exec()
        .then(foundData=>found=foundData)
    // console.log(found)
}

async function likeComment(commentedPostID, commentIndex){
    // await Post.findByIdAndUpdate(likedPostID,{$inc: { likes: 1 }})
    let found
    // await Post.findByIdAndUpdate(commentedPostID,{$inc: {"comments.message.likes": 1}}).exec()
    //     .then(foundData=>found=foundData)
    // console.log(found)
}


module.exports={
    addNewPost,
    getPosts,
    getPost,
    likePost,
    commentOnPost,
    likeComment
}