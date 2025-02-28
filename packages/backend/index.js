import * as shared from 'shared'
import express from 'express'


const app = express()

app.get('/', (req, res)=>{
    res.end('hello world')
})

app.get('/api/hello', (req, res)=>{
    res.json({})
})

app.listen(3000, ()=>{
    console.log('listening on http://localhost:3000')
})