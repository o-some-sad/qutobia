import * as shared from 'shared'
import express from 'express'
import router from './routes/index.js'


const app = express()

app.get('/', (req, res)=>{
    res.end('hello world')
})

app.get('/api/hello', (req, res)=>{
    res.json({})
})

app.use(express.json());

app.use(router);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log('Server running on port: 3000') });
