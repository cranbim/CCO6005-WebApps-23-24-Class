const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs')

const user = {
    firstName: 'Tim',
    lastName: 'Cook',
    admin: true,
}

const posts = [
    {title: 'Title 1', body: 'Body 1' },
    {title: 'Title 2', body: 'Body 2' },
    {title: 'Title 3', body: 'Body 3' },
    {title: 'Title 4', body: 'Body 4' },
]

app.get('/', (req, res) => {
    res.render('pages/index', {
        user,
        title: "Home Page"
    })
})
app.get('/articles', (req, res) => {
    res.render('pages/articles', {
        articles: posts,
        title: "Articles"
    })
})

app.get('/hello', (req, res) => {
    res.render('pages/hello')
})
app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})