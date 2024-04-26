const url = require('url');
const npcTable = require('../model/Npc');
const roomTable = require('../model/Classroom');
const questTable = require('../model/Quest');

exports.editSingleNpc = async (req,res)=>{ //UPDATE single NPC
    console.log("Put Request")

    const npcId = String(req.body["npc-id"]); 
    const npcName = String(req.body["npc-name"]);
    const npcDes = String(req.body["npc-desc"]);
    const npcImg = String(req.body["npc-image"]);
    const coord = String(req.body["coordinates"]);

    try {
        // Updates the records; Sending message/feedback if success or failed
        const message = await npcTable.editSingle(npcId,npcName,npcDes,npcImg,coord)
                                .then(result => "success")
                                .catch(err => "failed");

        // console.log(npc_id,npc_name,npc_description,npc_image,coordinate)
        console.log(message)
        res.redirect(url.format({
            pathname: "/admin/setup/npc/",
            query : { msg : message}
        })); // This redirects to a url that shows if it is success or not

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    
};

exports.editSingleRoom = async (req,res)=>{ //UPDATE single NPC
    console.log("Put Request")

    const roomId = parseInt(req.body["room-id"]);
    const roomName = String(req.body["room-name"]);
    const roomPurp = String(req.body["room-purpose"]);
    const roomImage = String(req.body["room-image"]);
    const coord = String(req.body["coordinates"]); 
    const floorId = String(req.body["update-floor"]);
    const bldgId = String(req.body["update-bldg"]);
    console.log(roomId,roomName,roomPurp,roomImage,floorId,coord,bldgId);


    try {
         
        const message = await roomTable.editSingle(roomId,roomName,roomPurp,roomImage,floorId,coord,bldgId)
                                        .then(result => "success")
                                        .catch(error => "failed");
        console.log(message);
        res.redirect(url.format({
            pathname : "/admin/setup/classroom/",
            query : {msg : message}
        }));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    
};

exports.editSingleQuest = async (req,res)=>{ //UPDATE single NPC
    console.log("Put Request")
    const questId = req.body["quest-id"];
    let type = req.body["update-quest-type"];
    const question = req.body["update-question"];
    let npcDesig = parseInt(req.body["update-npc-desig"]);
    let roomDesig = parseInt(req.body["update-room-desig"]);
    const ans = req.body["update-answer"];
    const c1 = req.body["update-choice-1"];
    const c2 = req.body["update-choice-2"];
    const c3 = req.body["update-choice-3"];
    const coor = req.body["update-coordinates"];

    const oldChoices = await questTable.findChoices(parseInt(questId));
    
    if(type === "mc") {
        type = "Multiple Choice";
    }else if(type === "fb"){
        type = "Fill in the Blanks";
    }else if(type === "ps"){
        type = "Picture Selection";
    }
    console.log(npcDesig,roomDesig)
    if(isNaN(npcDesig)){
        npcDesig = null;
    } 
    if(isNaN(roomDesig)){
        roomDesig = null;
    }
    try {
        let questTbl = await questTable.findAll();
        // filters the table that contains the specific questid
        let qTable = questTbl.filter((obj)=> obj.quest_id === parseInt(questId));

        // returns old desigtable's values, which are to be used in the condition in bothNull
        const bothNull =  ((await qTable[0].npc_id === null && await qTable[0].room_id === null) || await qTable[0].npc_id === undefined && await qTable[0].room_id === undefined) ? {npc_id: qTable[0].npc_id,room_id: qTable[0].room_id,cond:true} : {npc_id: qTable[0].npc_id,room_id: qTable[0].room_id,cond:false}; // If their initial values are both null
        
        const message = await questTable.editSingle(parseInt(questId),type,question,npcDesig,roomDesig,ans,c1,c2,c3,coor,oldChoices,bothNull)
                                        .then(result => "success")
                                        .catch(error => "failed");
        console.log(message);
        res.redirect(url.format({
            pathname : "/admin/setup/quest/",
            query : {msg : message}
        }));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    
};