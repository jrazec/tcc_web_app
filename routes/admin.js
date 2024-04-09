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

router.get("/setup/quest",()=>{

});

router.get("/setup/map",()=>{

});

router.get("/setup/students",()=>{

});


module.exports = router;


