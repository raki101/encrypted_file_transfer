const mongoose = require('mongoose');

const File = new mongoose.Schema({
    path:{
        type:String,
        reqiured:true
    },
    originalName:{
        type:String,
        reqired:true
    },
    password:String,
    downloadCount:{
        type:Number,
        require:true,
        default:0
    }
})
module.exports=mongoose.model("File",File)