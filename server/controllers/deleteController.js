const url = require('url');
const npcTable = require('../model/Npc');
const roomTable = require('../model/Classroom');
const questTable = require('../model/Quest');
const facilityTable = require('../model/Facilities');

exports.deleteSingleNpc = async (req,res)=>{ 
    console.log("Delete Request")

    const npcId = parseInt(req.body.id); 
    console.log(npcId)
    try {
        // Updates the records; Sending message/feedback if success or failed
        const message = await npcTable.deleteNpc(npcId)
                                .then(result => "deleted")
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

exports.deleteSingleRoom = async (req,res)=>{ 
    console.log("Delete Request")
    const roomId = parseInt(req.body.id);
    try {
        const message = await roomTable.deleteRoom(roomId)
                                .then(result => "deleted")
                                .catch(err => "failed");

        // console.log(npc_id,npc_name,npc_description,npc_image,coordinate)
        console.log(message)
        res.redirect(url.format({
            pathname: "/admin/setup/classroom/",
            query : { msg : message}
        })); // This redirects to a url that shows if it is success or not

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    
};


exports.deleteSingleQuest = async (req,res)=>{ 
    console.log("Delete Request")
    const questId = parseInt(req.body.id);
    try {
        const message = await questTable.deleteQuest(questId)
                        .then(result => "deleted")
                        .catch(err => "failed");

        // console.log(npc_id,npc_name,npc_description,npc_image,coordinate)
        console.log(message)
        res.redirect(url.format({
            pathname: "/admin/setup/quest/",
            query : { msg : message}
        }));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    
};

