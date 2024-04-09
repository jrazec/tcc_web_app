const express = require("express");
const router = express.Router();
const path = require("path");
const mysql = require('mysql2');

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
            con.query('SELECT npc_id,npc_name,npc_description,npc_image,coordinate FROM npcs LEFT JOIN designation USING(npc_id);',(err,result,field)=>{
                res.render('admin/index', { content : "quest", npcDesigTable : result, choice : "choice_container/choice-npc"});        
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
            con.query('SELECT room_id,room_name,room_purpose,room_image,floor_number,bldg_name FROM rooms LEFT JOIN floors USING(floor_id) LEFT JOIN buildings USING(bldg_id);',(err,result,field)=>{
                res.render('admin/index', { content : "quest", roomFloorBldgTable : result, choice : "choice_container/choice-classroom"});        
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
            con.query('SELECT quest_id,question,quest_type,npc_name,room_name FROM quests LEFT JOIN designation USING(quest_id) LEFT JOIN npcs USING(npc_id) LEFT JOIN rooms USING(room_id);',(err,result,field)=>{
                res.render('admin/index', { content : "quest", questDesigTable : result, choice : "choice_container/choice-quest"});        
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


