const express = require('express')
const cors = require('cors')
const {admin} = require('./Route/admin')



const app = express()



app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE'],
    credentials: true
}))

app.use(express.json())
app.use('/admin', admin);




app.listen(3032 , ()=> {
    console.log('server is listn on port 3032')
})