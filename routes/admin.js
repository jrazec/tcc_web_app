const express = require("express");
const router = express.Router();
const path = require("path");
const mysql = require('mysql2');
const bodyParser = require('body-parser');

router.use(bodyParser.json())



// Used these modules to use the views and folder directory
router.use(express.static("public"));// For static images, css and js transitions

// MYSQL CONNECTION
const con = mysql.createConnection({ // VALUES CAN BE STORED IN ENVIRONMENT VARIABLE
    host: 'localhost',
    user: 'jrazec',
    password: 'razec',
    database: 'tcc_db',
});



// Admin Login Page
router.get("/login",(req,res)=>{
    res.render('admin/admin-login');
});

// Home Page - Statistics Page
router.get("/home",(req,res)=>{
    res.render('admin/index', { content : "home" });
});

//-----------------------Quest Setting Up Page-----------------------
router
    .route("/setup/npc")
    .get((req,res)=>{
        
        con.connect((err)=>{ 
            if(err) throw err; // put else statement here
            
            // The main Query that will run by default.
            let queryNpc = 'SELECT npc_id,npc_name,npc_description,npc_image,coordinate FROM npcs LEFT JOIN designation USING(npc_id)'
            
            // If the search button sends a get request, and there is a value
            if (req.query.search) {
                queryNpc = `SELECT npc_id,npc_name,npc_description,npc_image,coordinate FROM npcs LEFT JOIN designation USING(npc_id) WHERE npc_id = ${req.query.search}`
            }

            // If the limit button sends a get request, and value is greater than 0
            if (req.query.limitCount > 0) {
                queryNpc += ` LIMIT ${parseInt(req.query.limitCount)};`
            } else {
                queryNpc += ';'
            }

            con.query(queryNpc,(err,result,field)=>{
                if(err) {
                    // Content is the ejs file for quest page 
                    // npcDesigTable is the table for above query, if errors, will send an object instead that has a value of error 
                    // route is used in choice-options, to send the get request depending on which page the user is in
                    res.render('admin/index', { content : "quest", npcDesigTable : {error: "error"}, choice : "choice_container/choice-npc", route : "npc"});
                }else {
                    res.render('admin/index', { content : "quest", npcDesigTable : result, choice : "choice_container/choice-npc", route : "npc"});
                }        
            });
        });
        
    })
    .post((req,res)=>{

    })
    .delete((req,res)=>{

    });

router
    .route("/setup/classroom")
    .get((req,res)=>{
        con.connect((err)=>{ 
            if(err) throw err; // put else statement here

            // Default Query for classroom
            let queryClassroom = 'SELECT room_id,room_name,room_purpose,room_image,floor_number,bldg_name FROM rooms LEFT JOIN floors USING(floor_id) LEFT JOIN buildings USING(bldg_id)';

            // If the search button sends a get request, and there is a value
            if (req.query.search) {
                queryClassroom = `SELECT room_id,room_name,room_purpose,room_image,floor_number,bldg_name FROM rooms LEFT JOIN floors USING(floor_id) LEFT JOIN buildings USING(bldg_id) WHERE room_id = ${req.query.search};`
            }

            // If the limit button sends a get request, and greater than 0
            if (req.query.limitCount > 0) {
                queryClassroom += ` LIMIT ${parseInt(req.query.limitCount)};`
            } else {
                queryClassroom += ';'
            }

            con.query(queryClassroom,(err,result,field)=>{
                if(err) {
                    // Content is the ejs file for quest page 
                    // roomFloorBldgTable is the table for above query, if errors, will send an object instead that has a value of error 
                    // route is used in choice-options, to send the get request depending on which page the user is in
                    res.render('admin/index', { content : "quest", roomFloorBldgTable : {error: "error"}, choice : "choice_container/choice-classroom", route : "classroom"});
                }else {
                    res.render('admin/index', { content : "quest", roomFloorBldgTable : result, choice : "choice_container/choice-classroom", route : "classroom"});  
                }              
            });
        });
        
    })
    .post((req,res)=>{

    })
    .delete((req,res)=>{

    });

router
    .route("/setup/quest")
    .get((req,res)=>{
        con.connect((err)=>{ 
            if(err) throw err; // put else statement here

            // Default query
            let queryQuest = 'SELECT quest_id,question,quest_type,npc_name,room_name FROM quests LEFT JOIN designation USING(quest_id) LEFT JOIN npcs USING(npc_id) LEFT JOIN rooms USING(room_id)';
            
            // If the search button sends a get request, and there is a value
            if (req.query.search) {
                queryQuest = `SELECT quest_id,question,quest_type,npc_name,room_name FROM quests LEFT JOIN designation USING(quest_id) LEFT JOIN npcs USING(npc_id) LEFT JOIN rooms USING(room_id) WHERE quest_id = ${req.query.search}`
            }

            // If the limit button sends a get request, and value > 0
            if (req.query.limitCount > 0) {
                queryQuest += ` LIMIT ${parseInt(req.query.limitCount)};`
            } else {
                queryQuest += ';'
            }

            con.query(queryQuest,(err,result,field)=>{
                        
                if(err) {
                    // Content is the ejs file for quest page 
                    // questDesigTable is the table for above query, if errors, will send an object instead that has a value of error 
                    // route is used in choice-options, to send the get request depending on which page the user is in
                    res.render('admin/index', { content : "quest", questDesigTable : {error: "error"}, choice : "choice_container/choice-quest", route : "quest"});
                }else {
                    res.render('admin/index', { content : "quest", questDesigTable : result, choice : "choice_container/choice-quest", route : "quest"});  
                }  
            });
          
          
        });
        
    })
    .post((req,res)=>{

    })
    .delete((req,res)=>{

    });
//---------------------------------------------------------------------


//-----------------------Map Setting up Page-----------------------
router.get("/setup/map",(req,res)=>{
    res.render('admin/index', { content : "map"});
});


// Student Setting up Page
router.get("/setup/student",(req,res)=>{
    res.render('admin/index', { content : "student"});
});


module.exports = router;


