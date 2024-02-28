console.log("i am running")

let postButton=document.getElementById('post-button')
postButton.addEventListener('click',processPostMessage)
let postMessage=document.querySelector('#post-message')
postMessage.addEventListener('input',function(event){
    console.log(event.target.value)
})

function processPostMessage(event){
    console.log('you clicked me')
    event.preventDefault()
}