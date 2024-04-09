const express = require("express");
const router = express.Router();
const path = require("path");

// Used these modules to use the views and folder directory
router.use(express.static("views")); // For static images, css and js transitions
router.use(express.static("public"));// for dynamic pages etc.


// Admin Login Page
router.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','admin','admin-login.html'))
});

router.get("/home",(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','admin','home.html'))
});

router.get("/setup/quest",(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','admin','quest.html'))
});

router.get("/setup/map",(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','admin','map.html'))
});

router.get("/setup/student",(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','admin','student.html'))
});


module.exports = router;


