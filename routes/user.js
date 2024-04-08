const express = require("express");
const router = express.Router();
const path = require("path");


router.use(express.static("public"));

// Admin Login Page
router.get("/login",(req,res)=>{

});


router.get("/",()=>{

});

module.exports = router;


