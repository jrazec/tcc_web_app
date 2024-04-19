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

// -> Middlewares
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

// -> NPCs  

router /* Show table & Add NPCs */ 
    .route("/setup/npc")
    .get(getController.getNpc)
    .post(postController.addNpc);

router /* Show table & Edit NPCs */ 
    .route("/setup/npc/edit/:id")
    .get(getController.getSingleNpc)
    .post(putController.editSingleNpc);

router /* Show table & Delete NPCs */ 
    .route("/setup/npc/delete/:id")
    .get(getController.getSingleNpc)
    .delete(deleteController.deleteNpc);


// -> CLASSROOMs    
router /* Show table & Add NPCs */ 
    .route("/setup/classroom")
    .get(getController.getClassroom)
    .post(postController.addRoom); // TBA
// Fetching bldgs and floors list
router.route('/floors').get(getController.getFloors);
router.route('/buildings').get(getController.getBldgs);


router /* Show table & Edit NPCs */ 
    .route("/setup/classroom/edit/:id")
    .get(getController.getClassroom)
    .post(putController.editSingleRoom);
    

router /* Show table & Delete NPCs */
    .route("/setup/classroom/delete/:id")
    .get(getController.getClassroom)
    .delete(deleteController.deleteRoom);


// -> QUESTs  

router /* Show table & Edit NPCs */ 
    .route("/setup/quest")
    .get(getController.getQuest)
    .post(postController.addQuest)
// Fetching rooms and npcs list
router.route('/npcs').get(getController.getAvailableNpcs);
router.route('/rooms').get(getController.getAvailableRooms);


router /* Show table & Edit NPCs */ 
    .route("/setup/quest/edit/:id")
    .get(getController.getQuest)
    .post(putController.editSingleQuest);
    

router /* Show table & Delete NPCs */
    .route("/setup/quest/delete/:id")
    .get(getController.getQuest)
    .delete(deleteController.deleteQuest);


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


