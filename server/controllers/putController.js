const url = require('url');
const {npcTable} = require('../model/Get');

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