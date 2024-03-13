let post={
    user: userID, //number
    timeposted: Date.now(), //
    prompt: promptText, //text
    message: message, //text
    likes: 0, //count
    comments: [
        {
            comment: message, //text
            commentBy: userID, //number or login name
            date: Date.now(), //date
            likes: 0 //count
        }, {
            comment: message, //text
            commentBy: userID, //number or login name
            date: Date.now(), //date
            likes: 0 //count
        }
    ]
}


let previous_prompts=[
    {
        id: 1001,
        prompt: 'pirates in sports direct'
    }, {
        id: 1002,
        prompt: 'kids after 17 cokes'
    }
]

