const express = require("express");
const router = express.Router();
const path = require("path");


router.use(express.static("public"));

// Admin Login Page
router.get("/login",(req,res)=>{

});


router.get("/cecs/floor1",()=>{

});



module.exports = router;


