const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://mels:eleanor2@cluster0.1swxzpw.mongodb.net/Capstone' , {useNewUrlParser : true , useUnifiedTopology : true})

const connection = mongoose.connection

connection.on('error', err => console.log(err))

connection.on('connected' , () => console.log('Connection made successfully'))