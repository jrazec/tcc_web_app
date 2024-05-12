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

router
    .route("/")
    .get((req,res)=>{
        console.log('sss')
        res.render('user/landing/landing_page');
    });

router.use(express.static("public"));// For static images, css and js transitions

// User Login Page
router
    .route("/login")
    .get(getController.loginUser)
    .post(postController.signupUser);

// 
router
    .route("/game/:id")
    .get(getController.retriveUser)
    .post(postController.updateUserRecords);
router
    .route("/game/:id/rec")
    .get(getController.retriveUserJson);


module.exports = router;


