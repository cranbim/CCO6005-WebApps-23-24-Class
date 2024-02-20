let posts=[]
let nextPostID=0

let postButton=document.querySelector('#post-button')
postButton.addEventListener('click',postButtonClicked)
let messageContainer=document.querySelector('#post_message')
messageContainer.addEventListener('input', postDidChange)
messageContainer.addEventListener('keypress', processKeys)
let postCount=document.querySelector('#post-count')

updatePostCount()


function postButtonClicked(event){
    event.preventDefault();
    postWords()
}

function postWords(){
    let messageToPost=(messageContainer.value || "empty")
    console.log(messageToPost)
    addToPosts(messageToPost)
    messageContainer.value=''
}

function postDidChange(event){
    console.log(event.target.value)
}

function processKeys(event){
    if(event.key === "Enter" || event.which===13){
        postWords()
        event.preventDefault()
    }
}

function addToPosts(message){
    let post={
        content: message,
        postId: nextPostID++,
        timePosted: Date.now(),
        user: "some guy"
    }
    console.log(post)
    posts.push(post)
    updatePostCount()
}

function updatePostCount(){
    postCount.innerHTML=posts.length
}
