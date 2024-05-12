const url = require('url');
const npcTable = require('../model/Npc');
const roomTable = require('../model/Classroom');
const questTable = require('../model/Quest');
const userTable = require('../model/Users');

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



// ------------------------------------------------------- USERS ----------------------------------------------------------
exports.updateUserRecords = async (req,res)=>{
    let userId = req.params.id;
    if(req.body.type === "avatar"){
        let avatarId = req.body.avatar;
        let message = await userTable.updateNewAvatar(userId,avatarId)
        let questList = await userTable.findQuests();
        let message2 = await userTable.updateNewUser(userId,questList)
        console.log(message,message2)
    } 
    else if(req.body.type === "quest"){
        let questList = req.body.questList;
        let message = await userTable.updateQuest(userId,questList);
        console.log(message)
    }
    console.log(req.body)
}

exports.signupUser = async (req,res)=>{
    try {
        console.log(req.body)
        if(req.body.signin === "Sign In"){
            if(req.body === undefined || req.body.suPass === undefined){
                res.render('user/login/logs');
            }else {
                console.log(String(req.body.suSrCode),String(req.body.suPass))
                let user = await userTable.searchUser(parseInt(req.body.suSrCode),String(req.body.suPass));
                console.log(user.length)
                if(user.length === 0){
                    res.render('user/login/logs');
                }else {
                    console.log(user)
                    //session
                    res.redirect(`/user/game/${user[0].user_id}`);
                }
            }
        }
        if(req.body.signup === "Sign Up"){
            console.log("signup")
            if(req.body.suFname === undefined || req.body.suLname === undefined || req.body.suIgn === undefined  || req.body.suIgn === undefined){
                res.render('user/login/logs');
            }else {
                let HighestSrCode = await userTable.findLastUserId();
                console.log((HighestSrCode[0].max))
                let message = await userTable.createNewUser(parseInt(HighestSrCode[0].max)+1,req.body.suFname,req.body.suLname,req.body.suIgn,req.body.suPass,parseInt(req.body.suProg),req.body.suUserName);
                console.log(message)
                res.render('user/login/logs');
                
            }
        }

    } catch(error) {
        console.log(error)
    }
}