const express = require("express");
const router = express.Router();
const path = require("path");
const bodyParser = require('body-parser'); // Parsing the req 
const methodOverride = require('method-override'); // For overriding the _method? PUT
const connectMysql = require('../config/db');



const getController = require("../controllers/getController");
const putController = require("../controllers/putController");
const postController = require("../controllers/postController");
const deleteController = require("../controllers/deleteController");

router.use(bodyParser.json())
router.use(methodOverride('_method='));// Middle ware to just send post request in frontend
router.use(express.urlencoded({ extended: true }));
router.use(express.static("public"));// For static images, css and js transitions





// Admin Login Page
router.get("/login",(req,res)=>{
    res.render('admin/admin-login');
});

// Home Page - Statistics Page
router.get("/home",(req,res)=>{
    res.render('admin/index', { content : "home", route : "" });
});

//-----------------------Quest Setting Up Page-----------------------
router
    .route("/setup/npc")
    .get(getController.getNpc)
    .post(postController.addNpc);

router
    .route("/setup/npc/edit/:id")
    .get(getController.getSingleNpc)
    .post(putController.editSingleNpc);

router
    .route("/setup/npc/delete/:id")
    .get(getController.getSingleNpc)
    .delete(deleteController.deleteNpc);

router
    .route("/setup/classroom")
    .get(getController.getClassroom)
    .post((req,res)=>{

    })
    .delete((req,res)=>{

    });

router
    .route("/setup/quest")
    .get(getController.getQuest)
    .post((req,res)=>{

    })
    .delete((req,res)=>{

    });
//---------------------------------------------------------------------


//-----------------------Map Setting up Page-----------------------
router.get("/setup/map",(req,res)=>{
    res.render('admin/index', { content : "map",  route : "" });
});


// Student Setting up Page
router.get("/setup/student",(req,res)=>{
    res.render('admin/index', { content : "student", route : "" });
});


module.exports = router;


