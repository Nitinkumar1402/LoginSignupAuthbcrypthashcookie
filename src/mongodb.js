const mongoose = require('mongoose');
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://0.0.0.0:27017/e-comm")
.then(()=>{
    console.log('mongodb connected');
})
.catch(()=>{
        console.log('failed to connect');
})

const LogInSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    }

})

const collection = new mongoose.model('LogInCollection',LogInSchema)

module.exports = collection