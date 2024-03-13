
const posts=[]
let nextPostID=0

function addNewPost(userID, post){
    let myPost={
        postID: nextPostID++,
        postedBy: userID,
        message: post.message,
        likes: 0,
        time: Date.now()
    }
    posts.unshift(myPost)
}

function getPosts(n=3){
    return posts.slice(0,n)
}



module.exports={addNewPost, getPosts}
