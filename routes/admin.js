const express = require("express");
const router = express.Router();
const path = require("path");

// Used these modules to use the views and folder directory
router.use(express.static("public"));// For static images, css and js transitions


// Admin Login Page
router.get("/login",(req,res)=>{
    res.render('admin/admin-login');
});

router.get("/home",(req,res)=>{
    res.render('admin/home');
});

router
    .route("/setup/quest")
    .get((req,res)=>{
        res.render('admin/quest');
    })
    .post((req,res)=>{

    })
    .delete((req,res)=>{

    });

router.get("/setup/map",(req,res)=>{
    res.render('admin/map');
});

router.get("/setup/student",(req,res)=>{
    res.render('admin/student')
});


module.exports = router;


