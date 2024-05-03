const express = require("express");
const router = express.Router();
const path = require("path");
const bodyParser = require('body-parser'); // Parsing the req 

const getController = require("../controllers/getController");
const putController = require("../controllers/putController");
const postController = require("../controllers/postController");
const deleteController = require("../controllers/deleteController");

router.use(bodyParser.json())
router.use(express.urlencoded({ extended: true }));
router.use(express.static("public"));// For static images, css and js transitions

router
    .route("/")
    .get((req,res)=>{
        
    });

// User Login Page
router
    .route("/login")
    .get(getController.loginUser);

// 
router
    .route("/:id")
    .get(getController.retriveUser)
    .post((req,res)=>{
        console.log(req.body)
    });
router
    .route("/:id/rec")
    .get(getController.retriveUserJson);


module.exports = router;


