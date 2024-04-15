const express = require("express");
const router = express.Router();
const path = require("path");
const bodyParser = require('body-parser'); // Parsing the req 
const methodOverride = require('method-override'); // For overriding the _method? PUT
const connectMysql = require('../config/db');
const getController = require("../controllers/getController");


router.use(bodyParser.json())
router.use(methodOverride('_method='));// Middle ware to just send post request in frontend
router.use(express.urlencoded({ extended: true }));
router.use(express.static("public"));// For static images, css and js transitions

console.log(connectMysql)



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
    .get(getController.getNpc)
    .post((req,res)=>{//CREATE
        console.log("Post Request")
    });

router
    .route("/setup/npc/edit/:id")
    .get(getController.getSingleNpc)
    .post((req,res)=>{//UPDATE
        console.log("Put Request")
        const npc_id = String(req.body["npc-id"]); 
        const npc_name = String(req.body["npc-name"]);
        const npc_description = String(req.body["npc-desc"]);
        const npc_image = String(req.body["npc-image"]);
        const coordinate = String(req.body["coordinates"]);

        let updateValuesT1 = `UPDATE npcs 
                              SET npc_name=\"${npc_name}\",npc_description=\"${npc_description}\",npc_image=\"${npc_image}\" 
                              WHERE npc_id=${npc_id};`;
        let updateValuesT2 = `UPDATE designation 
                              SET coordinate=${coordinate} 
                              WHERE npc_id=${npc_id};`;
        con.connect(err=>{
            if(err) throw err;

            // Transaction 1 for NPC table
            con.query((updateValuesT1),(err,result,field)=>{
                if(err) {
                    console.log("Failed T1 Update");
                } // throw an error message
                else {
                    console.log("Success T1 Update");
                }
            });
            // Transaction 2 for Designation Table
            con.query((updateValuesT2),(err,result,field)=>{
                if(err) {
                    console.log("Failed T2 Update");
                } // throw an error message
                else {
                    console.log("Success T2 Update");
                }
            });
        })
        console.log(npc_id,npc_name,npc_description,npc_image,coordinate)
        res.redirect("/admin/setup/npc/");

    });

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
    res.render('admin/index', { content : "map"});
});


// Student Setting up Page
router.get("/setup/student",(req,res)=>{
    res.render('admin/index', { content : "student"});
});


module.exports = router;


