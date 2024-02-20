console.log("Simple Posting App")

//Code to retrieve 'user' param from the URL if present
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userParam = urlParams.get('user')

//A dummy data structure to store data about the user
const user={
    userID: userParam,
    someOtherStuff: null
}
console.log(user);

//get a handle and add event listeners to the word input form
let words=document.querySelector('#words')
words.addEventListener('input',checkWords)
words.addEventListener('keypress',checkIfReturn)

//get a handle and add event listeners to the 'post' button
let postButton=document.querySelector('#postwords')
postButton.addEventListener('click',postWords)

//basic post database (empty)
let recentPosts=[]
let maxRecents=3
let nextPostID=0

//variables for the 5 word limit feature
let maxWords=5
let currentWords=[]
let warningSpan=document.querySelector('#warning')
let warningMessage="only 5 words allowed"

//get a handle on the recent-posts UL
let recentPostList=document.querySelector("#recent-posts")

//set a timer to constantly refresh the age of posts
let updateTimer=setInterval(updateRecentPosts,1000)

//handle enetr key on input form
function checkIfReturn(event){
    if(event.key === "Enter" || event.which===13){
        postWords()
        event.preventDefault();
    }
}

//process input words top limit to 5 words
function checkWords(event){
    currentWords=[]
    let wordsNow=[]
    let inputText=event.target.value
    let inputWords=inputText.split(' ')
    if(inputWords.length>maxWords){
        warningSpan.textContent=warningMessage
        console.log("too many words: maximum 5!")
        wordsNow=inputWords.slice(0,5)
        // console.log(wordsNow)
        words.value=wordsNow.join(' ')
    } else {
        warningSpan.textContent=""
        wordsNow=[...inputWords]
    }
    console.log(wordsNow)
    currentWords=wordsNow
}

//create dummy data structure for our post, and update recent posts list (database)
function postWords(){
    if(currentWords.length==0){
        console.log('no words to post')
    } else {
        let myPost={
            postID: nextPostID++,
            userID: user.userID,
            post: [...currentWords],
            likes: 0,
            time: Date.now()
        }
        // console.log(myPost)
        postTheseWords(myPost)
        recentPosts.unshift(myPost)
        if(recentPosts.length>maxRecents){
            recentPosts.pop()
        }
        clearWordInput()
        updateRecentPosts()
    }
}

//helper function
function clearWordInput(){
    words.value=''
    currentWords=[]
}

//dummy function to hnadle the posting to the backend if we had one
function postTheseWords(wordsToPost){
    console.log("posting...")
    console.log(wordsToPost)
    console.log("... Posted!")
}


//update the HTML for the recent posts list
function updateRecentPosts(){
    recentPostList.innerHTML=''
    recentPosts.forEach(function(post){
        let li=document.createElement('li')
        let now=Date.now()
        let ellapsed=new Date(now-post.time)
        // let ellapsedMins=ellapsed.getMinutes()
        let ellapsedSecs=ellapsed.getSeconds()
        let ellapsedMins=ellapsed.getMinutes()
        ellapsedSecs=String(ellapsedSecs).padStart(2, '0');
        let button=document.createElement('button')
        button.textContent='like'
        button.setAttribute('data-post-id',post.postID.toString())
        button.addEventListener('click',processLike)
        let liContent=document.createElement('div')
        let liText=document.createElement('p')
        liText.textContent=`${post.post.join(' ')} (user ${post.userID}) [${ellapsedMins}:${ellapsedSecs} ago (m:s)] [likes:${post.likes}]`
        li.appendChild(liText)
        li.appendChild(button)
        recentPostList.appendChild(li)
    })
}

//function to deal with a like button being pressed on a post
function processLike(event){
    let likedPostId=event.target.getAttribute("data-post-id");
    console.log('you liked '+likedPostId)
    let matchedPost=recentPosts.find(post=>post.postID==likedPostId)
    if(matchedPost){ //check that it has found a match, if it did not this will be undefined
        matchedPost.likes++
        updateRecentPosts()
    } else {
        //no matched post
    }

}