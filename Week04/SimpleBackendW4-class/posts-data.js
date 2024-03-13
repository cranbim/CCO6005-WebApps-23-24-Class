const posts=[]
let nextPostID=0

function addNewPost(userID, message){
    let myPost={
        postID: nextPostID++,
        postedBy: userID,
        message: message,
        likes: 0,
        time: Date.now()
    }
    posts.unshift(myPost)
    console.log(posts)
}

function getPosts(n=3){
    return posts.slice(0,n)
}


module.exports={
    addNewPost,
    getPosts
}