const npcTable = require('../model/Npc');
const roomTable = require('../model/Classroom');
const questTable = require('../model/Quest');
const studentTable = require('../model/Students');
const facilityTable = require('../model/Facilities');
const userTable = require('../model/Users');


exports.getNpc = async (req, res) => {
    console.log("Get Request")
    try {
        
        let npcDesigTable = await npcTable.findAll();

        // If the search button sends a get request, and there is a value or a digit
        if (req.query.search && !isNaN(req.query.search)) {
            npcDesigTable = await npcTable.findAll("SEARCH", req.query.search);
        }

        if (parseInt(req.query.limitCount) > 0) {
            npcDesigTable = await npcTable.findAll("LIMIT", "", parseInt(req.query.limitCount));
        }
        /*  - Content is the ejs file for quest page 
            - npcDesigTable is the table for above query, if errors, will send an object instead that has a value of error 
            - route is used in choice-options, to send the get request depending on which page the user is in */
        res.render('admin/index', { content: "quest", npcDesigTable, choice: "choice_container/choice-npc", route: "npc" });
    
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

exports.getSingleNpc = async (req,res)=>{
    console.log("Get Request id");
    try {
        let id = req.params.id;
        let npcDesigChoice = await npcTable.findSingle(parseInt(id));
        console.log(req.path)
        if (req.path === `/setup/npc/edit/${id}`) {
            res.render('admin/index', { content : "operations/update", npcDesigChoice , npcId : id, route : "npc"});
        } else if(req.path === `/setup/npc/delete/${id}`) {
            res.render('admin/index', { content : "operations/delete", npcDesigChoice , npcId : id, route : "npc"});
        }

    } catch(error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }

}

exports.getClassroom = async (req,res)=>{
    console.log("Get Classroom Request");
    try {
        let roomFloorBldgTable = await roomTable.findAll();

        // If the search button sends a get request, and there is a value or a digit
        if (req.query.search && !isNaN(req.query.search)) {
            roomFloorBldgTable = await roomTable.findAll("SEARCH", req.query.search);
        }

        if (parseInt(req.query.limitCount) > 0) {
            roomFloorBldgTable = await roomTable.findAll("LIMIT", "", parseInt(req.query.limitCount));
        }

        res.render('admin/index', { content : "quest", roomFloorBldgTable, choice : "choice_container/choice-classroom", route : "classroom"});  
    
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

    
}

exports.getFloors = async (req, res) => {
    try {
        let floorList = await roomTable.findFloor();
        res.json(floorList);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

exports.getBldgs = async (req, res) => {
    try {
        let bldgList = await roomTable.findBldg();
        res.json(bldgList);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

exports.getSingleRoom = async (req,res)=>{
    console.log("Get Request id");
    try {
        let id = req.params.id;
        let roomDesigChoice = await roomTable.findSingle(parseInt(id));
        console.log(req.path)
        if (req.path === `/setup/classroom/edit/${id}`) {
            res.render('admin/index', { content : "operations/update", roomDesigChoice , classroomId : id, route : "classroom"});
        } else if(req.path === `/setup/classroom/delete/${id}`) {
            res.render('admin/index', { content : "operations/delete", roomDesigChoice , classroomId : id, route : "classroom"});
        }

    } catch(error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }

}

exports.getQuest = async(req,res)=>{
    console.log("Get Quest Request");
    try {
        let questDesigTable = await questTable.findAll();

        // If the search button sends a get request, and there is a value or a digit
        if (req.query.search && !isNaN(req.query.search)) {
            questDesigTable = await questTable.findAll("SEARCH", req.query.search);
        }

        if (parseInt(req.query.limitCount) > 0) {
            questDesigTable = await questTable.findAll("LIMIT", "", parseInt(req.query.limitCount));
        }

        res.render('admin/index', { content : "quest", questDesigTable, choice : "choice_container/choice-quest", route : "quest"});  
    
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

exports.getSingleQuest = async (req,res)=>{
    console.log("Get Request id");
    let id = req.params.id;
    let questDesigChoice = await questTable.findSingle(parseInt(id)); // Will Contain 4 indexes; for choices22
    try {
        
        if (req.path === `/setup/quest/edit/${id}`) {
            res.render('admin/index', { content : "operations/update", questDesigChoice , questId : id, route : "quest"});
        } else if(req.path === `/setup/quest/delete/${id}`) {
            res.render('admin/index', { content : "operations/delete", questDesigChoice , questId : id, route : "quest"});
        }

    } catch(error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }

}

exports.getAvailableNpcs = async (req, res) => {
    try {
        let npcList = await questTable.findAvailableNpcs();
        res.json(npcList);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

exports.getAvailableRooms = async (req, res) => {
    try {
        let roomLists = await questTable.findAvailableRooms();
        res.json(roomLists);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}



exports.getHome = async (req,res)=>{
    try {
       
        let avatarCount = await studentTable.findAvatarCount();
        let totalQuest = await studentTable.findTotalQuest();
        let expCount = await studentTable.findExpCount();
        let studentCount = await studentTable.findTotalStudents();
        let facilCount = await roomTable.findTotal();
        res.render('admin/index', { content : "home", route : "", data: {ac : avatarCount, tq : totalQuest, ec : expCount, sc : studentCount, fc : facilCount}});
        console.log(req.path)
            

    } catch(error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
    studentTable.findAvatarCount;
    
}

exports.getStudents = async (req,res)=>{
    try {  
        let studentTbl = await studentTable.findStudents();
        res.render('admin/index', { content : "student", route : "", data : studentTbl });            
    } catch(error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
    studentTable.findAvatarCount;
    
}

exports.getSingleStudent = async (req,res)=>{
    console.log("Get student id");
    let id = req.params.id;
    let userDesigChoice = await studentTable.findSingle(parseInt(id)); // Will Contain 4 indexes; for choices22
    try {
        
        if (req.path === `/setup/student/edit/${id}`) {
            res.render('admin/index', { content : "operations/update", userDesigChoice , studentId : id, route : "student"});
        } else if(req.path === `/setup/student/delete/${id}`) {
            res.render('admin/index', { content : "operations/delete", userDesigChoice , studentId : id, route : "student"});
        }

    } catch(error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }

}

exports.getFacilities = async (req,res)=>{
    console.log("Get Facils");
    try{
        let tbl = await facilityTable.findQuestForBuilding();
        let bldgTbl = await facilityTable.findBuildings();
        res.render('admin/index', { content : "map",  route : "", tbl, bldgTbl});
    }catch(err){
        res.statis(500).send("Internal Server Error");
    }
}
// ------------------------------------------ USERS ------------------------------------------
exports.retriveUser = async(req,res)=>{
    try {
        let user = await userTable.retrieveUser(parseInt(req.params.id));
        let userRecords = await userTable.retrieveRecords(req.params.id);
        res.render('user/gamebase', { userRecords : userRecords, user : user});
    } catch(error) {
        console.error(error);
    }
}

exports.retriveUserJson = async(req,res)=>{
    try {

        let userRecords = await userTable.retrieveRecords(req.params.id);
        let userAvatar = await userTable.retrieveUserAvatar(req.params.id);
        let facilities = await userTable.retrieveFacilites();
        res.json({userRecords,facilities,userAvatar});
    } catch(error) {
        console.error(error);
    }
}

exports.loginUser =async(req,res)=>{
    try {  
        res.render('user/login/logs');

    } catch(error) {
        console.log(error)
    }
}