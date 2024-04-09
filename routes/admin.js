const express = require("express");
const router = express.Router();
const path = require("path");


router.use(express.static("admin"));

// Admin Login Page
router.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,'..','admin','html','admin-login.html'))
});

router.get("/home",(req,res)=>{
    res.sendFile(path.join(__dirname,'..','admin','html','home.html'))
});

router.get("/setup/quest",(req,res)=>{
    res.sendFile(path.join(__dirname,'..','admin','html','quest.html'))
});

router.get("/setup/map",(req,res)=>{
    res.sendFile(path.join(__dirname,'..','admin','html','map.html'))
});

router.get("/setup/student",(req,res)=>{
    res.sendFile(path.join(__dirname,'..','admin','html','student.html'))
});


module.exports = router;


