require("dotenv").config()
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const File = require("./models/File.js")

const app = express();
const multer = require('multer');
const upload = multer({dest:"uploads"}); //files to be stored in uploads folder
app.use(express.urlencoded({extended:true}))

mongoose.connect("mongodb://localhost:27017/filesharing",err=>{
if(err) console.log(err);
})

app.set("view engine","ejs");

app.get('/',(req,res)=>{
    res.render("index")
})

app.post("/upload",upload.single("file"),async (req,res)=>{
    const fileData = {
        path:req.file.path, 
        originalName:req.file.originalname
    }

    if(req.body.password!=null && req.body.password!==""){
        fileData.password =await bcrypt.hash(req.body.password,10)
    }

    const file = await File.create(fileData)
    res.render("index",{filelink:`${req.headers.origin}/file/${file.id}`})
})


app.route("/file/:id").get(handleDownload).post(handleDownload)

async function handleDownload(req,res){
    const file = await File.findById(req.params.id);
    
    if(file.password != null)
    {
        if(req.body.password == null)
        {
            res.render("password");
            return
        }

        if(!(await bcrypt.compare(req.body.password,file.password))){
            res.render("password",{error:true})
            return
        }
    }

    file.downloadCount++;

    await file.save();
    res.download(file.path,file.originalName)
    console.log(file.downloadCount)
}

app.listen(3000,()=>{
    console.log("hello world")
})
