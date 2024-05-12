const url = require('url');
const npcTable = require('../model/Npc');
const roomTable = require('../model/Classroom');
const questTable = require('../model/Quest');
const facilityTable = require('../model/Facilities');

exports.addNpc = async (req,res)=>{ 
    console.log("Put Request")

    const npcId = String(req.body["add-npc-id"]); 
    const npcName = String(req.body["add-npc-name"]);
    const npcDes = String(req.body["add-npc-desc"]);
    const npcImg = String(req.body["add-npc-image"]);
    const coord = String(req.body["add-npc-coordinates"]);
    

    try {
        // Updates the records; Sending message/feedback if success or failed
        let desigId = await npcTable.checkHighestDesigId();
        let newNpcId = await npcTable.checkHighestNpcId();
        if(npcId === "") {
            newNpcId++;
        } else {
            newNpcId = npcId;
        }

        desigId = parseInt(desigId) + 1;

        const message = await npcTable.addNpc(newNpcId,npcName,npcDes,npcImg,coord,desigId)
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


exports.addRoom = async (req,res)=>{ 
    console.log("Put Request")

    const roomId = String(req.body["add-room-id"]); 
    const roomName = String(req.body["add-room-name"]);
    const roomPurp = String(req.body["add-room-desc"]);
    const roomImage = String(req.body["add-room-image"]);
    const coord = String(req.body["add-room-coordinates"]); 
    const floorId = String(req.body["floor"]);
    const bldgId = String(req.body["bldg"]);

    try {
        let desigId = await roomTable.checkHighestDesigId();
        let newRoomId = await roomTable.checkHighestRoomId(bldgId);
        console.log("Desig ID:",desigId);
        console.log("NewRoomId", newRoomId)

        if(roomId === "") {
            if(isNaN(newRoomId)) {
                newRoomId = parseInt(bldgId + "00");
            }
            newRoomId++;
        } else {
            newRoomId = roomId;
        }
        desigId = desigId + 1;
        console.log(newRoomId,roomName,roomPurp,roomImage,floorId,coord,desigId)
        const message = await roomTable.addRoom(newRoomId,roomName,roomPurp,roomImage,floorId,coord,desigId)
                                        .then(result => "success")
                                        .catch(err => "failed");
        console.log(message);

        res.redirect(url.format({
            pathname: "/admin/setup/classroom/",
            query : { msg : message}
        })); // This redirects to a url that shows if it is success or not
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    
};

exports.addQuest = async (req,res)=>{ 
    console.log("Put Request")
    const questId = req.body["add-quest-id"];
    const question = req.body["add-question"];
    const answer = req.body["add-answer"];
    const c1 = req.body["add-choice-1"];
    const c2 = req.body["add-choice-2"];
    const c3 = req.body["add-choice-3"];

    let npcDesig = req.body["add-npc-desig"];
    let roomDesig = req.body["add-room-desig"];
    let coord = req.body["add-quest-coordinates"];
    let type = req.body["add-quest-type"];
    // questId,questType,question,npcDesig,roomDesig,answer,c1,c2,c3

    try {
        let desigId = await questTable.checkHighestDesigId();
        let newQuestId = await questTable.checkHighestQuestId();
        if(npcDesig === undefined) {
            npcDesig = null;
        }
        if(roomDesig === undefined) {
            roomDesig = null;
        }
        if(questId === "") {
            if(isNaN(newQuestId)) { // if no existing questid
                newQuestId = 0;
            }
            newQuestId = parseInt(newQuestId) + 1;
        } else {
            newQuestId = parseInt(questId);
        }
        if(coord === "null"){
            coord = null;
        }else {
            coord = parseInt(coord);
        }
        if(type === "mc") { 
            type = "Multiple Choice";
        }else if(type === "fb"){
            type = "Fill in the Blanks";
        }else if(type === "ps"){
            type = "Picture Selection";
        }
        desigId = desigId + 1;
        console.log(questId,type,question,npcDesig,roomDesig,answer,c1,c2,c3)
        const message = await questTable.addQuest(newQuestId,type,question,npcDesig,roomDesig,answer,c1,c2,c3,desigId,coord)
                                        .then(result => "success")
                                        .catch(err => "failed");
        console.log(message);

        res.redirect(url.format({
            pathname: "/admin/setup/quest/",
            query : { msg : message}
        }));

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    
};


exports.editBuilding = async (req,res)=>{
    console.log("Get Facils");
    try{
        let bldgList = [req.body["bldg-1"],req.body["bldg-2"],req.body["bldg-3"],req.body["bldg-4"]]
        console.log("SDSDDS",bldgList)
        let message = await facilityTable.updateBldg(bldgList);
        let tbl = await facilityTable.findQuestForBuilding();
        let bldgTbl = await facilityTable.findBuildings();
        res.render('admin/index', { content : "map",  route : "", tbl, bldgTbl});
    }catch(err){
        res.status(500).send("Internal Server Error");
    }
}

