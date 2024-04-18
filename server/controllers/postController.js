const url = require('url');
const npcTable = require('../model/Npc');
const roomTable = require('../model/Classroom');
const questTable = require('../model/Quest');

exports.addNpc = async (req,res)=>{ 
    console.log("Put Request")

    const npcId = String(req.body["add-npc-id"]); 
    const npcName = String(req.body["add-npc-name"]);
    const npcDes = String(req.body["add-npc-desc"]);
    const npcImg = String(req.body["add-npc-image"]);
    const coord = String(req.body["add-coordinates"]);
    

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

    try {
        res.send("addRoom")

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    
};

exports.addQuest = async (req,res)=>{ 
    console.log("Put Request")

    try {
        res.send("addQuest")

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    
};


