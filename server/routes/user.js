const express = require("express");
const router = express.Router();
const path = require("path");


router
    .route("/")
    .get();

// User Login Page
router
    .route("/login")
    .get((req,res)=>{
        res.sendFile(path.resolve(__dirname+"/../../views/user/gamebase.html"));
    });

// 
router
    .route("/:id")
    .get((req,res)=>{
        console.log(__dirname+"/../../views/user/gamebase.html")

    });



module.exports = router;


