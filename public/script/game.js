const dragAndDrop = document.getElementById('drb_background');
const ddQuest = [document.getElementById('drb_question'),document.getElementById('dd-c1'),document.getElementById('dd-c2'),document.getElementById('dd-c3'),document.getElementById('dd-c4'),document.getElementById('answer')]
const fillInTheBlanks = document.getElementById('fitb_backgrund');
const fbQuest =[
    document.getElementById('fb-ques'),
    document.getElementById('fb-c1'),
    document.getElementById('fb-c2'),
    document.getElementById('fb-c3'),
    document.getElementById('fb-c4'),
    document.getElementById('fb-ans'),]
const pictureSelection = document.getElementById('ps_backgrund');
const psQuest =[
    document.getElementById('pic_ques'),
    document.getElementById('pic_answer'),
    document.getElementById('pic_ans'),
    document.getElementById('pic-2'),
    document.getElementById('pic-3'),
    document.getElementById('pic-4'),]

    

let url = "http://localhost:3000/user/";

// Create a questCounter = 0; if questCounter reaches 3|it will only be incremented once a certain quest
// is completed|, the user will be prompted out ng ano congrats or any storyline
// Once user clicked the button, he will be redirected to the bedroom then his gameplay records will be saved
// 

let records; // Global Variable of ALl the object 


let quests = []; // Storing of All the user's Available Quests
/* 
    Each index in quests contains all row of quests
    quest[i]
      .quest_id                 > just the quest Id
      .question                 > the questions
      .quest_type               > kind of questionnaire
      .status                   > if its done or not yet
      .choices                  
         .answer,.choice1,.choice2,.choice3 
                                > contains 4 choices in question

    //  quests.filter(obj=> (!obj.status)) | To Filter out the finished quests
*/
let questCounter = 0;
let questTempContainer = []
let questUpdate = [] // storing all quests that are to be updated as true
let indexArray =[]; // Collection of index of quests that are still undone
let userExist = null;
let userCreds = {}; // Storing All of the user's Credentials OBJ
/* 
    An object containing all the users Credentials
    userCreds
        .exp
        .first_name
        .ign
        .last_name
        .password
        .user_id
*/

let rooms = []; // Storing All of the Available Rooms
/*
    An array containing row of rooms
    rooms[i]
        .floor_id
        .room_id
        .room_image
        .room_name
        .room_purpose
    // rooms.length to check how many rows avail
*/

let floors = []; // Storing All of the Available Floors
/*
    An array containing row of floors
    floors[i]
        .floor_id
        .floor_image
        .floor_number
        .bldg_id
    // floors.length to check how many rows avail
*/

let bldgs = []; // Storing All of the Available bldgs
/*
    An array containing row of bldgs
    bldgs[i]
        .bldg_id
        .bldg_name
        .bldg_image
    // bldgs.length to check how many rows avail
*/

let avatarUser = {}; // Storing avatar specified for user and ALL OF its garments
/* 
    An object containing all the users Avatar
    avatarUser
        .avatar_id
        .avatar_name
        .avatar_description
        .garments[i]
            .garment_id
            .garment_name
        
*/

async function postJSON(data,userId) { // FETCH API, will send the user's info 
    try {
      const response = await fetch(url+userId, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
}

function initializeRecords(userId){
    fetch(`${url}${userId}/rec`)
    .then(response => response.json())
    .then(data => {

        //#region Records Conversion
        records = data;
        if(records.userRecords.length === 0){
            userExist = false;
        }else {
            userExist = true;
                    // let curQuest = 1;
            let gameplayCount = 0;
            // Setting Quests
            for(let i = 0; i < records.userRecords.length;i = i + 4){ // Filtering out quests | Can try to create obj and merge choices
                let tempQuest = {};
                tempQuest.quest_id = records.userRecords[i].quest_id; 
                tempQuest.question = records.userRecords[i].question; 
                tempQuest.quest_type = records.userRecords[i].quest_type; 
                tempQuest.status = records.userRecords[i].user_quest_status; 
                tempQuest.designation = records.userRecords[i].coordinate;
                tempQuest.indentifier = (records.userRecords[i].npc_id !== null) ? records.userRecords[i].npc_image : "room";
                let tempChoice = {}
                let choiceCounter = 1;
                for(let j = i; j < i+4;j++){ // Since Always 4 lang namang ang choices
                    if(records.userRecords[j].is_answer){
                        tempChoice.answer = records.userRecords[j].choice

                    } else {
                        tempChoice[`choice${choiceCounter}`] = records.userRecords[j].choice
                        choiceCounter++
                    }
                }
                if(records.userRecords[i].user_quest_status){
                    gameplayCount ++;
                }
                tempQuest.choices = tempChoice;
                quests.push(tempQuest)
            }
             // User Credss 
            userCreds.gameplay_count = gameplayCount; // indicates how many gameplays he already finished
            userCreds.user_id = records.userRecords[0].user_id;
            userCreds.password = records.userRecords[0].password;
            userCreds.first_name = records.userRecords[0].first_name; 
            userCreds.last_name = records.userRecords[0].last_name; 
            userCreds.ign = records.userRecords[0].in_game_name; 
            userCreds.exp = records.userRecords[0].current_exp;

            // Rooms
            for(let i = 0; i < records.facilities[0].length;i++){ // Rooms
                rooms.push({
                    floor_id : records.facilities[0][i].floor_id,
                    room_id : records.facilities[0][i].room_id,
                    room_image : records.facilities[0][i].room_image,
                    room_name : records.facilities[0][i].room_name,
                    room_purpose : records.facilities[0][i].room_purpose,
                });
            }


            //Floors
            for(let i = 0; i < records.facilities[1].length;i++){ // Floors
                floors.push({
                    floor_id : records.facilities[1][i].floor_id,
                    floor_image : records.facilities[1][i].floor_image,
                    floor_number : records.facilities[1][i].floor_number,
                    bldg_id : records.facilities[1][i].bldg_id,

                });
            }


            //Bldgs
            for(let i = 0; i < records.facilities[2].length;i++){ // Bldgs
                bldgs.push({
                    bldg_id : records.facilities[2][i].bldg_id,
                    bldg_image : records.facilities[2][i].bldg_image,
                    bldg_name : records.facilities[2][i].bldg_name,
                });
            }


            // Avatar
            avatarUser.avatar_id = records.userAvatar[0].avatar_id;
            avatarUser.avatar_name = records.userAvatar[0].avatar_name;
            avatarUser.avatar_description = records.userAvatar[0].avatar_description;
            let tempGar = []
            for(let i= 0; i < records.userAvatar.length;i++){
                tempGar.push({
                    garment_id : records.userAvatar[i].garment_id,    
                    garment_name : records.userAvatar[i].garment_name,
                })
            }
            avatarUser.garments = tempGar;

            // For debugging purps
            console.log("Quests:",quests);
            console.log("userCreds:",userCreds);
            console.log("avatar:",avatarUser);
            console.log("rooms:",rooms);
            console.log("floors:",floors);
            console.log("bldgs:",bldgs);

            console.log(records);
            //#endregion
        }

        console.log("aaa conv",quests)
        


        
//#region  Whole game
// ------------------------------------------------------- KABOOM! -------------------------------------------------------

kaboom ({
    width: 1280,
    height: 960,
    scale: 0.7,
    crisp: true
})

//visual debugging (helps see position and collision/trigger tiles)
//debug.inspect = true

//----------------------------------------GLOBAL VARIABLES-------------------------------------------

console.log("ue",userExist)
let avatar = null
if (userExist){
    avatar = (avatarUser.avatar_id === 1) ? "boy" : "girl"; // If 1, yuhgie, else bad di
}

let garment = "default"; //pambahay outfit in bedroom
// this will be sent by another ejs file, from bedroom

let returnPos = ""//stores prev location in hallway when entering a room
let inBldg = ""//stores current building name
const day = ['Mon', 'Tues', 'Wednes', 'Thurs', 'Fri'];
            // 0,     1,      2,      3,      4 
dayCounter = 0;
//-----------------------------------------------------------GLOBAL FUNCTIONS-------------------------------------------------------
//character tiling
function loadCharSprite(gender, clothing){
    let atlasName = `${gender}_${clothing}`;
    let imagePath = `/Assets/characs/${atlasName}.png`;

    loadSpriteAtlas(imagePath, {
        'player-down': {x: 0, y: 0, width: 96, height: 32, sliceX: 3, sliceY: 1, 
            anims: {'d-walk':{ from: 1, to: 2, speed: 6}}},
        'player-up': {x: 96, y: 0, width: 96, height: 32, sliceX: 3, sliceY: 1, 
            anims: {'u-walk': {from: 1, to: 2, speed: 6}}},
        'player-left': {x: 192, y: 0, width: 64, height: 32, sliceX: 2, sliceY: 1, 
            anims: {'l-walk': {from: 0, to: 1, speed: 6}}},
        'player-right': {x: 256, y: 0, width: 64, height: 32, sliceX: 2, sliceY: 1, 
            anims: {'r-walk': {from: 0, to: 1, speed: 6}}}
    })
}

function changeInfo(modal,info,question,choices){
    info[0].textContent = question;
    let arrChoice = choices;
    
    let shuffleChoices = (array)=> {
        let newArr = array;
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    }

    if(modal === "ps"){

        let newChoices = shuffleChoices([choices.answer,choices.choice1,choices.choice2,choices.choice3]);
        for(let i = 0; i < newChoices.length; i++){
            for(let j = 1; j < info.length; j++){
                if(newChoices[i] === choices.answer){
                    info[1].textContent = newChoices[i];
                    info[i+2].src = `/Assets/org_logos/${newChoices[i]}`
                    info[i+2].alt = newChoices[i];
                }else {
                    info[i+2].src = `/Assets/org_logos/${newChoices[i]}`
                    info[i+2].alt = newChoices[i];
                }
            }
        }
       
    }else {
        info[5].textContent = choices.answer;
        let newChoices = shuffleChoices([choices.answer,choices.choice1,choices.choice2,choices.choice3])
        info[1].textContent = newChoices[0];
        info[2].textContent = newChoices[1];
        info[3].textContent = newChoices[2];
        info[4].textContent = newChoices[3];
        console.log(newChoices,"newchoices")

    }
     
}

function randomizeQuest(){
    console.log("indexArray.length",indexArray.length)
        if(indexArray.length <= 0){
            for(let i = 0; i < quests.length; i++){
                console.log(quests[i].status)
                if(!quests[i].status){
                    indexArray.push(i);
                }
            }
        }
        console.log(indexArray)
        let randomIndex;
        let finalIndeces = [];// index container
        console.log("aaa ind",quests)
        if(indexArray.length > 3){
            for(let i =0; i<3; i++){ 
                randomIndex = Math.floor(Math.random()*indexArray.length); // RETURNS RANDOM INDEX OF INDEX ARRAY To randomize based on the available indeces
                if((!finalIndeces.includes(indexArray[randomIndex])) && (quests[indexArray[randomIndex]].status === 0)) {
                    finalIndeces.push(indexArray[randomIndex]);
                    questTempContainer.push(quests[indexArray[randomIndex]])
                }else { // If it is repeated, then go back and find another
                    i--;
                }            
            };
        } else {
            for(let i = 0; i <indexArray.length;i++){
                questTempContainer.push(quests[indexArray[i]]);
            }
        }
        // console.log("aaa qtemp",quests)
        // console.log(finalIndeces)
        console.log(questTempContainer)
}

//asset tiling
function loadAssets() {
    //load tutorial box
    loadSprite('tutorialbox', '/Assets/tutorialbox.png')
    
    //load character selection images
    loadSpriteAtlas('/Assets/characs/boy_uniform.png', {
        'yuhgie': {x: 0, y: 0, width: 32, height: 32}
    })
    loadSpriteAtlas('/Assets/characs/girl_uniform.png', {
        'baddi': {x: 0, y: 0, width: 32, height: 32}
    })

    //load character 
    loadCharSprite(avatar, garment)

    //load NPCs
    loadSprite('assoc.caringal', '/Assets/npcs/assoc.caringal-drawing.png')
    loadSprite('atty', '/Assets/npcs/atty-drawing.png')
    loadSprite('dr.amorado', '/Assets/npcs/dr.amorado-drawing.png')
    loadSprite('dr.balazon', '/Assets/npcs/dr.balazon-drawing.png')
    loadSprite('dr.castillo', '/Assets/npcs/dr.castillo-drawing.png')
    loadSprite('dr.generoso', '/Assets/npcs/dr.generoso-drawing.png')
    loadSprite('dr.godoy', '/Assets/npcs/dr.godoy-drawing.png')
    loadSprite('dr.magundayao', '/Assets/npcs/dr.magundayao-drawing.png')
    loadSprite('dr.malaluan', '/Assets/npcs/dr.malaluan-drawing.png')
    loadSprite('dr.soquiat', '/Assets/npcs/dr.soquiat-drawing.png')
    loadSprite('engr.austria', '/Assets/npcs/engr.austria-drawing.png')
    loadSprite('engr.melo', '/Assets/npcs/engr.melo-drawing.png')
    loadSprite('mr.alimoren', '/Assets/npcs/mr.alimoren-drawing.png')
    loadSprite('mrs.balita', '/Assets/npcs/mrs.balita-drawing.png')
    loadSprite('ms.lumbera', '/Assets/npcs/ms.lumbera-drawing.png')
    loadSprite('ms.sulit', '/Assets/npcs/ms.sulit-drawing.png')
    loadSprite('sir.tiquio', '/Assets/npcs/sir.tiquio-drawing.png')
    
    //GARMENTS
    loadSprite('men_school_unif', '/Assets/garments/men_school_unif.png')
    loadSprite('women_school_unif', '/Assets/garments/women_school_unif.png')
    loadSprite('pe_uniform', '/Assets/garments/pe_uniform.png')
    loadSprite('tech_is_set', '/Assets/garments/tech_is_set.png')
    loadSprite('jpcs_set', '/Assets/garments/jpcs_set.png')

    //BEDROOM --------- load outside map
    loadSpriteAtlas('/Assets/bedroom.png', {
        'bedroom': {x: 0, y: 0, width: 160, height: 96, sliceX: 5, sliceY: 3,
            anims: {
                'wall1': 0,
                'wall2': 1,
                'wall3': 2,
                'wall4': 3,
                'wall5': 4,
                'flr1': 5,
                'flr2': 6,
                'flr3': 7,
                'flr4': 8,
                'flr5': 9,
                'flr6': 10,
                'flr7': 11,
                'flr8': 12,
                'flr9': 13,
                'flr10': 14
            }}
    })

    //CLOSET ---------- load inside of closet
    loadSpriteAtlas('/Assets/closet.png', {
        'closet': {x: 0, y: 0, width: 160, height: 96, sliceX: 5, sliceY: 3,
            anims: {
                '0': 0,
                '1': 1,
                '2': 2,
                '3': 3,
                '4': 4,
                '5': 5,
                '6': 6,
                '7': 7,
                '8': 8,
                '9': 9,
                '10': 10,
                '11': 11,
                '12': 12,
                '13': 13,
                '14': 14
            }}
    })

    //MAIN MAP --------- load outside map
    loadSpriteAtlas('/Assets/map-tileset.png', {
        'tile': {x: 0, y: 0, width: 512, height: 256, sliceX: 16, sliceY: 8,
            anims: {
                'cecs-pt1': 0,
                'cecs-pt2': 1,
                'cecs-pt3': 16,
                'cecs-pt4': 17,
                'cecs-pt5': 32,
                'cecs-pt6': 33,
                'ldc-pt1': 2,
                'ldc-pt2': 3,
                'ldc-pt3': 4,
                'ldc-pt4': 5,
                'ldc-pt5': 6,
                'ldc-pt6': 7,
                'ldc-pt7': 8,
                'ldc-pt8': 18,
                'ldc-pt9': 19,
                'ldc-pt10': 20,
                'ldc-pt11': 21,
                'ldc-pt12': 22,
                'ldc-pt13': 23,
                'ldc-pt14': 24,
                'heb-pt1': 34,
                'heb-pt2': 35,
                'heb-pt3': 36,
                'heb-pt4': 37,
                'heb-pt5': 38,
                'heb-pt6': 39,
                'heb-pt7': 40,
                'heb-pt8': 50,
                'heb-pt9': 51,
                'heb-pt10': 52,
                'heb-pt11': 53,
                'heb-pt12': 54,
                'heb-pt13': 55,
                'heb-pt14': 56,
                'heb-pt15': 66,
                'heb-pt16': 67,
                'heb-pt17': 68,
                'heb-pt18': 69,
                'heb-pt19': 70,
                'heb-pt20': 71,
                'heb-pt21': 72,
                'heb-xtra': 84,
                'ob-pt1': 9,
                'ob-pt2': 10,
                'ob-pt3': 25,
                'ob-pt4': 26,
                'ob-pt5': 41,
                'ob-pt6': 42,
                'gym-pt1': 48,
                'gym-pt2': 49,
                'gym-pt3': 64,
                'gym-pt4': 65,
                'gym-pt5': 80,
                'gym-pt6': 81,
                'fcd-pt1': 96,
                'fcd-pt2': 97,
                'fcd-pt3': 98,
                'fcd-pt4': 99,
                'fcd-pt5': 100,
                'fcd-pt6': 101,
                'fcd-pt7': 102,
                'fcd-pt8': 103,
                'fcd-pt9': 104,
                'hroof-pt1': 11,
                'hroof-pt2': 12,
                'hroof-pt3': 27,
                'hroof-pt4': 28,
                'hroof-pt5': 43,
                'hroof-pt6': 44,
                'vroof-pt1': 13,
                'vroof-pt2': 14,
                'vroof-pt3': 15,
                'vroof-pt4': 29,
                'vroof-pt5': 30,
                'vroof-pt6': 31,
                'sroof-pt1': 45,
                'sroof-pt2': 46,
                'sroof-pt3': 47,
                'flag': 73,
                'groundtile': 57,
                'concrete': 58,
                'dirtv1': 74,
                'dirtv2': 75,
                'dirtv1-sh': 60,
                'dirtv2-sh': 59,
                'dirtpath': 109,
                'sparsegrass': 76,
                'grass-ul': 61,
                'grass-uc': 62,
                'grass-ur': 63,
                'grass-ml': 77,
                'grass-mc': 78,
                'grass-mr': 79,
                'grass-ll': 93,
                'grass-lc': 94,
                'grass-lr': 95,
                'path-pt1': 89,
                'path-pt2': 90,
                'path-pt3': 91,
                'path-pt4': 92,
                'path-pt5': 105,
                'path-pt6': 106,
                'path-pt7': 107,
                'path-pt8': 108,
                'stair-pt1': 121,
                'stair-pt2': 122,
                'stair-pt3': 123,
                'stair-pt4': 124,
                'fence-xtra': 82, 
                'fence-whole': 127,
                'fence-corner': 126,
                'big-gate': 125,
                'fence': 110,
                'fence-gateside': 111
            }}
    })

    //FACADE --------- load facade
    loadSpriteAtlas('Assets/facade.png', {
        'facade': {x: 0, y: 0, width: 256, height: 128, sliceX: 8, sliceY: 4,
            anims: {
                'pt0': 0,
                'pt1': 1,
                'pt2': 2,
                'pt3': 3,
                'pt4': 4,
                'pt5': 5,
                'pt6': 6,
                'pt7': 7,
                'pt8': 8,
                'pt9': 9,
                'pt10': 10,
                'pt11': 11,
                'pt12': 12,
                'pt13': 13,
                'pt14': 14,
                'pt15': 15,
                'pt16': 16,
                'pt17': 17,
                'pt18': 18,
                'pt19': 19,
                'pt20': 20,
                'pt21': 21,
                'pt22': 22,
                'pt23': 23,
                'pt24': 24,
                'pt25': 25,
                'pt26': 26,
                'pt27': 27,
                'pt28': 28,
                'pt29': 29,
                'pt30': 30,
                'pt31': 31
            }
        }
    })

    //TRIGGERS -------- load trigger points (transparent tiles from map tileset)
    loadSpriteAtlas('/Assets/map-tileset.png', {
        'trigger-tile': {x: 0, y: 0, width: 512, height: 256, sliceX: 16, sliceY: 8,
            anims: {
                'cecs-trigger': 112,
                'heb-trigger': 113, 
                'ob-trigger': 114, 
                'ldc-trigger': 115,
                'returnMap-trigger': 116,
                'moveflr-trigger': 117
            }}
    })

    //FLOORS --------- load building common hallways/corridors
    loadSpriteAtlas('/Assets/hallway-tileset.png', {
        'hallway-tile':{x: 0, y: 0, width: 256, height: 416, sliceX: 8, sliceY: 13, 
            anims: {
                //cecs hallway:
                'cecs-up-wall1': 0, //blank parameter in maketile func
                'cecs-up-wall2': 1,
                'cecs-up-wall3': 2,
                'cecs-up-pillar': 3,
                'cecs-wall1': 9,
                'cecs-wall2': 10,
                'cecs-main-pillar': 11,
                'cecs-doorL': 8,
                'cecs-doorR': 16,
                'cecs-sh-tile': 18,
                'cecs-sh-pillar-tile': 19,
                'cecs-tile': 26,
                'cecs-pillar-tile': 27,
                'cecs1-up-wall1': 56,
                'cecs1-up-wall2': 57,
                'cecs1-up-wall3': 58,
                'cecs1-up-pillar': 59,
                'cecs1-window1': 65,
                'cecs1-window2': 66,
                'cecs1-main-pillar': 67,
                'cecs1-glassdoor': 64,
                //heb hallway:
                'heb-up-wall1': 4, 
                'heb-up-wall2': 5,
                'heb-up-wall3': 6,
                'heb-up-pillar': 7,
                'heb-wall1': 13,
                'heb-wall2': 14,
                'heb-main-pillar': 15,
                'heb-doorL': 12,
                'heb-doorR': 20,
                'heb-sh-tile': 22,
                'heb-sh-pillar-tile': 23,
                'heb-tile': 21,
                'heb-ldc-path1': 68,
                'heb-ldc-path2': 69,
                'heb-ldc-path3': 70,
                'heb-ldc-upwall1': 60,
                'heb-ldc-upwall2': 61,
                'heb-ldc-upwall3': 62,
                //ldc hallway:
                'ldc-up-wall1': 36, 
                'ldc-up-wall2': 37,
                'ldc-up-wall3': 38,
                'ldc-up-pillar': 39,
                'ldc-wall1': 45,
                'ldc-wall2': 46,
                'ldc-main-pillar': 47,
                'ldc-doorL': 44,
                'ldc-doorR': 52,
                'ldc-sh-tile': 54,
                'ldc-sh-pillar-tile': 55,
                'ldc-tile': 53,
                'ldc1-d-uw1': 72,
                'ldc1-d-uw2': 73,
                'ldc1-d-uw3': 74,
                'ldc1-door1': 80,
                'ldc1-door2': 81,
                'ldc1-door3': 82,
                'ldc1-w-uw1': 76,
                'ldc1-w-uw2': 77,
                'ldc1-w-uw3': 78,
                'ldc1-window1': 84,
                'ldc1-window2': 85,
                'ldc1-window3': 86,
                //ob hallway:
                'ob-up-wall1': 32, 
                'ob-up-wall2': 33,
                'ob-up-wall3': 34,
                'ob-up-pillar': 35,
                'ob-wall1': 41,
                'ob-wall2': 42,
                'ob-main-pillar': 43,
                'ob-doorL': 40,
                'ob-doorR': 48,
                'ob-sh-tile': 50,
                'ob-sh-pillar-tile': 51,
                'ob-tile': 49,
                'clinic-uw1': 88,
                'clinic-uw2': 89,
                'clinic-uw3': 90,
                'clinic-upillar': 91,
                'clinic-d1': 96,
                'clinic-d2': 97,
                'clinic-d3': 98,
                'clinic-pillar': 99,
                'lib-bulletin1': 100,
                'lib-bulletin2': 101,
            }

        }
    })

    //ROOMS --------- load each room
    //LSB/CECS:
    //--comp lab
    loadSpriteAtlas('/Assets/rooms/comlab_cecs.png', {
        'cecs-comlab':{x: 0, y: 0, width: 288, height: 160, sliceX: 9, sliceY: 5, 
            anims: {
                'pt0': 0,
                'pt1': 1,
                'pt2': 2,
                'pt3': 3,
                'pt4': 4,
                'pt5': 5,
                'pt6': 6,
                'pt7': 7,
                'pt8': 8,
                'pt9': 9,
                'pt10': 10,
                'pt11': 11,
                'pt12': 12,
                'pt13': 13,
                'pt14': 14,
                'pt15': 15,
                'pt16': 16,
                'pt17': 17,
                'pt18': 18,
                'pt19': 19,
                'pt20': 20,
                'pt21': 21,
                'pt22': 22,
                'pt23': 23,
                'pt24': 24,
                'pt25': 25,
                'pt26': 26,
                'pt27': 27,
                'pt28': 28,
                'pt29': 29,
                'pt30': 30,
                'pt31': 31,
                'pt32': 32,
                'pt33': 33,
                'pt34': 34,
                'pt35': 35,
                'pt36': 36,
                'pt37': 37,
                'pt38': 38,
                'pt39': 39,
                'pt40': 40,
                'pt41': 41,
                'pt42': 42,
                'pt43': 43,
                'pt44': 44
            }
        }
    })
    //VMB/HEB:
    //--common room
    loadSpriteAtlas('/Assets/rooms/classroom_cecs-heb.png', {
        'heb-room':{x: 0, y: 0, width: 288, height: 160, sliceX: 9, sliceY: 5, 
            anims: {
                'pt0': 0,
                'pt1': 1,
                'pt2': 2,
                'pt3': 3,
                'pt4': 4,
                'pt5': 5,
                'pt6': 6,
                'pt7': 7,
                'pt8': 8,
                'pt9': 9,
                'pt10': 10,
                'pt11': 11,
                'pt12': 12,
                'pt13': 13,
                'pt14': 14,
                'pt15': 15,
                'pt16': 16,
                'pt17': 17,
                'pt18': 18,
                'pt19': 19,
                'pt20': 20,
                'pt21': 21,
                'pt22': 22,
                'pt23': 23,
                'pt24': 24,
                'pt25': 25,
                'pt26': 26,
                'pt27': 27,
                'pt28': 28,
                'pt29': 29,
                'pt30': 30,
                'pt31': 31,
                'pt32': 32,
                'pt33': 33,
                'pt34': 34,
                'pt35': 35,
                'pt36': 36,
                'pt37': 37,
                'pt38': 38,
                'pt39': 39,
                'pt40': 40,
                'pt41': 41,
                'pt42': 42,
                'pt43': 43,
                'pt44': 44
            }
        }
    })

    //GZB/LDC:
    //--common room
    loadSpriteAtlas('/Assets/rooms/classroom_ldc.png', {
        'ldc-room':{x: 0, y: 0, width: 288, height: 160, sliceX: 9, sliceY: 5, 
            anims: {
                'pt0': 0,
                'pt1': 1,
                'pt2': 2,
                'pt3': 3,
                'pt4': 4,
                'pt5': 5,
                'pt6': 6,
                'pt7': 7,
                'pt8': 8,
                'pt9': 9,
                'pt10': 10,
                'pt11': 11,
                'pt12': 12,
                'pt13': 13,
                'pt14': 14,
                'pt15': 15,
                'pt16': 16,
                'pt17': 17,
                'pt18': 18,
                'pt19': 19,
                'pt20': 20,
                'pt21': 21,
                'pt22': 22,
                'pt23': 23,
                'pt24': 24,
                'pt25': 25,
                'pt26': 26,
                'pt27': 27,
                'pt28': 28,
                'pt29': 29,
                'pt30': 30,
                'pt31': 31,
                'pt32': 32,
                'pt33': 33,
                'pt34': 34,
                'pt35': 35,
                'pt36': 36,
                'pt37': 37,
                'pt38': 38,
                'pt39': 39,
                'pt40': 40,
                'pt41': 41,
                'pt42': 42,
                'pt43': 43,
                'pt44': 44
            }
        }
    })

    //ABB/OB:
    //--common room
    loadSpriteAtlas('/Assets/rooms/classroom_ob.png', {
        'ob-room':{x: 0, y: 0, width: 288, height: 160, sliceX: 9, sliceY: 5, 
            anims: {
                'pt0': 0,
                'pt1': 1,
                'pt2': 2,
                'pt3': 3,
                'pt4': 4,
                'pt5': 5,
                'pt6': 6,
                'pt7': 7,
                'pt8': 8,
                'pt9': 9,
                'pt10': 10,
                'pt11': 11,
                'pt12': 12,
                'pt13': 13,
                'pt14': 14,
                'pt15': 15,
                'pt16': 16,
                'pt17': 17,
                'pt18': 18,
                'pt19': 19,
                'pt20': 20,
                'pt21': 21,
                'pt22': 22,
                'pt23': 23,
                'pt24': 24,
                'pt25': 25,
                'pt26': 26,
                'pt27': 27,
                'pt28': 28,
                'pt29': 29,
                'pt30': 30,
                'pt31': 31,
                'pt32': 32,
                'pt33': 33,
                'pt34': 34,
                'pt35': 35,
                'pt36': 36,
                'pt37': 37,
                'pt38': 38,
                'pt39': 39,
                'pt40': 40,
                'pt41': 41,
                'pt42': 42,
                'pt43': 43,
                'pt44': 44
            }
        }
    })

    //--library
    loadSpriteAtlas('/Assets/rooms/libr.png', {
        'library':{x: 0, y: 0, width: 416, height: 160, sliceX: 13, sliceY: 5, 
            anims: {
                'pt0': 0,
                'pt1': 1,
                'pt2': 2,
                'pt3': 3,
                'pt4': 4,
                'pt5': 5,
                'pt6': 6,
                'pt7': 7,
                'pt8': 8,
                'pt9': 9,
                'pt10': 10,
                'pt11': 11,
                'pt12': 12,
                'pt13': 13,
                'pt14': 14,
                'pt15': 15,
                'pt16': 16,
                'pt17': 17,
                'pt18': 18,
                'pt19': 19,
                'pt20': 20,
                'pt21': 21,
                'pt22': 22,
                'pt23': 23,
                'pt24': 24,
                'pt25': 25,
                'pt26': 26,
                'pt27': 27,
                'pt28': 28,
                'pt29': 29,
                'pt30': 30,
                'pt31': 31,
                'pt32': 32,
                'pt33': 33,
                'pt34': 34,
                'pt35': 35,
                'pt36': 36,
                'pt37': 37,
                'pt38': 38,
                'pt39': 39,
                'pt40': 40,
                'pt41': 41,
                'pt42': 42,
                'pt43': 43,
                'pt44': 44,
                'pt45': 45,
                'pt46': 46,
                'pt47': 47,
                'pt48': 48,
                'pt49': 49,
                'pt50': 50,
                'pt51': 51,
                'pt52': 52,
                'pt53': 53,
                'pt54': 54,
                'pt55': 55,
                'pt56': 56,
                'pt57': 57,
                'pt58': 58,
                'pt59': 59,
                'pt60': 60,
                'pt61': 61,
                'pt62': 62,
                'pt63': 63,
                'pt64': 64
            }
        }
    })
}
//character spawn and movement
function spawnAvatar(player) {
    //cam positioning, follows character
    let tick = 0
    onUpdate(() => {
        camPos(player.pos)
        tick++
    })

    //to switch charac sprite depending on direction
    function setSprite(player, spriteName) {
        if (player.currentSprite !== spriteName) {
            player.use(sprite(spriteName))
            player.currentSprite = spriteName
        }
    }
//#region --player movement
    onKeyDown('down', () => {
        if (player.isInDialogue) return
        if(player.curAnim() !== 'd-walk'){
            setSprite(player, 'player-down')
            player.play('d-walk')
        }
        player.move(0, player.speed)
    })

    onKeyDown('up', () => {
        if (player.isInDialogue) return
        if (player.curAnim() !== 'u-walk'){
            setSprite(player, 'player-up')
            player.play('u-walk')
        }
        player.move(0, -player.speed)
    })

    onKeyDown('left', () => {
        if (player.isInDialogue) return
        if (player.curAnim() !== 'l-walk'){
            setSprite(player, 'player-left')
            player.play('l-walk')
        }
        player.move(-player.speed, 0)

    })

    onKeyDown('right', () => {
        if (player.isInDialogue) return
        if (player.curAnim() !== 'r-walk'){
            setSprite(player, 'player-right')
            player.play('r-walk')
        }
        player.move(player.speed, 0)
    })

    function stopMovement(){
        player.frame = 0
        player.stop()
    }
    
    onKeyRelease('down', stopMovement)

    onKeyRelease('up', stopMovement)

    onKeyRelease('left', stopMovement)

    onKeyRelease('right', stopMovement)
//#endregion
}
//screen transition
function flashScreen() {
    const flash = add([rect(1280, 960), color(10, 10, 10), fixed(), opacity(0), z(8)])
    tween(flash.opacity, 1, 0.5, (val) => flash.opacity = val, easings.easeInBounce)
}
//trigger transition to inside building
function onCollidewithPlayer(bldgName, player, mapState, inBldg, spawnPos){
    
    player.onCollide(bldgName, () => {
        flashScreen()
        setTimeout(() => {
            mapState.playerPos = spawnPos //player.pos
            mapState.bldgName = bldgName
            go(inBldg, mapState)
        }, 1000)
    })
}
//turn animation frames into tiles (for background)
function makeTile(spriteTag, type) {
    return [
        sprite(spriteTag),
        {type}
    ];
}

function showBuildingName(tick,x1,x2,y1,y2,player,textName,position){
    onUpdate(()=>{
        
        if ((camPos(player.pos).x >= x1 && camPos(player.pos).x < x2) && (camPos(player.pos).y >= y1 && camPos(player.pos).y < y2)){
            console.log(textName)
            if(tick === 1) {
                add([
                    pos(position[0], position[1]),
                    rect(300,100, {radius: 20}),
                    z(4),
                    opacity(0.5),
                    color(255,255,255),
                    textName+"-rec",
                ]);
                add([ // CECS
                    pos(position[0], position[1]+35),
                    text(textName, {
                        size: 25,
                        width: 300,
                        height: 100, 
                        font: "consolas",
                        align: "center", 
                    }),
                    z(5),
                    color(0,0,0),
                    textName+'-name',
                ])
                
            }

        }else{
            tick = 0
            destroyAll(textName+`-rec`)
            destroyAll(textName+`-name`)
        }
        tick++;
    })
}

function showFloorName(created,textName){
    created = true;        
    if(created) {
            add([
                pos(10,10),
                rect(320,100, {radius: 20}),
                z(4),
                opacity(0.1),
                color(255,255,255),
                textName+"-rec",
                fixed(),
            ]);
            add([ 
                pos(15, 30),
                text(textName, {
                    size: 25,
                    width: 305,
                    height: 100, 
                    font: "consolas",
                    //weight: "bold",
                    align: "center", 
                }),
                z(5),
                color(255,255,255),
                textName+'-name',
                fixed(),
            ])
            
    } else{
        created = false; 
        destroyAll(textName+`-rec`)
        destroyAll(textName+`-name`)
    }

}
function showRoomName(floorNames,roomList,position,positionMinus){// -neg to go far, +pos to go near
    let values = [];
    // This Filters out those floors that are exclusive to the specific building
    roomList = roomList.filter(room=> {
        for(let i = 0; i < floorNames.length; i++){
            //console.log(floorNames[i].floor_id)
            if(floorNames[i].floor_id === room.floor_id){
                return true;
            }
        }
    });
    newRoomListFiltered = []

    // This Sorts or Arrange all the Rooms depending on the arrangement of its coordinates.
    // Sowi na if complicated, ang criptic masyado || Time complexity wise, ndi sha goods pero as long as it works it works!!!!!!
    for (let i = 0; i < position.length; i++) {
        for (let j = 0; j < position[i].length; j++) {
            for (let k = 0; k < roomList.length; k++) {
                //console.log(`${position[i][j][0]},${position[i][j][1]}`,roomList[k].room_image)
                if(`${position[i][j][0]},${position[i][j][1]}` === roomList[k].room_image){
                    newRoomListFiltered.push(roomList[k]);
                    break;
                }
            }
        }   
    }
    //console.log(roomList[0],newRoomListFiltered,roomList.floor_id,floorNames)


    let k = 0;
    // This is for the creation of the placards or rooms names
    for (let i = 0; i < position.length; i++) {
        for (let j = 0; j < position[i].length; j++) {
            let roomNamePlacard = `${newRoomListFiltered[k].room_name}\n[${newRoomListFiltered[k].room_purpose}]`
            //console.log(roomNamePlacard)
            //console.log(position[i][j][0],position[i][j][1])
            add([
                pos(position[i][j][0]-(positionMinus[0]),position[i][j][1]-(positionMinus[1])),
                rect(200,70, {radius: 10}),
                z(4),
                opacity(0.8),
                color(Color.fromHex("#65000E")),
                roomNamePlacard+"-rec",
            ]);
            add([ 
                pos(position[i][j][0]-(positionMinus[0]),position[i][j][1]-(positionMinus[1]-15)),
                text(roomNamePlacard, {
                    size: 13,
                    width: 200,
                    height: 70, 
                    font: "sans-serif",
                    align: "center", 
                }),
                z(5),
                color(255,255,255),
                roomNamePlacard+'-name'+`-${newRoomListFiltered[k].room_id}`,
            ])

            // For room scene coordinates
            if(floorNames[0].bldg_id === 1){ // For cecs only since diff coords
                add([ 
                    // Position of Coordinates
                    pos(position[i][j][0]+20,position[i][j][1]-190),
                    rect(90,70),
                    area(),
                    body({isStatic:true}),
                    z(5),
                    opacity(0),
                    color(255,255,255),
                    `${newRoomListFiltered[k].room_name}-w-${newRoomListFiltered[k].room_purpose}-w-${position[i][j][0]},${position[i][j][1]}`,
                ])

            } else { // Other buildings
                add([ 
                    // Position of Coordinates
                    pos(position[i][j][0]+20,position[i][j][1]-50),
                    rect(90,70),
                    area(),
                    body({isStatic:true}),
                    z(5),
                    opacity(0),
                    color(255,255,255),
                    `${newRoomListFiltered[k].room_name}-w-${newRoomListFiltered[k].room_purpose}-w-${position[i][j][0]},${position[i][j][1]}`,
                ])
            }
            values.push({insideRoom: `${newRoomListFiltered[k].room_name}-w-${newRoomListFiltered[k].room_purpose}-w-${position[i][j][0]},${position[i][j][1]}`})


            k++;
        }
        
    } 
    
    // For npc scene coordinates
    // if quest. == npc else, 
    // if roomNamePlacard+'-name'+`-${newRoomListFiltered[k].room_id}`

    

 
    for(let i = 0; i < questTempContainer.length;i++){

        //console.log("ssd",questTempContainer[i].indentifier)
        let desigNpc = questTempContainer[i].designation.toString();
        let coorNpc =  desigNpc[2]+desigNpc[3]+desigNpc[4]+desigNpc[5];
        let floorDesig =  desigNpc[0]+"00"+desigNpc[1] ;
        //console.log("flrs",floorDesig,`${newRoomListFiltered}`,newRoomListFiltered.some(e => e.floor_id === parseInt(floorDesig)))
        //console.log("djaksdj",questTempContainer[i].indentifier)
        //console.log("sdaaaaaaaaa",questTempContainer[i].indentifier)
        // console.log("codsada",parseInt(coorNpc),position[i][j][1],`${questTempContainer[i].indentifier}`.replace("-drawing",""))
        let yCO = 3001;


        if(floorDesig[3] === "1"){
            yCO = 3744;
        }else if(floorDesig[3] === "2"){
            yCO = 2848;
        }else if(floorDesig[3] === "3"){
            yCO = 1952;
        }else if(floorDesig[3] === "4"){
            yCO = 1056;
        }else if(floorDesig[3] === "5"){
            yCO = 150;
        }

        // If NPC Quest
        if(questTempContainer[i].indentifier !== "room" && newRoomListFiltered.some(e => e.floor_id === parseInt(floorDesig)))  {
            //console.log("console.log(questTempContainer[i].indentifier)",questTempContainer[i].indentifier,`${questTempContainer[i].indentifier}`.replace("-drawing",""))
            add([ 
                // Position of Coordinates 
                sprite(`${questTempContainer[i].indentifier}`.replace("-drawing","")),
                pos(parseInt(coorNpc),yCO), 
                area(),
                body({isStatic:true}),
                scale(4),               
                z(5),
                `${questTempContainer[i].indentifier}`.replace("-drawing","")+'-interaction'+`-w-${questTempContainer[i].quest_type}-w-${questTempContainer[i].quest_id}`,                    
            ])
            values.push({interaction: `${questTempContainer[i].indentifier}`.replace("-drawing","")+'-interaction'+`-w-${questTempContainer[i].quest_type}-w-${questTempContainer[i].quest_id}`, question : questTempContainer[i].question, choices :questTempContainer[i].choices})
        }
        // If Room Quest
        else if(questTempContainer[i].indentifier === "room" && newRoomListFiltered.some(e => e.floor_id === parseInt(floorDesig))) {
            //console.log("dsssssss",desigNpc[0],desigNpc[1],questTempContainer[i].designation)
            add([ 
                // Position of Coordinates
                rect(50,50),
                pos(parseInt(coorNpc),yCO), 
                rect(90,70),
                area(),
                body({isStatic:true}),
                z(5),
                color(255,255,255),
                `${questTempContainer[i].designation}`+'-interaction'+`-w-${questTempContainer[i].quest_type}-w-${questTempContainer[i].quest_id}`
            ])
            values.push({interaction : `${questTempContainer[i].designation}`+'-interaction'+`-w-${questTempContainer[i].quest_type}-w-${questTempContainer[i].quest_id}`, question : questTempContainer[i].question, choices :questTempContainer[i].choices})
        }  
        //console.log("interaction",`${`${questTempContainer[i].indentifier}`.replace("-drawing","")}`+'-interaction',`${questTempContainer[i].designation}`+'-interaction')  
    }     

    return values;
}

//btn from kaboom
function addButton(txt, p, f) {

	// add a parent background object
	const btn = add([
		rect(240, 80, { radius: 8 }),
		pos(p),
		area(),
		scale(1),
		anchor("center"),
		outline(4),
	])

	// add a child object that displays the text
	btn.add([
		text(txt),
		anchor("center"),
		color(0, 0, 0),
	])

	// onHoverUpdate() comes from area() component
	// it runs every frame when the object is being hovered
	btn.onHover(() => {
		
		btn.color = (Color.fromHex("#c92c3c"))
		btn.scale = vec2(1.05)
		setCursor("pointer")
	})

	// onHoverEnd() comes from area() component
	// it runs once when the object stopped being hovered
	btn.onHoverEnd(() => {
		btn.scale = vec2(1)
		btn.color = rgb()
        setCursor("default")
	})

	// onClick() comes from area() component
	// it runs once when the object is clicked
	btn.onClick(f)

	return btn

}

//for selections
let objBorder;    
function hoveredSelect(objBorder, objPos){
    objBorder = add([
            pos(objPos),
            rect(32, 32),
            color("#FFFFFF"),
            opacity(0.2),
            area(),
            scale(6),
            z(1),
            "hoverselect"
        ])
}    
function clickedSelect(objPos){
    objBorder = add([
        pos(objPos),
        rect(32, 32),
        color("#FFFFFF"),
        opacity(0.5),
        outline(1, Color.fromHex("#FFFFFF")),
        area(),
        scale(6),
        z(1),
        "clickedselect"
    ])
}

//dialogue
function displayDialogue(player, dgContent){
    player.isInDialogue = true
    const dgBoxFixedContainer = add([fixed(), z(7)])
    const dgBox  = dgBoxFixedContainer.add([
        rect(1000, 200, {radius: 50}),
        outline(5),
        pos(150, 720),
        fixed()
    ])
    const content = dgBox.add([
        text('', {
            size: 42, 
            width: 900,
            lineSpacing: 15
        }),
        color(10, 10, 10),
        pos(40, 30),
        fixed()
    ])
    const pressSpace = dgBox.add([
        text('(Press space to continue)', {
            size: 24,
            width: 450
        }),
        color(Color.fromHex('#9a9a9a')),
        pos(350, 160),
        fixed()
    ])

    content.text = dgContent

    onUpdate(() => {
        if(isKeyDown('space')){
            destroy(dgBox)
            player.isInDialogue = false
        }
    })

}

function displayDay(){
    if(dayCounter >= 0 && dayCounter <= 4){
        add([
            text(`Day: ${day[dayCounter]}day`, {
                size: 32
            }),
            pos (center().x + 380, 20),
            fixed(),
            z(7)
        ])

        add([
            rect(265, 50, {radius: 15}),
            pos(center().x + 370, 10),
            color(Color.fromHex('#ffffff')),
            opacity(.2),
            z(6),
            fixed()
        ])
    }
}
function displayAttireDesig(){
    if (dayCounter === 0 || dayCounter === 3 || dayCounter === 4){
        add([
            text('Your attire for today is your school uniform.', {
                size: 7
            }),
            scale(4),
            pos(200, 150),
            fixed()
        ])
    } else if (dayCounter === 1){
        add([
            text('Your attire for today is your PE uniform.', {
                size: 7
            }),
            scale(4),
            pos(200, 150),
            fixed()
        ])
    } else if (dayCounter === 2){
        add([
            text('Your attire for today is any of your organization shirts.', {
                size: 7
            }),
            scale(4),
            pos(200, 150),
            fixed()
        ])
    }
}

setCursor("default")
loadAssets()

//------------------------------------------------------------BEDROOM SCENE FUNCS-----------------------------------------------------------

function introBedroom(){
    setBackground(Color.fromHex('#102043'))
    console.log("your avatar is: ", avatar)
    //loadCharSprite(avatar, garment)
    const bedroom = [
        addLevel([//inside bedroom
        '                      ',
        ' 01234                ',
        ' 56789                ',
        ' !@#$%                ',
        '                      '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                '0': () => makeTile('bedroom',''),
                '1': () => makeTile('bedroom','wall2'),
                '2': () => makeTile('bedroom','wall3'),
                '3': () => makeTile('bedroom','wall4'),
                '4': () => makeTile('bedroom','wall5'),
                '5': () => makeTile('bedroom','flr1'),
                '6': () => makeTile('bedroom','flr2'),
                '7': () => makeTile('bedroom','flr3'),
                '8': () => makeTile('bedroom','flr4'),
                '9': () => makeTile('bedroom','flr5'),
                '!': () => makeTile('bedroom','flr6'),
                '@': () => makeTile('bedroom','flr7'),
                '#': () => makeTile('bedroom','flr8'),
                '$': () => makeTile('bedroom','flr9'),
                '%': () => makeTile('bedroom', 'flr10')

            }
        }),
        addLevel([//collision
        '    00000                ',
        '    33333                ',
        '   8 ||  0               ',
        '   8     9               ',
        '    00000                '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                '0': () => [//whole tile 
                    area({shape: new Rect(vec2(0), 31, 31), 
                    offset: vec2(0, 0)}),
                    body({isStatic: true})
                ],
                '9': () => [//right offset whole tile 
                    area({shape: new Rect(vec2(0), 31, 31), 
                    offset: vec2(5, 0)}),
                    body({isStatic: true})
                ],
                '8': () => [//left offset whole tile 
                    area({shape: new Rect(vec2(0), 31, 31), 
                    offset: vec2(-5, 0)}),
                    body({isStatic: true})
                ],
                '|': () => [//closet collision
                    area({shape: new Rect(vec2(0), 1, 16), 
                        offset: vec2(-20, -20)}),
                    body({isStatic: true})
                ],
                '3': () => [//ceiling collision
                    area({shape: new Rect(vec2(0), 32, 16), 
                        offset: vec2(0, -5)}),
                    body({isStatic: true})
                ]
                
            }
        })
    ]

    for (const layer of bedroom) {
        layer.use(scale(6))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }

    
    let contentCounter = 0
    const tutorialbox = add([sprite('tutorialbox'), pos(20, 50), scale(6), fixed(), z(5),
        {
            isVisible : true  
        }
    ])
    function updateContent(){
            const contenttxt = tboxContentList[contentCounter]
            tboxContent.text = contenttxt
            console.log("ct:", contenttxt, ", isV:", tutorialbox.isVisible, "counter:", contentCounter)
    }
    const tboxContentList = [
        "Hey there, freshman! Welcome to The Campus Chronicles, your ticket to navigating the twists and turns of campus life. Get ready to meet NPCs, tackle quests, and become a master at finding your way around.", 
        "Alright, let's get you up to speed on how to maneuver your character for later on.\nUse the arrow keys to cruise around our campus. Just tap up, down, left, or right to zip in that direction. Explore every nook and cranny to score cool finds and insider info. Try pressing your keys!", 
        "Time to pick your threads! Checkout your closet to pick out your uniform. Remember, different days call for different attires, so choose wisely!", 
        "Ready for some action, Red Spartan? As you wander, you'll bump into NPCs. Approach them to interact—solve puzzles, answer questions, and poke around the campus.", 
        "Finding your way around the campus maze can be a head-scratcher, but don't sweat it! When you're inside a building, keep going right to head up and left to head down. Keep an eye out for signs to point you in the right direction.",
        ""
    ]
    const tboxContent = tutorialbox.add([
        text('', {
            size: 6, 
            width: 175,
            lineSpacing: 5,
            align: "center",
        }),
        color(Color.fromHex('#ffffff')),
        pos(15, 20),
        fixed(),
        'tboxcontent'
    ])
    const pressSpace = tutorialbox.add([
        text('(Press space to continue)', {
            size: 3.5,
            width: 175,
            align: "center"
        }),
        color(Color.fromHex('#ffffff')),
        opacity(0.5),
        pos(15, 130),
        fixed()
    ])

    //tutorial images (arrows are interactive)
    let arrowleft, arrowright, arrowup, arrowdown;
    let leftbox, rightbox, upbox, downbox;
    let ready, unif1, unif2, npc, npcquest;
    function addArrows(tutorialbox){
        arrowleft = tutorialbox.add([
            text('←', {
                size: 10, 
                width: 175,
                lineSpacing: 5,
            }),
            color(Color.fromHex('#ffffff')),
            pos(80, 110),
            fixed(),
            opacity(),
            fadeIn(0.5)
        ])
        arrowright = tutorialbox.add([
            text('→', {
                size: 10, 
                width: 175,
                lineSpacing: 5,
            }),
            color(Color.fromHex('#ffffff')),
            pos(arrowleft.pos.x + 40, 110),
            fixed(),
            opacity(),
            fadeIn(0.5)        
        ])
        arrowup = tutorialbox.add([
            text('↑', {
                size: 10, 
                width: 175,
                lineSpacing: 5,
            }),
            color(Color.fromHex('#ffffff')),
            pos(arrowleft.pos.x + 20, 90),
            fixed(),
            opacity(),
            fadeIn(0.5)
        ])
        arrowdown = tutorialbox.add([
            text('↓', {
                size: 10, 
                width: 175,
                lineSpacing: 5,
            }),
            color(Color.fromHex('#ffffff')),
            pos(arrowleft.pos.x + 20, 110),
            fixed(),
            opacity(),
            fadeIn(0.5)
        ])  
        onKeyPress('left', ()=> {
            if(contentCounter > 1) return
            leftbox = tutorialbox.add([
                rect(15, 15, {radius: 2}),
                opacity(.3),
                z(tutorialbox.z + 1),
                pos(arrowleft.pos.x + -5, arrowleft.pos.y - 2.5), 
                fixed()
            ])
        })
        onKeyRelease('left', ()=>{
            if(contentCounter > 1) return
            destroy(leftbox)
        })
        onKeyPress('right', ()=> {
            if(contentCounter > 1) return
            rightbox = tutorialbox.add([
                rect(15, 15, {radius: 2}),
                opacity(.3),
                z(tutorialbox.z + 1),
                pos(arrowright.pos.x + -5, arrowright.pos.y - 2.5), 
                fixed()
            ])
        })
        onKeyRelease('right', ()=>{
            if(contentCounter > 1) return
            destroy(rightbox)
        })
        onKeyPress('up', ()=> {
            if(contentCounter > 1) return
            upbox = tutorialbox.add([
                rect(15, 15, {radius: 2}),
                opacity(.3),
                z(tutorialbox.z + 1),
                pos(arrowup.pos.x + -5, arrowup.pos.y - 2.5), 
                fixed()
            ])
        })
        onKeyRelease('up', ()=>{
            if(contentCounter > 1) return
            destroy(upbox)
        })
        onKeyPress('down', ()=> {
            if(contentCounter > 1) return
            downbox = tutorialbox.add([
                rect(15, 15, {radius: 2}),
                opacity(.3),
                z(tutorialbox.z + 1),
                pos(arrowdown.pos.x + -5, arrowdown.pos.y - 2.5), 
                fixed()
            ])
        })
        onKeyRelease('down', ()=>{
            if(contentCounter > 1) return
            destroy(downbox)
        })
    }
    if(contentCounter === 0){
        ready = tutorialbox.add([
            text(' Are you pumped to dive in, \nRed Spartan?', {
                size: 10, 
                width: 175,
                lineSpacing: 5,
                align: 'center'
            }),
            color(Color.fromHex('#ffffff')),
            pos(15, 85),
            fixed(),
            opacity(),
            fadeIn(1)
        ])
        console.log("counter is 0!")
    }
    onKeyPress('space', ()=>{
        destroy(ready)
        contentCounter++
        if(contentCounter < tboxContentList.length){
            updateContent()
        }
        if(contentCounter === 1){
            console.log("counter is 1!")
            addArrows(tutorialbox)
        } else {
            destroy(arrowleft)
            destroy(arrowright)
            destroy(arrowup)
            destroy(arrowdown)
        }

        if(contentCounter === 2){
            console.log("counter is 2")
            unif1 = tutorialbox.add([
                sprite('men_school_unif'),
                pos(90, 50),
                fixed(),
                scale(2),
                opacity(),
                fadeIn(0.2),
                rotate(10)
            ])
            unif2 = tutorialbox.add([
                sprite('tech_is_set'),
                pos(55, 70),
                fixed(),
                scale(2),
                opacity(),
                fadeIn(0.2),
                rotate(-10)
            ])
        } else if (contentCounter > 2){
            destroy(unif1)
            destroy(unif2)
        }

        if(contentCounter === 3){
            console.log("counter is 3")
            npc = tutorialbox.add([
                sprite('sir.tiquio'),
                pos(72, 65),
                color(Color.fromHex('#202020')),
                fixed(),
                scale(2),
                opacity(),
                fadeIn(0.5)
            ])
            npcquest = tutorialbox.add([
                text('!', {
                    size: 20, 
                    width: 175
                }),
                pos(120, 65),
                color(Color.fromHex('#000000')),
                fixed(),
                opacity(),
                fadeIn(0.5)
            ])
        } else if (contentCounter > 3){
            destroy(npc)
            destroy(npcquest)
        }

        if(contentCounter === 4){
            arrowleft = tutorialbox.add([
                text('←', {
                    size: 10, 
                    width: 175,
                    lineSpacing: 5,
                }),
                color(Color.fromHex('#ffffff')),
                pos(80, 110),
                fixed(),
                opacity(),
                fadeIn(0.5)
            ])
            arrowright = tutorialbox.add([
                text('→', {
                    size: 10, 
                    width: 175,
                    lineSpacing: 5,
                }),
                color(Color.fromHex('#ffffff')),
                pos(arrowleft.pos.x + 40, 110),
                fixed(),
                opacity(),
                fadeIn(0.5)        
            ])
            onKeyPress('left', ()=> {
                if(contentCounter > 4) return
                leftbox = tutorialbox.add([
                    rect(15, 15, {radius: 2}),
                    opacity(.3),
                    z(tutorialbox.z + 1),
                    pos(arrowleft.pos.x + -5, arrowleft.pos.y - 2.5), 
                    fixed()
                ])
            })
            onKeyRelease('left', ()=>{
                if(contentCounter > 4) return
                destroy(leftbox)
            })
            onKeyPress('right', ()=> {
                if(contentCounter > 4) return
                rightbox = tutorialbox.add([
                    rect(15, 15, {radius: 2}),
                    opacity(.3),
                    z(tutorialbox.z + 1),
                    pos(arrowright.pos.x + -5, arrowright.pos.y - 2.5), 
                    fixed()
                ])
            })
            onKeyRelease('right', ()=>{
                if(contentCounter > 4) return
                destroy(rightbox)
            })
        }

        if(contentCounter === 5){
            //"Now, choose your preferred character!"
            ready = tutorialbox.add([
                text('Now, choose your preferred character!', {
                    size: 10, 
                    width: 175,
                    lineSpacing: 5,
                    align: 'center'
                }),
                color(Color.fromHex('#ffffff')),
                pos(15, 60),
                fixed(),
                opacity(),
                fadeIn(1)
            ])
        }
        
        if(contentCounter === tboxContentList.length){
            destroy(tutorialbox)
            tutorialbox.isVisible = false
            console.log("counter", contentCounter, " reached length: ", tboxContentList.length, " tbox is visible?: ", tutorialbox.isVisible)
        
            const yuhgie = add([sprite('yuhgie'), scale(6), area(), pos(450, 460), z(2)])
            const baddi = add([sprite('baddi'), scale(6), area(), pos(750, 460), z(2)])
        
            //character select 
            yuhgie.onHover(() => {
                setCursor("pointer")
                hoveredSelect(objBorder, yuhgie.pos)
            })
            yuhgie.onClick(() => {
                destroyAll("clickedselect")
                clickedSelect(yuhgie.pos)
                avatar = "boy"
                console.log("your avatar is: ", avatar)
            })
            yuhgie.onHoverEnd(() => {
                setCursor("default")
                destroyAll("hoverselect")
            })

            baddi.onHover(() => {
                setCursor("pointer")
                hoveredSelect(objBorder, baddi.pos)
            })
            baddi.onClick(() => {
                destroyAll("clickedselect")
                clickedSelect(baddi.pos)
                avatar = "girl"
                console.log("your avatar is: ", avatar)
            })
            baddi.onHoverEnd(() => {
                setCursor("default")
                destroyAll("hoverselect")
            })
        }
    })       
    updateContent();
    addButton("Confirm", vec2(1030, 820), () => {
        loadCharSprite(avatar, garment)
        console.log("confirmed: ", avatar)

        flashScreen()
        setTimeout(() => {
            window.location = `${url}${userId}`;
            if(avatar === "girl") {
                postJSON({type: "avatar",avatar : 2},userId)
            }else if(avatar === "boy") {
                postJSON({type: "avatar",avatar : 1},userId)
            }
            go('inBedroom')
        }, 1000)
    })
}

function setBedroom(mapState){
    questCounter = 0;
    setBackground(Color.fromHex('#102043'))
    displayDay()
    console.log("your avatar is: ", avatar)
    //loadCharSprite(avatar, garment)
    console.log(avatar, "&", garment)
    const bedroom = [
        addLevel([//inside bedroom
        '                         ',
        '    01234                ',
        '    56789                ',
        '    !@#$%                ',
        '                         '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                '0': () => makeTile('bedroom',''),
                '1': () => makeTile('bedroom','wall2'),
                '2': () => makeTile('bedroom','wall3'),
                '3': () => makeTile('bedroom','wall4'),
                '4': () => makeTile('bedroom','wall5'),
                '5': () => makeTile('bedroom','flr1'),
                '6': () => makeTile('bedroom','flr2'),
                '7': () => makeTile('bedroom','flr3'),
                '8': () => makeTile('bedroom','flr4'),
                '9': () => makeTile('bedroom','flr5'),
                '!': () => makeTile('bedroom','flr6'),
                '@': () => makeTile('bedroom','flr7'),
                '#': () => makeTile('bedroom','flr8'),
                '$': () => makeTile('bedroom','flr9'),
                '%': () => makeTile('bedroom', 'flr10')

            }
        }),
        addLevel([//collision
        '    00000                ',
        '    33333                ',
        '   8 ||  0               ',
        '   8     9               ',
        '    00000                '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                '0': () => [//whole tile 
                    area({shape: new Rect(vec2(0), 31, 31), 
                    offset: vec2(0, 0)}),
                    body({isStatic: true})
                ],
                '9': () => [//right offset whole tile 
                    area({shape: new Rect(vec2(0), 31, 31), 
                    offset: vec2(5, 0)}),
                    body({isStatic: true})
                ],
                '8': () => [//left offset whole tile 
                    area({shape: new Rect(vec2(0), 31, 31), 
                    offset: vec2(-5, 0)}),
                    body({isStatic: true})
                ],
                '|': () => [//closet collision
                    area({shape: new Rect(vec2(0), 1, 16), 
                        offset: vec2(-20, -20)}),
                    body({isStatic: true})
                ],
                '3': () => [//ceiling collision
                    area({shape: new Rect(vec2(0), 32, 16), 
                        offset: vec2(0, -5)}),
                    body({isStatic: true})
                ]
                
            }
        })
    ]

    for (const layer of bedroom) {
        layer.use(scale(6))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }
    
    //closet trigger 
    add([area({shape: new Rect(vec2(0, 0), 16, 20)}), body({isStatic: true}), pos(890, 250), scale(6), 'openCloset-trigg'])
   
    //to-campus trigger
    const toCampus = add([area({shape: new Rect(vec2(0, 0), 5, 32)}), body({isStatic: true}), pos(1720, 576), scale(6), 'toCampus-trigg'])
   
    //player
    const player = add([
        sprite('player-down'),
        pos(1230, 530),
        scale(6),
        z(2),
        area(), //for smaller collision: {shape: new Rect(vec2(0, 6), 16, 16)}, anchor("center")
        body(),
        {
            currentSprite: 'player-down',
            currentGarment : garment,
            speed: 350,
            isInDialogue: false
        }
        
    ])
    spawnAvatar(player)

    if (!mapState){
        mapState = {
            playerPos: player.pos
        }
    }

    player.pos = vec2(mapState.playerPos)
                                                        
    onCollidewithPlayer('openCloset-trigg', player, mapState, 'openedCloset')

    //check if charac is wearing uniform before heading to campus
    if(garment !== "default"){
        if(dayCounter === 0 || dayCounter === 3 || dayCounter == 4){
            if(garment === "uniform"){
                onCollidewithPlayer('toCampus-trigg', player, mapState, 'bsu-map', vec2(2050, 2820))
            } else {
                player.onCollide('toCampus-trigg', ()=> {
                    displayDialogue(player, "(Double check your attire.)")
                })
            }
        }
        
        if (dayCounter === 1){
            if(garment === "pe"){
                onCollidewithPlayer('toCampus-trigg', player, mapState, 'bsu-map', vec2(2050, 2820))
            } else {
                player.onCollide('toCampus-trigg', ()=> {
                    displayDialogue(player, "(Double check your attire.)")
                })
            }
        }
        if (dayCounter === 2){
            if(garment === "jpcs" || garment === "techis"){
                onCollidewithPlayer('toCampus-trigg', player, mapState, 'bsu-map', vec2(2050, 2820))
            } else if (garment === "uniform"){
                onCollidewithPlayer('toCampus-trigg', player, mapState, 'bsu-map', vec2(2050, 2820))
            } else {
                player.onCollide('toCampus-trigg', ()=> {
                    displayDialogue(player, "(Double check your attire.)")
                })
            }
        }
        
    } else {
        player.onCollide('toCampus-trigg', ()=> {
            displayDialogue(player, "(Please wear clothes for school.)")
        })
    }
}

function setCloset(mapState){
    setBackground(Color.fromHex('#101010'))
    displayAttireDesig()
    const closet = [
        addLevel([//inside of closet
        '                      ',
        ' 01234                ',
        ' 56789                ',
        ' !@#$%                ',
        '                      '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                '0': () => makeTile('closet',''),
                '1': () => makeTile('closet','1'),
                '2': () => makeTile('closet','2'),
                '3': () => makeTile('closet','3'),
                '4': () => makeTile('closet','4'),
                '5': () => makeTile('closet','5'),
                '6': () => makeTile('closet','6'),
                '7': () => makeTile('closet','7'),
                '8': () => makeTile('closet','8'),
                '9': () => makeTile('closet','9'),
                '!': () => makeTile('closet','10'),
                '@': () => makeTile('closet','11'),
                '#': () => makeTile('closet','12'),
                '$': () => makeTile('closet','13'),
                '%': () => makeTile('closet', '14')

            }
        })
    ]
    
    for (const layer of closet) {
        layer.use(scale(6))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }

    //school uniform --depends on avatar gender
    let avatar_gender = (avatar === "boy") ? "men" : "women";
    const school_unif = add([sprite(`${avatar_gender}_school_unif`), scale(6), area(), pos(450, 250), z(2),
    ])
    school_unif.onHover(() => {
        setCursor("pointer")
        hoveredSelect(objBorder, school_unif.pos)
    })
    school_unif.onClick(() => {
        destroyAll("clickedselect")
        clickedSelect(school_unif.pos)
        garment = "uniform"
        console.log(garment)
    })
    school_unif.onHoverEnd(() => {
        setCursor("default")
        destroyAll("hoverselect")
    })

    //pe uniform
    const pe_unif = add([sprite('pe_uniform'), scale(6), area(), pos(450, 500), z(2)])
    pe_unif.onHover(() => {
        setCursor("pointer")
        hoveredSelect(objBorder, pe_unif.pos)
    })
    pe_unif.onClick(() => {
        destroyAll("clickedselect")
        clickedSelect(pe_unif.pos)
        garment = "pe"
        console.log(garment)
    })
    pe_unif.onHoverEnd(() => {
        setCursor("default")
        destroyAll("hoverselect")
    })

    //techis set
    const techis_set = add([sprite('tech_is_set'), scale(6), area(), pos(700, 250), z(2)])
    techis_set.onHover(() => {
        setCursor("pointer")
        hoveredSelect(objBorder, techis_set.pos)
    })
    techis_set.onClick(() => {
        destroyAll("clickedselect")
        clickedSelect(techis_set.pos)
        garment = "techis"
        console.log(garment)
    })
    techis_set.onHoverEnd(() => {
        setCursor("default")
        destroyAll("hoverselect")
    })

    //jpcs set
    const jpcs_set = add([sprite('jpcs_set'), scale(6), area(), pos(700, 500), z(2)])
    jpcs_set.onHover(() => {
        setCursor("pointer")
        hoveredSelect(objBorder, jpcs_set.pos)
    })
    jpcs_set.onClick(() => {
        destroyAll("clickedselect")
        clickedSelect(jpcs_set.pos)
        garment = "jpcs"
        console.log(garment)
    })
    jpcs_set.onHoverEnd(() => {
        setCursor("default")
        destroyAll("hoverselect")
    })
    if(!mapState){
        mapState = {
            currentGarment : garment
        }
    }

    addButton("Confirm", vec2(1030, 820), () => {
        loadCharSprite(avatar, garment)
        console.log("confirmed: ", garment)
        flashScreen()
        setTimeout(() => {
            go('inBedroom')
        }, 1000)
    })
}

//-----------------------------------------------------------BSU MAP SCENE FUNCTION-------------------------------------------------------
function setMap(mapState){
    setBackground(Color.fromHex('#8e7762'))
    displayDay()
    //reset inbldg
    inBldg = ""
    console.log("You are outside", inBldg)
    const map = [
        addLevel([//ground
            '########################################',
            '######222<##############################',
            '######222<##############################',
            '######222<####  a  #####a   b bbbb  bb  ',
            ' #####222<####aab a#####baba ababab aba ',
            ' a####222<##> bb 2  <### bbb  a  b bb   ',
            '      222<#####  a  ##########>         ',
            '      222<#####    ###########>         ',
            '      222<##### b  ############>        ',
            '      222<#####    ############>        ',
            '      222{*****    ******#########      ',
            '      222...jkklijkkkkl22{*#########    ',
            '      222.. ooopmnoooop22  <####        ',
            '      222.. ddddefgh1  |.  <##>         ',
            '      222.. dd11b      #.  <##>         ',
            '      222.. ddbb      ##.  <##>         ',
            '      222.. ddd       ##.  <##>         ',
            '      222.. dd1       ##.  <##>         ',
            '      222...dd        **.  <##>         ',
            '      222..012222    10  01<##>         ',
            '      222..          ....[|###>         ',
            '      222..       .. ....{****}         ',
            '      222..1.1..1...01100100001         ',
            'cccccccccccccccccccccccccccccccccccccccc',
            'cccccccccccccccccccccccccccccccccccccccc',
            '                                        ',
            '........................................',
            '........................................',
            '........................................',
            '       aa  b  b              b          ',
            '         a b      bbbb                  ',
            '                                        '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                'a': () => makeTile('tile','dirtv1'),
                'b': () => makeTile('tile','dirtv2'),
                '0': () => makeTile('tile','dirtv1-sh'),
                '1': () => makeTile('tile','dirtv2-sh'),
                '2': () => makeTile('tile','dirtpath'),
                'c': () => makeTile('tile','concrete'),
                'd': () => makeTile('tile','groundtile'),
                'e': () => makeTile('tile','stair-pt1'),
                'f': () => makeTile('tile','stair-pt2'),
                'g': () => makeTile('tile','stair-pt3'),
                'h': () => makeTile('tile','stair-pt4'),
                'i': () => makeTile('tile','path-pt1'),
                'j': () => makeTile('tile','path-pt2'),
                'k': () => makeTile('tile','path-pt3'),
                'l': () => makeTile('tile','path-pt4'),
                'm': () => makeTile('tile','path-pt5'),
                'n': () => makeTile('tile','path-pt6'),
                'o': () => makeTile('tile','path-pt7'),
                'p': () => makeTile('tile','path-pt8'),
                '.': () => makeTile('tile','sparsegrass'),
                '[': () => makeTile('tile','grass-ul'),
                '|': () => makeTile('tile','grass-uc'),
                ']': () => makeTile('tile','grass-ur'),
                '<': () => makeTile('tile','grass-ml'),
                '#': () => makeTile('tile','grass-mc'),
                '>': () => makeTile('tile','grass-mr'),
                '{': () => makeTile('tile','grass-ll'),
                '*': () => makeTile('tile','grass-lc'),
                '}': () => makeTile('tile','grass-lr')

            }
        }),
        addLevel([//fence
            '          |                             ',
            '          |                             ',
            '          |                             ',
            '          |                             ',
            '          |                             ',
            '          |                             ',
            '          |                             ',
            '          |                             ',
            '          |                             ',
            '          |                             ',
            '          |                             ',
            '          |                             ',
            '          |                             ',
            '          |                             ',
            '          |                             ',
            '          |                             ',
            '          | ddd                         ',
            '          | dd1                         ',
            '          | dd                          ',
            '          |                             ',
            '          |                             ',
            '          []        #-==========        ',
            '           1.1..1...                    ',
            'cccccccccccccccccccccccccccccccccccccccc',
            'cccccccccccccccccccccccccccccccccccccccc',
            '                                        ',
            '    a    b     a  bb              a     ',
            '               a    b            b a    ',
            '      a     b     a           b    aaa  ',
            '       aa  b  b              b          ',
            '         a b      bbbb                  ',
            '                                        '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                ']': () => makeTile('tile','fence-xtra'),
                '|': () => makeTile('tile','fence'),
                '[': () => makeTile('tile','fence-corner'),
                '=': () => makeTile('tile','fence-whole'),
                '-': () => makeTile('tile','fence-gateside'),
                '#': () => makeTile('tile','big-gate')
            }
        }),
        addLevel([//bldgs
            '                                        ',
            '                                        ',
            '                                        ',
            '             ,/?;:<>                    ',
            '             |][}{()                    ',
            '                                        ',
            '                                        ',
            '                                        ',
            '             fghijkl                    ',
            '             mnopqrs                    ',
            '             tuvwxyz                    ',
            '               .                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '           12 !      &*  `@             ',
            '           34        -_  #$             ',
            '           56        =+  %^             ',
            '                                        ',
            '                                        ',
            '           7890abcde                    ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                '1': () => makeTile('tile',''),
                '2': () => makeTile('tile','cecs-pt2'),
                '3': () => makeTile('tile','cecs-pt3'),
                '4': () => makeTile('tile','cecs-pt4'),
                '5': () => makeTile('tile','cecs-pt5'),
                '6': () => makeTile('tile','cecs-pt6'),
                '7': () => makeTile('tile','fcd-pt1'),
                '8': () => makeTile('tile','fcd-pt2'),
                '9': () => makeTile('tile','fcd-pt3'),
                '0': () => makeTile('tile','fcd-pt4'),
                'a': () => makeTile('tile','fcd-pt5'),
                'b': () => makeTile('tile','fcd-pt6'),
                'c': () => makeTile('tile','fcd-pt7'),
                'd': () => makeTile('tile','fcd-pt8'),
                'e': () => makeTile('tile','fcd-pt9'),
                'f': () => makeTile('tile','heb-pt1'),
                'g': () => makeTile('tile','heb-pt2'),
                'h': () => makeTile('tile','heb-pt3'),
                'i': () => makeTile('tile','heb-pt4'),
                'j': () => makeTile('tile','heb-pt5'),
                'k': () => makeTile('tile','heb-pt6'),
                'l': () => makeTile('tile','heb-pt7'),
                'm': () => makeTile('tile','heb-pt8'),
                'n': () => makeTile('tile','heb-pt9'),
                'o': () => makeTile('tile','heb-pt10'),
                'p': () => makeTile('tile','heb-pt11'),
                'q': () => makeTile('tile','heb-pt12'),
                'r': () => makeTile('tile','heb-pt13'),
                's': () => makeTile('tile','heb-pt14'),
                't': () => makeTile('tile','heb-pt15'),
                'u': () => makeTile('tile','heb-pt16'),
                'v': () => makeTile('tile','heb-pt17'),
                'w': () => makeTile('tile','heb-pt18'),
                'x': () => makeTile('tile','heb-pt19'),
                'y': () => makeTile('tile','heb-pt20'),
                'z': () => makeTile('tile','heb-pt21'),
                '.': () => makeTile('tile','heb-xtra'),
                ',': () => makeTile ('tile','ldc-pt1'),
                '/': () => makeTile ('tile','ldc-pt2'),
                '?': () => makeTile ('tile','ldc-pt3'),
                ';': () => makeTile ('tile','ldc-pt4'),
                ':': () => makeTile ('tile','ldc-pt5'),
                '<': () => makeTile ('tile','ldc-pt6'),
                '>': () => makeTile ('tile','ldc-pt7'),
                '|': () => makeTile ('tile','ldc-pt8'),
                ']': () => makeTile ('tile','ldc-pt9'),
                '[': () => makeTile ('tile','ldc-pt10'),
                '}': () => makeTile ('tile','ldc-pt11'),
                '{': () => makeTile ('tile','ldc-pt12'),
                '(': () => makeTile ('tile','ldc-pt13'),
                ')': () => makeTile ('tile','ldc-pt14'),
                '`': () => makeTile ('tile','ob-pt1'),
                '@': () => makeTile ('tile','ob-pt2'),
                '#': () => makeTile ('tile','ob-pt3'),
                '$': () => makeTile ('tile','ob-pt4'),
                '%': () => makeTile ('tile','ob-pt5'),
                '^': () => makeTile ('tile','ob-pt6'),
                '&': () => makeTile ('tile','gym-pt1'),
                '*': () => makeTile ('tile','gym-pt2'),
                '-': () => makeTile ('tile','gym-pt3'),
                '_': () => makeTile ('tile','gym-pt4'),
                '=': () => makeTile ('tile','gym-pt5'),
                '+': () => makeTile ('tile','gym-pt6'),
                '!': () => makeTile ('tile','flag')
            }
        }),
        addLevel([//roof
            '                                        ',
            '             7888889                    ',
            '             0aaaaab                    ',
            '                                        ',
            '                                        ',
            '                                        ',
            '             7888889                    ',
            '             0aaaaab                    ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '           12            12             ',
            '           34        12  34             ',
            '           34        34  34             ',
            '           56        56  56             ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '           cdddddde                     ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            layer: "foreground",
            tiles: {
                '1': () => makeTile('tile','hroof-pt1'),
                '2': () => makeTile('tile','hroof-pt2'),
                '3': () => makeTile('tile','hroof-pt3'),
                '4': () => makeTile('tile','hroof-pt4'),
                '5': () => makeTile('tile','hroof-pt5'),
                '6': () => makeTile('tile','hroof-pt6'),
                '7': () => makeTile('tile','vroof-pt1'),
                '8': () => makeTile('tile','vroof-pt2'),
                '9': () => makeTile('tile','vroof-pt3'),
                '0': () => makeTile('tile','vroof-pt4'),
                'a': () => makeTile('tile','vroof-pt5'),
                'b': () => makeTile('tile','vroof-pt6'),
                'c': () => makeTile('tile','sroof-pt1'),
                'd': () => makeTile('tile','sroof-pt2'),
                'e': () => makeTile('tile','sroof-pt3')
            }
        }),
        addLevel([//collision
            '        000000000000000000000            ',
            '        0    0000000        0            ',
            '        0    0000000        0            ',
            '        0    0000000        0            ',
            '        0    3333 33        0            ',
            '        0   0       0       0            ',
            '        0    9000 90        0            ',
            '        0    9000000        0            ',
            '        0    9000000        0            ',
            '        0    90000000000000 0            ',
            '        0   03333333333  90 0            ',
            '        0  0             90 0            ',
            '        0  00            90 0            ',
            '        0  90--- 888890  90 0            ',
            '        0  90 908    90  90 0            ',
            '        0  90 9      90  90 0            ',
            '        0  90  |     90  90 0            ',
            '        0  90 9      90  90 0            ',
            '        0 081 2      80  81 0            ',
            '        0 0          999999 0            ',
            '        0 000000 900 9      0            ',
            '        003         333000000            ',
            '        0              0                 ',
            '        0              0                 ',
            '        0              0                 ',
            '        0              0                 ',
            '         00000000000000                  ',
            '                                         ',
            '                                         ',
            '                                         ',
            '                                         ',
            '                                         '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                '0': () => [//left whole tile 
                    area({shape: new Rect(vec2(0), 31, 31), 
                    offset: vec2(-7, 0)}),
                    body({isStatic: true})
                ],
                '9': () => [//right whole tile 
                    area({shape: new Rect(vec2(0), 31, 31), 
                    offset: vec2(7, 0)}),
                    body({isStatic: true})
                ],
                '1': () => [//left small horizontal tile 
                    area({shape: new Rect(vec2(0), 32, 4), 
                        offset: vec2(-7, -3)}),
                    body({isStatic: true})
                ],
                '-': () => [//left small h tile offset 
                    area({shape: new Rect(vec2(0), 32, 2), 
                        offset: vec2(-7, -9)}),
                    body({isStatic: true})
                ],
                '8': () => [//right small horizontal tile 
                    area({shape: new Rect(vec2(0), 32, 4), 
                        offset: vec2(7, 0)}),
                    body({isStatic: true})
                ],
                '2': () => [//right small vertical
                    area({shape: new Rect(vec2(0), 3, 12), 
                        offset: vec2(7, 0)}),
                    body({isStatic: true})
                ],
                '|': () => [//right small vertical
                    area({shape: new Rect(vec2(0), 3, 32), 
                        offset: vec2(7, 0)}),
                    body({isStatic: true})
                ],
                '3': () => [//half tile horizontal
                    area({shape: new Rect(vec2(0), 32, 16), 
                        offset: vec2(0, 0)}),
                    body({isStatic: true})
                ]
            }
        })
    ]

    for (const layer of map) {
        layer.use(scale(4))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }
    
    //-------trigger points on the map

    //return home (to bedroom)
    const toHome = add([area({shape: new Rect(vec2(0, 0), 5, 64)}), body({isStatic: true}), pos(1120, 2945), scale(4), 'returnhome-trigg'])

    //enter campus thru facade
    const campusInTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(2050, 2600), scale(4), 'enterCampus-trigg-tile'])
    campusInTrigger.play('returnMap-trigger')

    //exit campus thru facade
    const campusOutTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(2050, 2565), scale(4), 'exitCampus-trigg-tile'])
    campusOutTrigger.play('returnMap-trigger')

    //to go inside cecs
    const cecsTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(1470, 2230), scale(4), 'cecs-trigg-tile'])
    cecsTrigger.play('cecs-trigger')

    //to go inside of heb from front pathway
    const hebTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(2045, 1220), scale(4), 'heb-trigg-tile'])
    hebTrigger.play('heb-trigger')

    //to go inside of heb from ldc side path
    const hebTrigger2 = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(2180, 780), scale(4), 'heb-trigg-tile2'])
    hebTrigger2.play('heb-trigger')

    //to go inside of ldc
    const ldcTrigger = add([sprite('trigger-tile'), area({width: 8}), body({isStatic: true}), pos(2180, 445), scale(4), 'ldc-trigg-tile'])
    ldcTrigger.play('ldc-trigger')

    //to go inside of ob
    const obTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3200, 1536), scale(4), 'ob-trigg-tile'])
    obTrigger.play('ob-trigger')
    
    //player
    const player = add([
        sprite('player-down'),
        pos(2050, 2820),
        scale(4),
        z(2),
        area(),
        body(),{
            currentSprite: 'player-down',
            speed: 300,
            isInDialogue: false
        }
        
    ])
    spawnAvatar(player)

    if (!mapState){
        mapState = {
            playerPos: player.pos
        }
    }

    player.pos = vec2(mapState.playerPos)
    let tick1 = 0;

    // CECS
    // Cartesian Coordinates
    let bldg1_x1 = 1520;
    let bldg1_x2 = 1700;
    let bldg1_y1 = 1636;
    let bldg1_y2 = 2435;
    showBuildingName(tick1,bldg1_x1,bldg1_x2,bldg1_y1,bldg1_y2,player,`${bldgs[0].bldg_name}`,[1390,1940]); // [] is the position of text | bldg name

    let tick2 = 0;
    // HEB
    // Cartesian Coordinates
    let bldg2_x1 = 1630;
    let bldg2_x2 = 2830;
    let bldg2_y1 = 1320;
    let bldg2_y2 = 1490;
    showBuildingName(tick2,bldg2_x1,bldg2_x2,bldg2_y1,bldg2_y2,player,`${bldgs[1].bldg_name}`,[1975, 930]);

    let tick3 = 0;
    // LDC
    // Cartesian Coordinates
    let bldg3_x1 = 1620;
    let bldg3_x2 = 2420;
    let bldg3_y1 = 560;
    let bldg3_y2 = 650;
    showBuildingName(tick3,bldg3_x1,bldg3_x2,bldg3_y1,bldg3_y2,player,`${bldgs[2].bldg_name}`,[2100,241]);

    let tick4 = 0;
    // OB
    // Cartesian Coordinates
    let bldg4_x1 = 2910;
    let bldg4_x2 = 3110;
    let bldg4_y1 = 1270;
    let bldg4_y2 = 2310;
    showBuildingName(tick4,bldg4_x1,bldg4_x2,bldg4_y1,bldg4_y2,player,`${bldgs[3].bldg_name}`,[3180,1690]);



    //go home (bedroom, day increments when u go home)
    player.onCollide('returnhome-trigg', ()=>{
        dayCounter++ //increment day
        if(dayCounter === day.length){
            dayCounter = 0
        }
        garment = "default" //reset garment pagkauwi
        loadCharSprite(avatar, garment)
        flashScreen()
        add([
            pos(800, 850),
            text("[wavy]Going home...[/wavy]", {
                size: 60, 
                width: 500,
                font: "consolas",
                styles: {
                    "wavy": (idx, ch) => ({
                        //color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
                        pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
                    })
                }
            }),
            z(10),
            color(Color.fromHex("#ffffff")),
            //anchor("center"),
            fixed(),
            'transition-mssg'
        ])
        setTimeout(() => {
            mapState.playerPos = vec2(1230, 530)
            go('inBedroom', mapState) 
        }, 3500);
    })
    //enter the campus
    onCollidewithPlayer('enterCampus-trigg-tile', player, mapState, 'inFacade', vec2(1856, 489))
    //exit the campus
    onCollidewithPlayer('exitCampus-trigg-tile', player, mapState, 'inFacade', vec2(1856, 489))
    //go to cecs (lsb)
    onCollidewithPlayer('cecs-trigg-tile', player, mapState, 'inCECS', vec2(1143, 3872))
    //go to heb (vmb)
    onCollidewithPlayer('heb-trigg-tile', player, mapState, 'inHEB', vec2(2561, 3872))
    //return to heb from ldc
    onCollidewithPlayer('heb-trigg-tile2', player, mapState, 'inHEB', vec2(2561, 3872))
    //go to ldc (gzb) from back of heb pathway
    onCollidewithPlayer('ldc-trigg-tile', player, mapState, 'inLDC', vec2(3576, 3907))
    //go to ob (abb)
    onCollidewithPlayer('ob-trigg-tile', player, mapState, 'inOB', vec2(266, 3907))

}

//-------------------------------------------------------------CECS SCENE FUNCTION--------------------------------------------------------
function setCECS(mapState){
    //change bg color
    setBackground(Color.fromHex('#3A3A3A'))
    displayDay()
    console.log("read returnPos on setCECS", returnPos)

    inBldg = "CECS"
    console.log("You are in: ", inBldg)
    // Fetching of floors list for bldg-1
    let floorNames = floors.filter((floor)=>(floor.bldg_id === 1));
    let roomNames = rooms.filter((room) => (room.floor_id === floorNames[0].floor_id  || room.floor_id === floorNames[1].floor_id || room.floor_id === floorNames[2].floor_id || room.floor_id === floorNames[3].floor_id || room.floor_id === floorNames[4].floor_id));
    const cecshallway = [
        addLevel([//5 floors
        '        abcdbcadabcdbcadabcdbca         ',
        '        hefgefighefgefighefgefi         ',
        '        jjjjjjjkjjjjjjjkjjjjjjj         ',
        '        lllllllmlllllllmlllllll         ',
        '                                        ',
        '                                        ',
        '                                        ',
        '        abcdbcadabcdbcadabcdbca         ',
        '        hefgefighefgefighefgefi         ',
        '        jjjjjjjkjjjjjjjkjjjjjjj         ',
        '        lllllllmlllllllmlllllll         ',
        '                                        ',
        '                                        ',
        '                                        ',
        '        abcdbcadabcdbcadabcdbca         ',
        '        hefgefighefgefighefgefi         ',
        '        jjjjjjjkjjjjjjjkjjjjjjj         ',
        '        lllllllmlllllllmlllllll         ',
        '                                        ',
        '                                        ',
        '                                        ',
        '        abcdbcadabcdbcadabcdbca         ',
        '        hefgefighefgefighefgefi         ',
        '        jjjjjjjkjjjjjjjkjjjjjjj         ',
        '        lllllllmlllllllmlllllll         ',
        '                                        ',
        '                                        ',
        '                                        ',
        '        nopqopnqnopqopnqnopqopn         ',
        '        ursgrsugursgrsugursgrsu         ',
        '        vvvwvvvwvvvwvvvwvvvwvvv         ',
        '        xxxxxxxxxxxxxxxxxxxxxxx         '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                'a': () => makeTile('hallway-tile',''),
                'b': () => makeTile('hallway-tile','cecs-up-wall2'),
                'c': () => makeTile('hallway-tile','cecs-up-wall3'),
                'd': () => makeTile('hallway-tile','cecs-up-pillar'),
                'e': () => makeTile('hallway-tile','cecs-wall1'), 
                'f': () => makeTile('hallway-tile','cecs-wall2'), 
                'g': () => makeTile('hallway-tile','cecs-main-pillar'),
                'h': () => makeTile('hallway-tile','cecs-doorL'),
                'i': () => makeTile('hallway-tile','cecs-doorR'),
                'j': () => makeTile('hallway-tile','cecs-sh-tile'),
                'k': () => makeTile('hallway-tile','cecs-sh-pillar-tile'),
                'l': () => makeTile('hallway-tile','cecs-tile'),
                'm': () => makeTile('hallway-tile','cecs-pillar-tile'),
                
                'n': () => makeTile('hallway-tile','cecs1-up-wall1'),
                'o': () => makeTile('hallway-tile','cecs1-up-wall2'),
                'p': () => makeTile('hallway-tile','cecs1-up-wall3'),
                'q': () => makeTile('hallway-tile','cecs1-up-pillar'),
                'r': () => makeTile('hallway-tile','cecs1-window1'),
                's': () => makeTile('hallway-tile','cecs1-window2'),
                't': () => makeTile('hallway-tile','cecs1-main-pillar'),
                'u': () => makeTile('hallway-tile','cecs1-glassdoor'),

                'v': () => makeTile('hallway-tile','ldc-sh-tile'),
                'w': () => makeTile('hallway-tile','ldc-sh-pillar-tile'),
                'x': () => makeTile('hallway-tile','ldc-tile')
            }
        }),
        addLevel([//collision
        '       0000000000000000000000000        ',
        '       0333333333333333333333330        ',
        '       0jjjjjjjkjjjjjjjkjjjjjjj0        ',
        '       0lllllllmlllllllmlllllll0        ',
        '       0000000000000000000000000        ',
        '                                        ',
        '                                        ',
        '       0000000000000000000000000        ',
        '       0333333333333333333333330        ',
        '       0jjjjjjjkjjjjjjjkjjjjjjj0        ',
        '       0lllllllmlllllllmlllllll0        ',
        '       0000000000000000000000000        ',
        '                                        ',
        '                                        ',
        '       0000000000000000000000000        ',
        '       0333333333333333333333330        ',
        '       0jjjjjjjkjjjjjjjkjjjjjjj0        ',
        '       0lllllllmlllllllmlllllll0        ',
        '       0000000000000000000000000        ',
        '                                        ',
        '                                        ',
        '       0000000000000000000000000        ',
        '       0333333333333333333333330        ',
        '       0jjjjjjjkjjjjjjjkjjjjjjj0        ',
        '       0lllllllmlllllllmlllllll0        ',
        '       0000000000000000000000000        ',
        '                                        ',
        '                                        ',
        '       0000000000000000000000000        ',
        '       0333333333333333333333330        ',
        '       0jjjjjjjkjjjjjjjkjjjjjjj0        ',
        '       0lllllllmlllllllmlllllll0        ',
        '       0000000000000000000000000        '
    ], {
        tileWidth: 32,
        tileHeight: 32,
        tiles: {
            '0': () => [//left whole tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(0, 0)}),
                body({isStatic: true})
            ],
            '3': () => [//half tile horizontal
                area({shape: new Rect(vec2(0), 32, 8), 
                    offset: vec2(0, 0)}),
                body({isStatic: true})
            ]
        }
    })
    ]

    for (const layer of cecshallway) {
        layer.use(scale(4))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }

    //trigger points
    //returning to map
    const returnMapTrigger = add([sprite('trigger-tile'), area({shape: new Rect(vec2(0, 0), 32, 20)}), body({isStatic: true}), pos(900, 4020), scale(4), 'returnMap-trigg-tile'])
    returnMapTrigger.play('returnMap-trigger')
    //moving up flrs
    const secondflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3945, 4022), scale(4), 'to2ndflr-trigg-tile'])
    secondflrTrigger.play('moveflr-trigger') 

    const thirdflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3945, 3151), scale(4), 'to3rdflr-trigg-tile'])
    thirdflrTrigger.play('moveflr-trigger')

    const fourthflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3945, 2243), scale(4), 'to4thflr-trigg-tile'])
    fourthflrTrigger.play('moveflr-trigger')

    const fifthflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3945, 1353), scale(4), 'to5thflr-trigg-tile'])
    fifthflrTrigger.play('moveflr-trigger')
    //moving down flrs
    const downfourthTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(930, 451), scale(4), 'down4thflr-trigg-tile'])
    downfourthTrigger.play('moveflr-trigger')

    const downthirdTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(930, 1353), scale(4), 'down3rdflr-trigg-tile'])
    downthirdTrigger.play('moveflr-trigger')

    const downsecondTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(930, 2243), scale(4), 'down2ndflr-trigg-tile'])
    downsecondTrigger.play('moveflr-trigger')

    const downfirstTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(930, 3151), scale(4), 'down1stflr-trigg-tile'])
    downfirstTrigger.play('moveflr-trigger') 
    
    //player
    const player = add([
        sprite('player-down'),
        pos(1143, 3872), //1670, 2300
        scale(4),
        z(3),
        area(),
        body(),{
            currentSprite: 'player-down',
            speed: 550,
            isInDialogue: false
        }
    ])
    spawnAvatar(player)
        
    if (!mapState){
        mapState = {
            playerPos: player.pos
        }
    }

    player.pos = vec2(mapState.playerPos)
    console.log("playerpos", player.pos)
    let created = false;
    // Floor Determinants
    let floorNumber;
    // Coordinates
    let firstFloor = 3872;
    let secondFloor = 3001;
    let thirdFloor = 2093;
    let fourthFloor = 1203;
    let fifthFloor = 301;
    
    // if(player.pos.y === firstFloor){
    //     floorNumber = 0;
    // }else if(player.pos.y === secondFloor){
    //     floorNumber = 1;
    // }else if(player.pos.y === thirdFloor){
    //     floorNumber = 2;
    // }else if(player.pos.y === fourthFloor){
    //     floorNumber = 3;
    // }else if(player.pos.y === fifthFloor){
    //     floorNumber = 4;
    // }else { // if ever there is an error will just use first floor
    //     floorNumber = 0;
    // }

    if(player.pos.y >= 3744 && player.pos.y <= 4096){
        floorNumber = 0;
    }else if(player.pos.y >= 2848 && player.pos.y <= 3072){
        floorNumber = 1;
    }else if(player.pos.y >= 1952 && player.pos.y <= 2176){
        floorNumber = 2;
    }else if(player.pos.y >= 1056 && player.pos.y <= 1280){
        floorNumber = 3;
    }else if(player.pos.y >= 160 && player.pos.y <= 384){
        floorNumber = 4;
    }else { // if ever there is an error will just use first floor
        floorNumber = 0;
    }

    showFloorName(created,`${bldgs[0].bldg_name}\n${floorNames[floorNumber].floor_number}`)

    //X    d=door    d0   d1   d2   d3   d4   d5
    const xCoord = [1024,1792,2048,2816,3072,3840]
    //Y             1st  2nd   3rd  4th  5th
    const yCoord = [3872,3001,2093,1203,301];

    let firstFloorRoomPositions =   [ [xCoord[0],yCoord[0]], [xCoord[1],yCoord[0]], [xCoord[2],yCoord[0]], [xCoord[3],yCoord[0]], [xCoord[4],yCoord[0]], [xCoord[5],yCoord[0]] ];
    let secondFloorRoomPositions =  [ [xCoord[0],yCoord[1]],                        [xCoord[2],yCoord[1]],                        [xCoord[4],yCoord[1]]                        ];
    let thirdFloorRoomPositions =   [ [xCoord[0],yCoord[2]], [xCoord[1],yCoord[2]], [xCoord[2],yCoord[2]], [xCoord[3],yCoord[2]], [xCoord[4],yCoord[2]]                        ];
    let fourthFloorRoomPositions =  [ [xCoord[0],yCoord[3]], [xCoord[1],yCoord[3]], [xCoord[2],yCoord[3]], [xCoord[3],yCoord[3]], [xCoord[4],yCoord[3]]                        ];
    let fifthFloorRoomPositions =   [ [xCoord[0],yCoord[4]],                        [xCoord[2],yCoord[4]],                        [xCoord[4],yCoord[4]]                        ];

    // This val returns an array which stores the name or tags of the collisions made
    const val = showRoomName(floorNames,roomNames,[firstFloorRoomPositions,secondFloorRoomPositions,thirdFloorRoomPositions,fourthFloorRoomPositions,fifthFloorRoomPositions],[40,250])
    val.forEach(v =>{
        console.log() // Use this for splitting ng v or ung each indexes ng val, ung nasa loob ng console.log()
        /*
            v = v.split('-w-') // will store [0] and [1] indeces which 0 contains the name and 1 the purpose
            if v[1] is equal to "classroom"
                then go(classroom)
            else if v[1] the same or may word na "comlab"
                then go(comlab)
            else if v[1] is equal to "office" or any not punta-able room
                then isep u what is gooder, just ... or go(voidofnothingness) or mayhaps use ung transition na black but hence make it red if doable
        */
        console.log("vvs",v)
        if(v.insideRoom !== undefined){
            player.onCollide(v.insideRoom,()=>{  // setting up ng player collision
                let vSplit = `${v.insideRoom}`.split('-w-')// will store [0] and [1] indeces which 0 contains the name and 1 the purpose   
                if (vSplit[1].match("Laboratory")){
                    if(vSplit[0].match("Computer Laboratory 2") || vSplit[0].match("Computer Laboratory 1/SSC/Publication")){
                        returnPos = vSplit[2]
                        flashScreen()
                        setTimeout(() => {
                            mapState.playerPos =  vec2(1329, 595)
                            go("inCECScomlab", mapState)
                        }, 1000)
                    }
                    else if(vSplit[0].match("Speech Lab")){
                        console.log("Faculty only")
                        displayDialogue(player, "Faculty only.")

                }
                    else {
                        returnPos = vSplit[2]
                        flashScreen()
                        setTimeout(() => {
                            mapState.playerPos =  vec2(2080, 640)
                            go("inHEBclassroom", mapState)
                        }, 1000)
                        
                    }
                }
                else if (vSplit[1].match("Office")){
                    console.log("Let's explore the area ahead of us later")
                    displayDialogue(player, "Faculty only.")
                }
                else {
                    displayDialogue(player, "Authorized personnel only.")
                }
                console.log("splitting", returnPos, vSplit[2])
            })
        } else {
            player.onCollide(v.interaction,()=>{  // setting up ng player collision +`-w-${questTempContainer[i].quest_type}-w-${quests[i].quest_id}`
                let vSplit = `${v.interaction}`.split("-w-");
                
                if(vSplit[1] === "Picture Selection"){
                    console.log(vSplit[2])
                    destroyAll(v.interaction);
                    questUpdate.push(questTempContainer.filter(q=>q.quest_id === parseInt(vSplit[2]))[0].quest_id);
                    const index = val.indexOf(v.interaction);
                    const x = val.splice(index, 1);
                    questTempContainer = questTempContainer.filter(q=>q.quest_id !== parseInt(vSplit[2]));
                    indexArray = indexArray.filter( i => i!==quests.findIndex(q => q===quests.filter(q=>q.quest_id === parseInt(vSplit[2]))[0]))
                    changeInfo('ps',psQuest,v.question,v.choices) 
                    pictureSelection.style.visibility = 'visible';
                }else if(vSplit[1] === "Multiple Choice"){
                    console.log(vSplit[2])
                    //v.interaction
                    destroyAll(v.interaction);
                    questUpdate.push(questTempContainer.filter(q=>q.quest_id === parseInt(vSplit[2]))[0].quest_id);
                    const index = val.indexOf(v.interaction);
                    const x = val.splice(index, 1);
                    questTempContainer = questTempContainer.filter(q=>q.quest_id !== parseInt(vSplit[2]));
                    indexArray = indexArray.filter( i => i!==quests.findIndex(q => q===quests.filter(q=>q.quest_id === parseInt(vSplit[2]))[0]))
                    
                    changeInfo('mc',ddQuest,v.question,v.choices)  
                    dragAndDrop.style.visibility = 'visible';
                }else if(vSplit[1] === "Fill in the Blanks"){
                    console.log(vSplit[2])
                    destroyAll(v.interaction);
                    questUpdate.push(questTempContainer.filter(q=>q.quest_id === parseInt(vSplit[2]))[0].quest_id);
                    const index = val.indexOf(v.interaction);
                    const x = val.splice(index, 1);
                    questTempContainer = questTempContainer.filter(q=>q.quest_id !== parseInt(vSplit[2]));
                    indexArray = indexArray.filter( i => i!==quests.findIndex(q => q===quests.filter(q=>q.quest_id === parseInt(vSplit[2]))[0]))
                    changeInfo('fb',fbQuest,v.question,v.choices); 
                    fillInTheBlanks.style.visibility = 'visible';
                }
            })
        }
    })
    //return outside
    onCollidewithPlayer('returnMap-trigg-tile', player, mapState, 'bsu-map',  vec2(1650, 2294))
    //                move upwwwwww
    //to 2nd flr
    onCollidewithPlayer('to2ndflr-trigg-tile', player, mapState, 'inCECS',  vec2(2444, 3001))
    //to 3rd flr
    onCollidewithPlayer('to3rdflr-trigg-tile', player, mapState, 'inCECS',  vec2(2444, 2093))
    //to 4th flr
    onCollidewithPlayer('to4thflr-trigg-tile', player, mapState, 'inCECS',  vec2(2444, 1203))
    //to 5th flr
    onCollidewithPlayer('to5thflr-trigg-tile', player, mapState, 'inCECS',  vec2(2444, 301))
    //                move down
    //down 4th flr
    onCollidewithPlayer('down4thflr-trigg-tile', player, mapState, 'inCECS',  vec2(2444, 1203))
    //down 3rd flr
    onCollidewithPlayer('down3rdflr-trigg-tile', player, mapState, 'inCECS',  vec2(2444, 2093))
    //down 2nd flr
    onCollidewithPlayer('down2ndflr-trigg-tile', player, mapState, 'inCECS',  vec2(2444, 3001))
    //down 1st flr
    onCollidewithPlayer('down1stflr-trigg-tile', player, mapState, 'inCECS',  vec2(2444, 3872))
}   

//-------------------------------------------------------------HEB SCENE FUNCTION---------------------------------------------------------
function setHEB(mapState){
    //change bg color
    setBackground(Color.fromHex('#3A3A3A'))
    displayDay()
    inBldg = "HEB"
    console.log("You are in: ", inBldg)

    // Fetching of floors list for bldg-2
    let floorNames = floors.filter((floor)=>(floor.bldg_id === 2));
    let roomNames = rooms.filter((room) => (room.floor_id === floorNames[0].floor_id  || room.floor_id === floorNames[1].floor_id || room.floor_id === floorNames[2].floor_id || room.floor_id === floorNames[3].floor_id || room.floor_id === floorNames[4].floor_id));
    console.log("Floro names",floorNames)

    const hebhallway = [
        addLevel([//5 floors
        'abcdbcadabcdbcadabcdbcadabcdbcadabcdbca ',
        'hefgefighefgefighefgefighefgefighefgefi ',
        'jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj ',
        'lllllllllllllllllllllllllllllllllllllll ',
        '                                        ',
        '                                        ',
        '                                        ',
        'abcdbcadabcdbcadabcdbcadabcdbcadabcdbca ',
        'hefgefighefgefighefgefighefgefighefgefi ',
        'jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj ',
        'lllllllllllllllllllllllllllllllllllllll ',
        '                                        ',
        '                                        ',
        '                                        ',
        'abcdbcadabcdbcadabcdbcadabcdbcadabcdbca ',
        'hefgefighefgefighefgefighefgefighefgefi ',
        'jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj ',
        'lllllllllllllllllllllllllllllllllllllll ',
        '                                        ',
        '                                        ',
        '                                        ',
        'abcdbcadabcdbcadabcdbcadabcdbcadabcdbca ',
        'hefgefighefgefighefgefighefgefighefgefi ',
        'jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj ',
        'lllllllllllllllllllllllllllllllllllllll ',
        '                                        ',
        '                                        ',
        '                                        ',
        'abcdbcadabcdbcadabcdpqrdabcdbcadabcdbca ',
        'hefgefighefgefighefgmnoghefgefighefgefi ',
        'jjjkjjjkjjjkjjjkjjjklllkjjjkjjjkjjjkjjj ',
        'lllllllllllllllllllllllllllllllllllllll ',
        '                 lllll                  '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                'a': () => makeTile('hallway-tile','heb-up-wall1'),
                'b': () => makeTile('hallway-tile','heb-up-wall2'),
                'c': () => makeTile('hallway-tile','heb-up-wall3'),
                'd': () => makeTile('hallway-tile','heb-up-pillar'),
                'e': () => makeTile('hallway-tile','heb-wall1'), 
                'f': () => makeTile('hallway-tile','heb-wall2'), 
                'g': () => makeTile('hallway-tile','heb-main-pillar'),
                'h': () => makeTile('hallway-tile','heb-doorL'),
                'i': () => makeTile('hallway-tile','heb-doorR'),
                'j': () => makeTile('hallway-tile','heb-sh-tile'),
                'k': () => makeTile('hallway-tile','heb-sh-pillar-tile'),
                'l': () => makeTile('hallway-tile','heb-tile'),
                'm': () => makeTile('hallway-tile','heb-ldc-path1'),
                'n': () => makeTile('hallway-tile','heb-ldc-path2'),
                'o': () => makeTile('hallway-tile','heb-ldc-path3'),
                'p': () => makeTile('hallway-tile', 'heb-ldc-upwall1'),
                'q': () => makeTile('hallway-tile', 'heb-ldc-upwall2'),
                'r': () => makeTile('hallway-tile', 'heb-ldc-upwall3') 
            }
        }),
        addLevel([//collision
        '0000000000000000000000000000000000000000',
        '3333333333333333333333333333333333333330',
        '5jjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj0',
        '5llllllllllllllllllllllllllllllllllllll0',
        '0000000000000000000000000000000000000000',
        '                                        ',
        '                                        ',
        '0000000000000000000000000000000000000000',
        '3333333333333333333333333333333333333330',
        '5jjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj0',
        '5llllllllllllllllllllllllllllllllllllll0',
        '0000000000000000000000000000000000000000',
        '                                        ',
        '                                        ',
        '0000000000000000000000000000000000000000',
        '3333333333333333333333333333333333333330',
        '5jjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj0',
        '5llllllllllllllllllllllllllllllllllllll0',
        '0000000000000000000000000000000000000000',
        '                                        ',
        '                                        ',
        '0000000000000000000000000000000000000000',
        '3333333333333333333333333333333333333330',
        '5jjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj0',
        '5llllllllllllllllllllllllllllllllllllll0',
        '0000000000000000000000000000000000000000',
        '                                        ',
        '                                        ',
        '0000000000000000000000000000000000000000',
        '33333333333333333333   33333333333333330',
        '5jjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj0',
        '5llllllllllllllllllllllllllllllllllllll0',
        '00000000000000000     000000000000000000',
        '                 00000'
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                '0': () => [//left whole tile 
                    area({shape: new Rect(vec2(0), 32, 32), 
                    offset: vec2(0, 0)}),
                    body({isStatic: true})
                ],
                '3': () => [//half tile horizontal
                    area({shape: new Rect(vec2(0), 32, 8), 
                        offset: vec2(0, 0)}),
                    body({isStatic: true})
                ],
                '5': () => [//offset left whole tile 
                    area({shape: new Rect(vec2(0), 32, 32), 
                    offset: vec2(-32, -16)}),
                    body({isStatic: true})
                ]
            }
        })
    ]

    for (const layer of hebhallway) {
        layer.use(scale(4))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }

    //trigger points
    // to ldc
    const ldcMapTrigger = add([sprite('trigger-tile'), area({shape: new Rect(vec2(0, 0), 96, 10)}), body({isStatic: true}), pos(2560, 3685), scale(4), 'ldcMap-trigg-tile'])
    ldcMapTrigger.play('ldc-trigger')
    //return to map
    const returnMapTrigger = add([sprite('trigger-tile'), area({shape: new Rect(vec2(0, 0), 160, 10)}), body({isStatic: true}), pos(2175, 4150), scale(4), 'returnMap-trigg-tile'])
    returnMapTrigger.play('returnMap-trigger')
    //moving up flrs
    const secondflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(4920, 4022), scale(4), 'to2ndflr-trigg-tile'])
    secondflrTrigger.play('moveflr-trigger') 

    const thirdflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(4920, 3151), scale(4), 'to3rdflr-trigg-tile'])
    thirdflrTrigger.play('moveflr-trigger')

    const fourthflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(4920, 2243), scale(4), 'to4thflr-trigg-tile'])
    fourthflrTrigger.play('moveflr-trigger')

    const fifthflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(4920, 1353), scale(4), 'to5thflr-trigg-tile'])
    fifthflrTrigger.play('moveflr-trigger')
    //moving down flrs
    const downfourthTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(-95, 451), scale(4), 'down4thflr-trigg-tile'])
    downfourthTrigger.play('moveflr-trigger')

    const downthirdTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(-95, 1353), scale(4), 'down3rdflr-trigg-tile'])
    downthirdTrigger.play('moveflr-trigger')

    const downsecondTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(-95, 2243), scale(4), 'down2ndflr-trigg-tile'])
    downsecondTrigger.play('moveflr-trigger')

    const downfirstTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(-95, 3151), scale(4), 'down1stflr-trigg-tile'])
    downfirstTrigger.play('moveflr-trigger')

    //player
    const player = add([
        sprite('player-down'),
        pos(2561, 3872), //1670, 2300
        scale(4),
        z(3),
        area(),
        body(),{
            currentSprite: 'player-down',
            speed: 550,
            isInDialogue: false
        }
    ])
    
    spawnAvatar(player)

    if (!mapState){
        mapState = {
            playerPos: player.pos
        }
    }

    player.pos = vec2(mapState.playerPos)
    console.log("player.pos", player.pos)
    let created = false;
    // Floor Determinants
    let floorNumber;
    // Coordinates
    let firstFloor = 3872;
    let secondFloor = 3001;
    let thirdFloor = 2093;
    let fourthFloor = 1203;
    let fifthFloor = 301;
    
    // if(player.pos.y === firstFloor){
    //     floorNumber = 0;
    // }else if(player.pos.y === secondFloor){
    //     floorNumber = 1;
    // }else if(player.pos.y === thirdFloor){
    //     floorNumber = 2;
    // }else if(player.pos.y === fourthFloor){
    //     floorNumber = 3;
    // }else if(player.pos.y === fifthFloor){
    //     floorNumber = 4;
    // }else { // if ever there is an error will just use first floor
    //     floorNumber = 0;
    // }

    if(player.pos.y >= 3744 && player.pos.y <= 4096){
        floorNumber = 0;
    }else if(player.pos.y >= 2848 && player.pos.y <= 3072){
        floorNumber = 1;
    }else if(player.pos.y >= 1952 && player.pos.y <= 2176){
        floorNumber = 2;
    }else if(player.pos.y >= 1056 && player.pos.y <= 1280){
        floorNumber = 3;
    }else if(player.pos.y >= 160 && player.pos.y <= 384){
        floorNumber = 4;
    }else { // if ever there is an error will just use first floor
        floorNumber = 0;
    }
    

    showFloorName(created,`${bldgs[1].bldg_name}\n${floorNames[floorNumber].floor_number}`)    

    //X    d=door  d0 d1   d2   d3   d4   d5   d6   d7  d8    d9
    const xCoord = [0,770,1024,1792,2048,2816,3072,3840,4097,4864];
    //Y             1st  2nd   3rd  4th  5th
    const yCoord = [3744,2848,1952,1056,160];

    let firstFloorRoomPositions =   [ [xCoord[0],yCoord[0]],                        [xCoord[2],yCoord[0]],                        [xCoord[4],yCoord[0]],                        [xCoord[6],yCoord[0]], [xCoord[7],yCoord[0]], [xCoord[8],yCoord[0]], [xCoord[9],yCoord[0]] ];
    let secondFloorRoomPositions =  [ [xCoord[0],yCoord[1]], [xCoord[1],yCoord[1]],                        [xCoord[3],yCoord[1]],                        [xCoord[5],yCoord[1]],                        [xCoord[7],yCoord[1]],                        [xCoord[9],yCoord[1]] ];
    let thirdFloorRoomPositions =   [ [xCoord[0],yCoord[2]], [xCoord[1],yCoord[2]], [xCoord[2],yCoord[2]],                        [xCoord[4],yCoord[2]],                        [xCoord[6],yCoord[2]],                        [xCoord[8],yCoord[2]]                        ];
    let fourthFloorRoomPositions =  [ [xCoord[0],yCoord[3]],                        [xCoord[2],yCoord[3]],                        [xCoord[4],yCoord[3]],                        [xCoord[6],yCoord[3]],                        [xCoord[8],yCoord[3]], [xCoord[9],yCoord[3]] ];
    let fifthFloorRoomPositions =   [ [xCoord[0],yCoord[4]],                        [xCoord[2],yCoord[4]],                        [xCoord[4],yCoord[4]],                        [xCoord[6],yCoord[4]],                        [xCoord[8],yCoord[4]]                        ];

    const val = showRoomName(floorNames,roomNames,[firstFloorRoomPositions,secondFloorRoomPositions,thirdFloorRoomPositions,fourthFloorRoomPositions,fifthFloorRoomPositions],[40,125])

    val.forEach(v =>{
        if(v.insideRoom !== undefined){
            player.onCollide(v.insideRoom,()=>{  // setting up ng player collision
                let vSplit = `${v.insideRoom}`.split('-w-')// will store [0] and [1] indeces which 0 contains the name and 1 the purpose               
                if (vSplit[1].match("Classroom")){
                    returnPos = vSplit[2]
                    flashScreen()
                    setTimeout(() => {
                        mapState.playerPos =  vec2(2080, 640)
                        go("inHEBclassroom", mapState)
                    }, 1000)
                }
                else if (vSplit[1].match("Laboratory")){
                    if(vSplit[0].match("Computer Laboratory 1") || vSplit[0].match("Computer Laboratory 2")){
                        returnPos = vSplit[2]
                        flashScreen()
                        setTimeout(() => {
                            mapState.playerPos =  vec2(1329, 595)
                            go("inCECScomlab", mapState)
                        }, 1000)
                    }
                    else{
                        returnPos = vSplit[2]
                        flashScreen()
                        setTimeout(() => {
                            mapState.playerPos =  vec2(2080, 640)
                            go("inHEBclassroom", mapState)
                        }, 1000)
                    }   
                }
                else if (vSplit[1].match("Office")){
                    console.log("Let's explore the area ahead of us later")
                    displayDialogue(player, "Faculty only.")

            }
                console.log("returnPos and vSplit", returnPos, vSplit[2])
            })
        } else {
            player.onCollide(v.interaction,()=>{  // setting up ng player collision +`-w-${quests[i].quest_type}-w-${quests[i].quest_id}`
                let vSplit = `${v.interaction}`.split("-w-");
                
                if(vSplit[1] === "Picture Selection"){
                    console.log(vSplit[2])
                    destroyAll(v.interaction);
                    questUpdate.push(questTempContainer.filter(q=>q.quest_id === parseInt(vSplit[2]))[0].quest_id);
                    const index = val.indexOf(v.interaction);
                    const x = val.splice(index, 1);
                    questTempContainer = questTempContainer.filter(q=>q.quest_id !== parseInt(vSplit[2]));
                    indexArray = indexArray.filter( i => i!==quests.findIndex(q => q===quests.filter(q=>q.quest_id === parseInt(vSplit[2]))[0]))
                    changeInfo('ps',psQuest,v.question,v.choices) 
                    pictureSelection.style.visibility = 'visible';
                }else if(vSplit[1] === "Multiple Choice"){
                    console.log(vSplit[2])
                    //v.interaction
                    
                    destroyAll(v.interaction);
                    questUpdate.push(questTempContainer.filter(q=>q.quest_id === parseInt(vSplit[2]))[0].quest_id);
                    const index = val.indexOf(v.interaction);
                    const x = val.splice(index, 1);
                    questTempContainer = questTempContainer.filter(q=>q.quest_id !== parseInt(vSplit[2]));
                    indexArray = indexArray.filter( i => i!==quests.findIndex(q => q===quests.filter(q=>q.quest_id === parseInt(vSplit[2]))[0]))
                    changeInfo('mc',ddQuest,v.question,v.choices);  
                    dragAndDrop.style.visibility = 'visible';
                }else if(vSplit[1] === "Fill in the Blanks"){
                    console.log(vSplit[2])
                    destroyAll(v.interaction);
                    questUpdate.push(questTempContainer.filter(q=>q.quest_id === parseInt(vSplit[2]))[0].quest_id);
                    const index = val.indexOf(v.interaction);
                    const x = val.splice(index, 1);
                    questTempContainer = questTempContainer.filter(q=>q.quest_id !== parseInt(vSplit[2]));
                    indexArray = indexArray.filter( i => i!==quests.findIndex(q => q===quests.filter(q=>q.quest_id === parseInt(vSplit[2]))[0]))
                    changeInfo('fb',fbQuest,v.question,v.choices); 
                    fillInTheBlanks.style.visibility = 'visible';
                }
            })
        }  
        
    })
    //go to ldc map path (gzb), back heb pathway
    onCollidewithPlayer('ldcMap-trigg-tile', player, mapState, 'bsu-map',  vec2(2180, 605))
    //return outside, front heb pathway
    onCollidewithPlayer('returnMap-trigg-tile', player, mapState, 'bsu-map',  vec2(2050, 1455))
    //                move up
    //to 2nd flr
    onCollidewithPlayer('to2ndflr-trigg-tile', player, mapState, 'inHEB',  vec2(2444, 3001))
    //to 3rd flr
    onCollidewithPlayer('to3rdflr-trigg-tile', player, mapState, 'inHEB',  vec2(2444, 2093))
    //to 4th flr
    onCollidewithPlayer('to4thflr-trigg-tile', player, mapState, 'inHEB',  vec2(2444, 1203))
    //to 5th flr
    onCollidewithPlayer('to5thflr-trigg-tile', player, mapState, 'inHEB',  vec2(2444, 301))
    //                move down
    //down 4th flr
    onCollidewithPlayer('down4thflr-trigg-tile', player, mapState, 'inHEB',  vec2(2444, 1203))
    //down 3rd flr
    onCollidewithPlayer('down3rdflr-trigg-tile', player, mapState, 'inHEB',  vec2(2444, 2093))
    //down 2nd flr
    onCollidewithPlayer('down2ndflr-trigg-tile', player, mapState, 'inHEB',  vec2(2444, 3001))
    //down 1st flr
    onCollidewithPlayer('down1stflr-trigg-tile', player, mapState, 'inHEB',  vec2(2444, 3872))
}

//------------------------------------------------------------LDC SCENE FUNCTION----------------------------------------------------------
function setLDC(mapState){
    setBackground(Color.fromHex('#3A3A3A'))
    displayDay()
    inBldg = "LDC"
    console.log("You are in: ", inBldg)
    
    // Fetching of floors list for bldg-3
    let floorNames = floors.filter((floor)=>(floor.bldg_id === 3));
    let roomNames = rooms.filter((room) => (room.floor_id === floorNames[0].floor_id  || room.floor_id === floorNames[1].floor_id || room.floor_id === floorNames[2].floor_id));
    console.log("Floro names",roomNames)


    const ldchallway = [
        addLevel([//3 floors
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        'abcdbcadabcdbcadabcdbcadabcdbcadabcdbca ',
        'hefgefighefgefighefgefighefgefighefgefi ',
        'jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj ',
        'lllllllllllllllllllllllllllllllllllllll ',
        '                                        ',
        '                                        ',
        '                                        ',
        'abcdbcadabcdbcadabcdbcadabcdbcadabcdbca ',
        'hefgefighefgefighefgefighefgefighefgefi ',
        'jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj ',
        'lllllllllllllllllllllllllllllllllllllll ',
        '                                        ',
        '                                        ',
        '                                        ',
        '-_=d~^*d~^*d~^*d~^*d~^*d~^*d-_=         ',
        '[|]g<#>g<#>g<#>g<#>g<#>g<#>g[|]         ',
        'jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj         ',
        'lllllllllllllllllllllllllllllll         ',
        '                           lll          '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                'a': () => makeTile('hallway-tile','ldc-up-wall1'),
                'b': () => makeTile('hallway-tile','ldc-up-wall2'),
                'c': () => makeTile('hallway-tile','ldc-up-wall3'),
                'd': () => makeTile('hallway-tile','ldc-up-pillar'),
                'e': () => makeTile('hallway-tile','ldc-wall1'), 
                'f': () => makeTile('hallway-tile','ldc-wall2'), 
                'g': () => makeTile('hallway-tile','ldc-main-pillar'),
                'h': () => makeTile('hallway-tile','ldc-doorL'),
                'i': () => makeTile('hallway-tile','ldc-doorR'),
                'j': () => makeTile('hallway-tile','ldc-sh-tile'),
                'k': () => makeTile('hallway-tile','ldc-sh-pillar-tile'),
                'l': () => makeTile('hallway-tile','ldc-tile'),

                '-': () => makeTile('hallway-tile','ldc1-d-uw1'),
                '_': () => makeTile('hallway-tile','ldc1-d-uw2'),
                '=': () => makeTile('hallway-tile','ldc1-d-uw3'),
                '[': () => makeTile('hallway-tile','ldc1-door1'),
                '|': () => makeTile('hallway-tile','ldc1-door2'),
                ']': () => makeTile('hallway-tile','ldc1-door3'),
                '~': () => makeTile('hallway-tile','ldc1-w-uw1'),
                '^': () => makeTile('hallway-tile','ldc1-w-uw2'),
                '*': () => makeTile('hallway-tile','ldc1-w-uw3'),
                '<': () => makeTile('hallway-tile','ldc1-window1'),
                '#': () => makeTile('hallway-tile','ldc1-window2'),
                '>': () => makeTile('hallway-tile','ldc1-window3')
            }
        }),
        addLevel([//collision
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '0000000000000000000000000000000000000000',
        '3333333333333333333333333333333333333330',
        '5jjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj0',
        '5llllllllllllllllllllllllllllllllllllll0',
        '0000000000000000000000000000000000000000',
        '                                        ',
        '                                        ',
        '0000000000000000000000000000000000000000',
        '3333333333333333333333333333333333333330',
        '5jjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj0',
        '5llllllllllllllllllllllllllllllllllllll0',
        '0000000000000000000000000000000000000000',
        '                                        ',
        '                                        ',
        '00000000000000000000000000000000        ',
        '33333333333333333333333333333330        ',
        '5jjkjjjkjjjkjjjkjjjkjjjkjjjkjjj0        ',
        '5llllllllllllllllllllllllllllll0        ',
        '000000000000000000000000000   00        ',
        '                           000'
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                '0': () => [//left whole tile 
                    area({shape: new Rect(vec2(0), 32, 32), 
                    offset: vec2(0, 0)}),
                    body({isStatic: true})
                ],
                '3': () => [//half tile horizontal
                    area({shape: new Rect(vec2(0), 32, 8), 
                        offset: vec2(0, 0)}),
                    body({isStatic: true})
                ],
                '5': () => [//offset left whole tile 
                    area({shape: new Rect(vec2(0), 32, 32), 
                    offset: vec2(-32, -16)}),
                    body({isStatic: true})
                ]
            }
        })
    ]

    for (const layer of ldchallway) {
        layer.use(scale(4))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }
    //trigger points
    //return to map
    const returnMapTrigger = add([sprite('trigger-tile'), area({shape: new Rect(vec2(0, 0), 96, 10)}), body({isStatic: true}), pos(3466, 4190), scale(4), 'returnMap-trigg-tile'])
    returnMapTrigger.play('returnMap-trigger')
    //moving up flrs
    const secondflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3940, 4022), scale(4), 'to2ndflr-trigg-tile'])
    secondflrTrigger.play('moveflr-trigger') 

    const thirdflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(4950, 3151), scale(4), 'to3rdflr-trigg-tile'])
    thirdflrTrigger.play('moveflr-trigger')

    //moving down flrs
    const downsecondTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(-90, 2243), scale(4), 'down2ndflr-trigg-tile'])
    downsecondTrigger.play('moveflr-trigger')

    const downfirstTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(-90, 3151), scale(4), 'down1stflr-trigg-tile'])
    downfirstTrigger.play('moveflr-trigger')

    //player
    const player = add([
        sprite('player-down'),
        pos(3576, 3907), //1670, 2300
        scale(4),
        z(3),
        area(),
        body(),{
            currentSprite: 'player-down',
            speed: 550,
            isInDialogue: false
        }
    ])
    
    spawnAvatar(player)

    if (!mapState){
        mapState = {
            playerPos: player.pos
        }
    }

    player.pos = vec2(mapState.playerPos)
    console.log(player.pos)

    let created = false;
    // Floor Determinants
    let floorNumber;
    // Coordinates
    let firstFloor = 3872;
    let secondFloor = 3001;
    let thirdFloor = 2093;
    
    // if(player.pos.y === firstFloor){
    //     floorNumber = 0;
    // }else if(player.pos.y === secondFloor){
    //     floorNumber = 1;
    // }else if(player.pos.y === thirdFloor){
    //     floorNumber = 2;
    // }else { // if ever there is an error will just use first floor
    //     floorNumber = 0;
    // }

    if(player.pos.y >= 3744 && player.pos.y <= 4096){
        floorNumber = 0;
    }else if(player.pos.y >= 2848 && player.pos.y <= 3072){
        floorNumber = 1;
    }else if(player.pos.y >= 1952 && player.pos.y <= 2176){
        floorNumber = 2;
    }else { // if ever there is an error will just use first floor
        floorNumber = 0;
    }

    showFloorName(created,`${bldgs[2].bldg_name}\n${floorNames[floorNumber].floor_number}`) 
                                                                //outliers
    //X    d=door  d0 d1   d2   d3   d4   d5   d6   d7  d8    d9  d10  d11
    const xCoord = [0,770,1024,1792,2048,2816,3072,3840,4097,4864,128,3712]
    //Y             1st  2nd   3rd  4th  5thz
    const yCoord = [3744,2848,1952,1056,160];

    let firstFloorRoomPositions =   [ [xCoord[10],yCoord[0]], [xCoord[11],yCoord[0]] ];
    let secondFloorRoomPositions =  [ [xCoord[0] ,yCoord[1]], [xCoord[2],yCoord[1]], [xCoord[4],yCoord[1]], [xCoord[6],yCoord[1]], [xCoord[8],yCoord[1]], [xCoord[9],yCoord[1]] ];
    let thirdFloorRoomPositions =   [ [xCoord[0] ,yCoord[2]], [xCoord[2],yCoord[2]], [xCoord[4],yCoord[2]], [xCoord[6],yCoord[2]], [xCoord[8],yCoord[2]], [xCoord[9],yCoord[2]] ];

    const val = showRoomName(floorNames,roomNames,[firstFloorRoomPositions,secondFloorRoomPositions,thirdFloorRoomPositions],[40,125])

    val.forEach(v =>{
        if(v.insideRoom !== undefined){
            player.onCollide(v.insideRoom,()=>{  // setting up ng player collision
                let vSplit = `${v.insideRoom}`.split('-w-')// will store [0] and [1] indeces which 0 contains the name and 1 the purpose               
                if (vSplit[1].match("Classroom")){
                    returnPos = vSplit[2]
                    flashScreen()
                    setTimeout(() => {
                        mapState.playerPos =  vec2(2080, 640)
                        go("inLDCclassroom", mapState)
                    }, 1000)
                }
                else if (vSplit[1].match("Canteen")){
                    console.log("Sorry, canteen is not open yet")
                    displayDialogue(player, "Sorry, canteen is not open yet.")
            }
                else if (vSplit[1].match("Office")){
                    console.log("Let's explore the area ahead of us later")
                    displayDialogue(player, "Sorry, canteen is not open yet.")
            }
                console.log("returnPos and vSplit", returnPos, vSplit[2])
            })
        } else {
            player.onCollide(v.interaction,()=>{  // setting up ng player collision +`-w-${quests[i].quest_type}-w-${quests[i].quest_id}`
                let vSplit = `${v.interaction}`.split("-w-");                
                if(vSplit[1] === "Picture Selection"){
                    console.log(vSplit[2])
                    destroyAll(v.interaction);
                    questUpdate.push(questTempContainer.filter(q=>q.quest_id === parseInt(vSplit[2]))[0].quest_id);
                    const index = val.indexOf(v.interaction);
                    const x = val.splice(index, 1);
                    questTempContainer = questTempContainer.filter(q=>q.quest_id !== parseInt(vSplit[2]));
                    indexArray = indexArray.filter( i => i!==quests.findIndex(q => q===quests.filter(q=>q.quest_id === parseInt(vSplit[2]))[0]))
                    changeInfo('ps',psQuest,v.question,v.choices); 
                    pictureSelection.style.visibility = 'visible';
                }else if(vSplit[1] === "Multiple Choice"){
                    console.log(vSplit[2])
                    //v.interaction
                    
                    destroyAll(v.interaction);
                    questUpdate.push(questTempContainer.filter(q=>q.quest_id === parseInt(vSplit[2]))[0].quest_id);
                    const index = val.indexOf(v.interaction);
                    const x = val.splice(index, 1);
                    questTempContainer = questTempContainer.filter(q=>q.quest_id !== parseInt(vSplit[2]));
                    indexArray = indexArray.filter( i => i!==quests.findIndex(q => q===quests.filter(q=>q.quest_id === parseInt(vSplit[2]))[0]))
                    changeInfo('mc',ddQuest,v.question,v.choices);  
                    dragAndDrop.style.visibility = 'visible';
                }else if(vSplit[1] === "Fill in the Blanks"){
                    console.log(vSplit[2])
                    destroyAll(v.interaction);
                    questUpdate.push(questTempContainer.filter(q=>q.quest_id === parseInt(vSplit[2]))[0].quest_id);
                    const index = val.indexOf(v.interaction);
                    const x = val.splice(index, 1);
                    questTempContainer = questTempContainer.filter(q=>q.quest_id !== parseInt(vSplit[2]));
                    indexArray = indexArray.filter( i => i!==quests.findIndex(q => q===quests.filter(q=>q.quest_id === parseInt(vSplit[2]))[0]))
                    changeInfo('fb',fbQuest,v.question,v.choices) 
                    fillInTheBlanks.style.visibility = 'visible';
                }
            })
        }   
    })

    //return outside
    onCollidewithPlayer('returnMap-trigg-tile', player, mapState, 'bsu-map',  vec2(2180, 605))
    //                move up
    //to 2nd flr
    onCollidewithPlayer('to2ndflr-trigg-tile', player, mapState, 'inLDC',  vec2(2444, 3001))
    //to 3rd flr
    onCollidewithPlayer('to3rdflr-trigg-tile', player, mapState, 'inLDC',  vec2(2444, 2093))
    //                move down
    //down 2nd flr
    onCollidewithPlayer('down2ndflr-trigg-tile', player, mapState, 'inLDC',  vec2(2444, 3001))
    //down 1st flr
    onCollidewithPlayer('down1stflr-trigg-tile', player, mapState, 'inLDC',  vec2(2444, 3872))
}

//-------------------------------------------------------------OB SCENE FUNCTION----------------------------------------------------------
function setOB(mapState){
    setBackground(Color.fromHex('#3A3A3A'))
    displayDay()
    inBldg = "OB"
    console.log("You are in: ", inBldg)

    // Fetching of floors list for bldg-4
    let floorNames = floors.filter((floor)=>(floor.bldg_id === 4));
    let roomNames = rooms.filter((room) => (room.floor_id === floorNames[0].floor_id  || room.floor_id === floorNames[1].floor_id || room.floor_id === floorNames[2].floor_id || room.floor_id === floorNames[3].floor_id || room.floor_id === floorNames[4].floor_id));
    console.log("Floro names",roomNames)
    const obhallway = [
        addLevel([//5 floors
        'abcdbcadabcdbcadabcdbcadabcdbca        ',
        'hefgefigh<>gefighefgefighefgefi        ',
        'jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj        ',
        'lllllllllllllllllllllllllllllll        ',
        '                                       ',
        '                                       ',
        '                                       ',
        'abcdbcadabcdbcadabcdbcadabcdbca        ',
        'hefgefighefgefighefgefighefgefi        ',
        'jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj        ',
        'lllllllllllllllllllllllllllllll        ',
        '                                       ',
        '                                       ',
        '                                       ',
        'abcdbcadabcdbcadabcdbcadabcdbca        ',
        'hefgefighefgefighefgefighefgefi        ',
        'jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj        ',
        'lllllllllllllllllllllllllllllll        ',
        '                                       ',
        '                                       ',
        '                                       ',
        '-~_!bcadabcdbcadabcdbcadabcdbca        ',
        '[/]|efighefgefighefgefighefgefi        ',
        'jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj        ',
        'lllllllllllllllllllllllllllllll        ',
        '                                       ',
        '                                       ',
        '                                       ',
        'abcdbcadabcdbcadabcdbcadabcdbca        ',
        'hefgefighefgefighefgefighefgefi        ',
        'jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj        ',
        'lllllllllllllllllllllllllllllll        ',
        'lllll                                  '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                'a': () => makeTile('hallway-tile','ob-up-wall1'),
                'b': () => makeTile('hallway-tile','ob-up-wall2'),
                'c': () => makeTile('hallway-tile','ob-up-wall3'),
                'd': () => makeTile('hallway-tile','ob-up-pillar'),
                'e': () => makeTile('hallway-tile','ob-wall1'), 
                'f': () => makeTile('hallway-tile','ob-wall2'), 
                'g': () => makeTile('hallway-tile','ob-main-pillar'),
                'h': () => makeTile('hallway-tile','ob-doorL'),
                'i': () => makeTile('hallway-tile','ob-doorR'),
                'j': () => makeTile('hallway-tile','ob-sh-tile'),
                'k': () => makeTile('hallway-tile','ob-sh-pillar-tile'),
                'l': () => makeTile('hallway-tile','ob-tile'),
                '-': () => makeTile('hallway-tile','clinic-uw1'),
                '~': () => makeTile('hallway-tile','clinic-uw2'),
                '_': () => makeTile('hallway-tile','clinic-uw3'),
                '!': () => makeTile('hallway-tile','clinic-upillar'),
                '[': () => makeTile('hallway-tile','clinic-d1'),
                '/': () => makeTile('hallway-tile','clinic-d2'),
                ']': () => makeTile('hallway-tile','clinic-d3'),
                '|': () => makeTile('hallway-tile','clinic-pillar'),
                '<': () => makeTile('hallway-tile','lib-bulletin1'),
                '>': () => makeTile('hallway-tile','lib-bulletin2')
                
            }
        }),
        addLevel([//collision
        '00000000000000000000000000000000        ',
        '33333333333333333333333333333330        ',
        '5jjjkjjjkjjjkjjjkjjjkjjjkjjjkjj0        ',
        '5llllllllllllllllllllllllllllll0        ',
        '00000000000000000000000000000000        ',
        '                                        ',
        '                                        ',
        '00000000000000000000000000000000        ',
        '33333333333333333333333333333330        ',
        '5jjjkjjjkjjjkjjjkjjjkjjjkjjjkjj0        ',
        '5llllllllllllllllllllllllllllll0        ',
        '00000000000000000000000000000000        ',
        '                                        ',
        '                                        ',
        '00000000000000000000000000000000        ',
        '33333333333333333333333333333330        ',
        '5jjjkjjjkjjjkjjjkjjjkjjjkjjjkjj0        ',
        '5llllllllllllllllllllllllllllll0        ',
        '00000000000000000000000000000000        ',
        '                                        ',
        '                                        ',
        '00000000000000000000000000000000        ',
        '33333333333333333333333333333330        ',
        '5jjjkjjjkjjjkjjjkjjjkjjjkjjjkjj0        ',
        '5llllllllllllllllllllllllllllll0        ',
        '00000000000000000000000000000000        ',
        '                                        ',
        '                                        ',
        '00000000000000000000000000000000        ',
        '33333333333333333333333333333330        ',
        '5jjjkjjjkjjjkjjjkjjjkjjjkjjjkjj0        ',
        '5llllllllllllllllllllllllllllll0        ',
        '5    000000000000000000000000000        ',
        '000000                                   '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                '0': () => [//left whole tile 
                    area({shape: new Rect(vec2(0), 32, 32), 
                    offset: vec2(0, 0)}),
                    body({isStatic: true})
                ],
                '3': () => [//half tile horizontal
                    area({shape: new Rect(vec2(0), 32, 8), 
                        offset: vec2(0, 0)}),
                    body({isStatic: true})
                ],
                '5': () => [//offset left whole tile 
                    area({shape: new Rect(vec2(0), 32, 32), 
                    offset: vec2(-32, -16)}),
                    body({isStatic: true})
                ]
            }
        })
    ]

    for (const layer of obhallway) {
        layer.use(scale(4))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }
    //trigger points
    //return to map
    const returnMapTrigger = add([sprite('trigger-tile'), area({shape: new Rect(vec2(0, 0), 160, 10)}), body({isStatic: true}), pos(0, 4200), scale(4), 'returnMap-trigg-tile'])
    returnMapTrigger.play('returnMap-trigger')
    //moving up flrs
    const secondflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3940, 4022), scale(4), 'to2ndflr-trigg-tile'])
    secondflrTrigger.play('moveflr-trigger') 

    const thirdflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3940, 3151), scale(4), 'to3rdflr-trigg-tile'])
    thirdflrTrigger.play('moveflr-trigger')

    const fourthflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3940, 2243), scale(4), 'to4thflr-trigg-tile'])
    fourthflrTrigger.play('moveflr-trigger')

    const fifthflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3940, 1353), scale(4), 'to5thflr-trigg-tile'])
    fifthflrTrigger.play('moveflr-trigger')
    //moving down flrs
    const downfourthTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(-90, 451), scale(4), 'down4thflr-trigg-tile'])
    downfourthTrigger.play('moveflr-trigger')

    const downthirdTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(-90, 1353), scale(4), 'down3rdflr-trigg-tile'])
    downthirdTrigger.play('moveflr-trigger')

    const downsecondTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(-90, 2243), scale(4), 'down2ndflr-trigg-tile'])
    downsecondTrigger.play('moveflr-trigger')

    const downfirstTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(-90, 3151), scale(4), 'down1stflr-trigg-tile'])
    downfirstTrigger.play('moveflr-trigger')

    //player
    const player = add([
        sprite('player-down'),
        pos(266, 3907), //1192, 3907
        scale(4),
        z(3),
        area(),
        body(),{
            currentSprite: 'player-down',
            speed: 550,
            isInDialogue: false
        }
    ])
    
    spawnAvatar(player)

    if (!mapState){
        mapState = {
            playerPos: player.pos
        }
    }

    player.pos = vec2(mapState.playerPos)

    
    let created = false;
    // Floor Determinants
    let floorNumber;
    // Coordinates
    let firstFloor = 3872;
    let secondFloor = 3001;
    let thirdFloor = 2093;
    let fourthFloor = 1203;
    let fifthFloor = 301;
    
    // if(player.pos.y === firstFloor){
    //     floorNumber = 0;
    // }else if(player.pos.y === secondFloor){
    //     floorNumber = 1;
    // }else if(player.pos.y === thirdFloor){
    //     floorNumber = 2;
    // }else if(player.pos.y === fourthFloor){
    //     floorNumber = 3;
    // }else if(player.pos.y === fifthFloor){
    //     floorNumber = 4;
    // }else { // if ever there is an error will just use first floor
    //     floorNumber = 0;
    // }

    if(player.pos.y >= 3744 && player.pos.y <= 4096){
        floorNumber = 0;
    }else if(player.pos.y >= 2848 && player.pos.y <= 3072){
        floorNumber = 1;
    }else if(player.pos.y >= 1952 && player.pos.y <= 2176){
        floorNumber = 2;
    }else if(player.pos.y >= 1056 && player.pos.y <= 1280){
        floorNumber = 3;
    }else if(player.pos.y >= 160 && player.pos.y <= 384){
        floorNumber = 4;
    }else { // if ever there is an error will just use first floor
        floorNumber = 0;
    }
    showFloorName(created,`${bldgs[3].bldg_name}\n${floorNames[floorNumber].floor_number}`) 


    //X    d=door  d0 d1   d2   d3   d4   d5   d6   d7  d8    d9  d10 > outlier
    const xCoord = [0,770,1024,1792,2048,2816,3072,3840,4097,4864,128];
    //Y             1st  2nd   3rd  4th  5th
    const yCoord = [3744,2848,1952,1056,160];
            // "0,3744"," "770,3744" "1024,3744" "2048,3744" "3072,3744"
            // "128,2848" "1024,2848" "2048,2848" "3072,2848"
            // "0,1952" "770,1952" "1024,1952" "2048,1952" "3072,1952"
            // "0,1056" "770,1056" "1024,1056" "2048,1056" "3072,1056"
            // "1024,160"
    let firstFloorRoomPositions =   [ [xCoord[0],yCoord[0]], [xCoord[1],yCoord[0]], [xCoord[2],yCoord[0]],                        [xCoord[4],yCoord[0]],                        [xCoord[6],yCoord[0]]   ];
    let secondFloorRoomPositions =  [ [xCoord[10],yCoord[1]],                       [xCoord[2],yCoord[1]],                        [xCoord[4],yCoord[1]],                        [xCoord[6],yCoord[1]]   ];
    let thirdFloorRoomPositions =   [ [xCoord[0],yCoord[2]], [xCoord[1],yCoord[2]], [xCoord[2],yCoord[2]],                        [xCoord[4],yCoord[2]],                        [xCoord[6],yCoord[2]]   ];
    let fourthFloorRoomPositions =  [ [xCoord[0],yCoord[3]], [xCoord[1],yCoord[3]], [xCoord[2],yCoord[3]],                        [xCoord[4],yCoord[3]],                        [xCoord[6],yCoord[3]]   ];
    let fifthFloorRoomPositions =   [                                               [xCoord[2],yCoord[4]]                                                                                               ];

    const val = showRoomName(floorNames,roomNames,[firstFloorRoomPositions,secondFloorRoomPositions,thirdFloorRoomPositions,fourthFloorRoomPositions,fifthFloorRoomPositions],[40,125])
    val.forEach(v =>{ 
        if(v.insideRoom !== undefined){      
            player.onCollide(v.insideRoom,()=>{  // setting up ng player collision            
                console.log("v.interactionss",v.interaction)
                console.log("v.insideRoomss",v.insideRoom)
                let vSplit = `${v.insideRoom}`.split('-w-') // will store [0] and [1] indeces which 0 contains the name and 1 the purpose   
                if (vSplit[1].match("Classroom")){
                    returnPos = vSplit[2]
                    flashScreen()
                    setTimeout(() => {
                        mapState.playerPos =  vec2(2080, 640)
                        go("inOBclassroom", mapState)
                    }, 1000)
                }
                else if (vSplit[1].match("Library")){
                    returnPos = vSplit[2]
                    flashScreen()
                    setTimeout(() => {
                        mapState.playerPos =  vec2(913, 633)
                        go("inLibrary", mapState)
                    }, 1000)
                }
                else if (vSplit[1].match("Laboratory")){
                    if (vSplit[0].match("Computer Laboratory 1")){
                        returnPos = vSplit[2]
                        flashScreen()
                        setTimeout(() => {
                            mapState.playerPos =  vec2(1329, 595)
                            go("inCECScomlab", mapState)
                        }, 1000)
                    }
                    else {
                        returnPos = vSplit[2]
                        flashScreen()
                        setTimeout(() => {
                            mapState.playerPos =  vec2(2080, 640)
                            go("inOBclassroom", mapState)
                        }, 1000)
                    }
                }
                else if (vSplit[1].match("Office")){
                    if (vSplit[0].match("Music/Dance Studio")){
                    returnPos = vSplit[2]
                    flashScreen()
                    setTimeout(() => {
                        mapState.playerPos =  vec2(2080, 640)
                        go("inOBclassroom", mapState)
                    }, 1000)
                }
                else if (vSplit[0].match("Clinic")){
                    displayDialogue(player, "Nagresign na si doc. Alis ka muna d2, \nTinkyu.")
                }
                else {
                    console.log("Let's explore the area ahead of us later")                
                    displayDialogue(player, "Faculty only.")
                }
                
            }
                console.log(vSplit, v)
            })
        } else {
  
            player.onCollide(v.interaction,()=>{  // setting up ng player collision +`-w-${quests[i].quest_type}-w-${quests[i].quest_id}`
                console.log("interactioninteraction",v.interaction)
                console.log("v.interactionss",v.interaction,v,val)
                let vSplit = `${v.interaction}`.split("-w-");                
                if(vSplit[1] === "Picture Selection"){
                    console.log(vSplit[2])
                    destroyAll(v.interaction);
                    questUpdate.push(questTempContainer.filter(q=>q.quest_id === parseInt(vSplit[2]))[0].quest_id);
                    const index = val.indexOf(v.interaction);
                    const x = val.splice(index, 1);
                    questTempContainer = questTempContainer.filter(q=>q.quest_id !== parseInt(vSplit[2]));
                    indexArray = indexArray.filter( i => i!==quests.findIndex(q => q===quests.filter(q=>q.quest_id === parseInt(vSplit[2]))[0]))
                    changeInfo('ps',psQuest,v.question,v.choices) 
                    pictureSelection.style.visibility = 'visible';
                }else if(vSplit[1] === "Multiple Choice"){
                    console.log(vSplit[2])
                    //v.interaction
                    
                    destroyAll(v.interaction);
                    questUpdate.push(questTempContainer.filter(q=>q.quest_id === parseInt(vSplit[2]))[0].quest_id);
                    const index = val.indexOf(v.interaction);
                    const x = val.splice(index, 1);
                    questTempContainer = questTempContainer.filter(q=>q.quest_id !== parseInt(vSplit[2]));
                    indexArray = indexArray.filter( i => i!==quests.findIndex(q => q===quests.filter(q=>q.quest_id === parseInt(vSplit[2]))[0]))
                    changeInfo('mc',ddQuest,v.question,v.choices);  
                    dragAndDrop.style.visibility = 'visible';
                }else if(vSplit[1] === "Fill in the Blanks"){
                    console.log(vSplit[2])
                    destroyAll(v.interaction);
                    questUpdate.push(questTempContainer.filter(q=>q.quest_id === parseInt(vSplit[2]))[0].quest_id);
                    const index = val.indexOf(v.interaction);
                    const x = val.splice(index, 1);
                    questTempContainer = questTempContainer.filter(q=>q.quest_id !== parseInt(vSplit[2]));
                    indexArray = indexArray.filter( i => i!==quests.findIndex(q => q===quests.filter(q=>q.quest_id === parseInt(vSplit[2]))[0]))
                    changeInfo('fb',fbQuest,v.question,v.choices); 
                    fillInTheBlanks.style.visibility = 'visible';
                }
            })
        } 

        
    })

    //return outside
    onCollidewithPlayer('returnMap-trigg-tile', player, mapState, 'bsu-map',  vec2(2986, 1526))
    //                move up
    //to 2nd flr
    onCollidewithPlayer('to2ndflr-trigg-tile', player, mapState, 'inOB',  vec2(2444, 3001))
    //to 3rd flr
    onCollidewithPlayer('to3rdflr-trigg-tile', player, mapState, 'inOB',  vec2(2444, 2093))
    //to 4th flr
    onCollidewithPlayer('to4thflr-trigg-tile', player, mapState, 'inOB',  vec2(2444, 1203))
    //to 5th flr
    onCollidewithPlayer('to5thflr-trigg-tile', player, mapState, 'inOB',  vec2(2444, 301))
    //                move down
    //down 4th flr
    onCollidewithPlayer('down4thflr-trigg-tile', player, mapState, 'inOB',  vec2(2444, 1203))
    //down 3rd flr
    onCollidewithPlayer('down3rdflr-trigg-tile', player, mapState, 'inOB',  vec2(2444, 2093))
    //down 2nd flr
    onCollidewithPlayer('down2ndflr-trigg-tile', player, mapState, 'inOB',  vec2(2444, 3001))
    //down 1st flr
    onCollidewithPlayer('down1stflr-trigg-tile', player, mapState, 'inOB',  vec2(2444, 3872))
}

//-------------------------------------------------------------FACADE SCENE FUNCTION----------------------------------------------------------
function setFacade(mapState){
    setBackground(Color.fromHex('#3a3a3a'))
    let questActive = (questTempContainer.length >= 3) ? true : false;
    console.log(questActive)
    if(!questActive){        
        randomizeQuest();
        questUpdate = []
    }
    add([
        pos(850,10),
        text(`Remaining Quests: ${questTempContainer.length}`),
        z(5),
        color(0,0,0),
        'quest-counter-text',
        fixed(),
    ]);
    add([
        pos(850,10),
        rect(400,100, {radius: 20}),
        z(4),
        opacity(0.8),
        color(255,255,255),
        'quest-counter-placard',
        fixed(),
    ]);    
    displayDay()
    const facade = [
        addLevel([//ground
        '                         ',
        '        2222222211111    ',
        '        .....222.....    ',
        '                         ',
        '                         ',
        '                         ',
        '                         '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                '1': () => makeTile('tile', 'dirtv1'),
                '2': () => makeTile('tile','dirtpath'),
                '.': () => makeTile('tile','sparsegrass')
            }
        }),
        addLevel([
        '                         ',
        '        abcdefghdeabc    ',
        '        ijklmnoplmijk    ',
        '        qrstuvwxtuqrs    ',
        '        yz.,:;[][][]]    ',
        '                         '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                'a': () => makeTile('facade',''),
                'b': () => makeTile('facade','pt1'),
                'c': () => makeTile('facade','pt2'),
                'd': () => makeTile('facade','pt3'),
                'e': () => makeTile('facade','pt4'), 
                'f': () => makeTile('facade','pt5'), 
                'g': () => makeTile('facade','pt6'),
                'h': () => makeTile('facade','pt7'),
                'i': () => makeTile('facade','pt8'),
                'j': () => makeTile('facade','pt9'),
                'k': () => makeTile('facade','pt10'),
                'l': () => makeTile('facade','pt11'),
                'm': () => makeTile('facade','pt12'),
                'n': () => makeTile('facade','pt13'),
                'o': () => makeTile('facade','pt14'),
                'p': () => makeTile('facade','pt15'),
                'q': () => makeTile('facade','pt16'),
                'r': () => makeTile('facade','pt17'),
                's': () => makeTile('facade','pt18'),
                't': () => makeTile('facade','pt19'),
                'u': () => makeTile('facade','pt20'),
                'v': () => makeTile('facade','pt21'),
                'w': () => makeTile('facade','pt22'),
                'x': () => makeTile('facade','pt23'),
                'y': () => makeTile('facade','pt24'),
                'z': () => makeTile('facade','pt25'),
                '.': () => makeTile('facade','pt26'),
                ',': () => makeTile('facade','pt27'),
                ':': () => makeTile('facade','pt28'),
                ';': () => makeTile('facade','pt29'),
                '[': () => makeTile('facade','pt30'), 
                ']': () => makeTile('facade','pt31')
            }
        }),
        addLevel([//collision
        '                              ',
        '        0000000000000         ',
        '       033333333333332        ',
        '       0             2        ',
        '       0             2        ',
        '       011111111111112        ',
        '                              '
    ], {
        tileWidth: 32,
        tileHeight: 32,
        tiles: {
            '0': () => [//whole to right offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(5, 0)}),
                body({isStatic: true})
            ],
            '1': () => [//whole to up offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(0, -5)}),
                body({isStatic: true})
            ],
            '2': () => [//whole to left offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(-5, 0)}),
                body({isStatic: true})
            ],
            '3': () => [//half tile horizontal
                area({shape: new Rect(vec2(0), 32, 16), 
                    offset: vec2(0, 0)}),
                body({isStatic: true})
            ]
        }
    })
    ]

    for (const layer of facade) {
        layer.use(scale(4))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }

    add([
        pos(80, 120),
        rect(20, 40),
        outline(4),
        area(),
    ])

    //triggers
    add([area({shape: new Rect(vec2(0, 0), 32, 10)}), body({isStatic: true}), pos(1850, 290), scale(4), 'enter-trigg'])
    add([area({shape: new Rect(vec2(0, 0), 40, 20)}), body({isStatic: true}), pos(1100, 610), scale(4), 'exit-trigg'])
    add([area({shape: new Rect(vec2(0), 5, 5), offset: vec2(0, 0)}), anchor("center"), body({isStatic: true}), pos(1723, 365), scale(4), 'cat'])
    //ceiling
    add([pos(1024, 100), rect(416, 10), scale(4), outline(.9)])
    //player
    const player = add([
        sprite('player-down'),
        pos(1856, 489),
        scale(4),
        z(3),
        area({shape: new Rect(vec2(0, 0), 21, 21)}),
        anchor("center"),
        body(),{
            currentSprite: 'player-down',
            speed: 400,
            isInDialogue: false
        }
    ])
    
    spawnAvatar(player)

    if (!mapState){
        mapState = {
            playerPos: player.pos
        }
    }

    player.pos = vec2(mapState.playerPos)

    //cat easter egg
    player.onCollide('cat', ()=>{
        add([
            pos(1695, 290),
            text("meow", {
                size: 20, 
                width: 320,
                font: "sans-serif",
            }),
            z(2),
            color(Color.fromHex("#000000")),
            'cat-meow'
        ])
        add([pos(1682, 280), rect(20, 10, {radius: 5}), scale(4), outline(.9), z(1), opacity(0.8), 'cat-dialogue'])
    })
    player.onCollideEnd('cat', ()=>{
        destroyAll('cat-meow')
        destroyAll('cat-dialogue')
    })

    //enter campus
    onCollidewithPlayer('enter-trigg', player, mapState, 'bsu-map',  vec2(1895, 2432)) 
    //exit campus
    onCollidewithPlayer('exit-trigg', player, mapState, 'bsu-map',  vec2(1665, 2760)) 

}



//-------------------------CLASSROOMS SCENE FUNCS-------------------

//LSB/CECS
function setCECScomlab(mapState){
    setBackground(Color.fromHex("#3a3a3a"))
    console.log("i read that pos is: ", returnPos)
    console.log("You were previously in: ", inBldg)
    const cecsroom = [
        addLevel([//room
        '                          ',
        '        abcdefghi         ',
        '        jklmnopqr         ',
        '        stuvwxyz.         ',
        '        ,:;[]{}|~         ',
        '        `!@#$%^&*         ',
        '                          '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                'a': () => makeTile('cecs-comlab',''),
                'b': () => makeTile('cecs-comlab','pt1'),
                'c': () => makeTile('cecs-comlab','pt2'),
                'd': () => makeTile('cecs-comlab','pt3'),
                'e': () => makeTile('cecs-comlab','pt4'), 
                'f': () => makeTile('cecs-comlab','pt5'), 
                'g': () => makeTile('cecs-comlab','pt6'),
                'h': () => makeTile('cecs-comlab','pt7'),
                'i': () => makeTile('cecs-comlab','pt8'),
                'j': () => makeTile('cecs-comlab','pt9'),
                'k': () => makeTile('cecs-comlab','pt10'),
                'l': () => makeTile('cecs-comlab','pt11'),
                'm': () => makeTile('cecs-comlab','pt12'),
                'n': () => makeTile('cecs-comlab','pt13'),
                'o': () => makeTile('cecs-comlab','pt14'),
                'p': () => makeTile('cecs-comlab','pt15'),
                'q': () => makeTile('cecs-comlab','pt16'),
                'r': () => makeTile('cecs-comlab','pt17'),
                's': () => makeTile('cecs-comlab','pt18'),
                't': () => makeTile('cecs-comlab','pt19'),
                'u': () => makeTile('cecs-comlab','pt20'),
                'v': () => makeTile('cecs-comlab','pt21'),
                'w': () => makeTile('cecs-comlab','pt22'),
                'x': () => makeTile('cecs-comlab','pt23'),
                'y': () => makeTile('cecs-comlab','pt24'),
                'z': () => makeTile('cecs-comlab','pt25'),
                '.': () => makeTile('cecs-comlab','pt26'),
                ',': () => makeTile('cecs-comlab','pt27'),
                ':': () => makeTile('cecs-comlab','pt28'),
                ';': () => makeTile('cecs-comlab','pt29'),
                '[': () => makeTile('cecs-comlab','pt30'), 
                ']': () => makeTile('cecs-comlab','pt31'), 
                '{': () => makeTile('cecs-comlab','pt32'),
                '}': () => makeTile('cecs-comlab','pt33'),
                '|': () => makeTile('cecs-comlab','pt34'),
                '~': () => makeTile('cecs-comlab','pt35'),
                '`': () => makeTile('cecs-comlab','pt36'),
                '!': () => makeTile('cecs-comlab','pt37'),
                '@': () => makeTile('cecs-comlab','pt38'),
                '#': () => makeTile('cecs-comlab','pt39'),
                '$': () => makeTile('cecs-comlab','pt40'),
                '%': () => makeTile('cecs-comlab','pt41'),
                '^': () => makeTile('cecs-comlab','pt42'),
                '&': () => makeTile('cecs-comlab','pt43'),
                '*': () => makeTile('cecs-comlab','pt44')
            }
        }),
        addLevel([//collision
        '        000000000         ',
        '       00000000002        ',
        '       06       72        ',
        '       04444     2        ',
        '       06        2        ',
        '       0  55555  2        ',
        '        111111111         '
    ], {
        tileWidth: 32,
        tileHeight: 32,
        tiles: {
            '0': () => [//whole to right offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(5, 0)}),
                body({isStatic: true})
            ],
            '1': () => [//whole to up offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(0, -5)}),
                body({isStatic: true})
            ],
            '2': () => [//whole to left offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(-7, 0)}),
                body({isStatic: true})
            ],
            '3': () => [//half tile horizontal
                area({shape: new Rect(vec2(0), 32, 16), 
                    offset: vec2(0, 0)}),
                body({isStatic: true})
            ],
            '4': () => [//half tile horizontal offset
                area({shape: new Rect(vec2(0), 32, 16), 
                    offset: vec2(-5, 8)}),
                body({isStatic: true})
            ],
            '5': () => [//half tile horizontal offset2
                area({shape: new Rect(vec2(0), 50, 16), 
                    offset: vec2(-10, 14)}),
                body({isStatic: true})
            ],
            '6': () => [//half tile horizontal
                area({shape: new Rect(vec2(0), 18, 32), 
                    offset: vec2(0, 0)}),
                body({isStatic: true})
            ],
            '7': () => [//half tile horizontal
                area({shape: new Rect(vec2(0), 18, 16), 
                    offset: vec2(13, 0)}),
                body({isStatic: true})
            ]
            
        }
    })
    ]

    for (const layer of cecsroom) {
        layer.use(scale(4))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }

    add([area({shape: new Rect(vec2(0, 0), 30, 20)}), body({isStatic: true}), pos(1050, 735), scale(4), 'return-trigg'])

    //player
    const player = add([
        sprite('player-down'),
        pos(2042, 640),
        scale(4),
        z(3),
        area({shape: new Rect(vec2(0, 0), 21, 21)}),
        anchor("center"),
        body(),{
            currentSprite: 'player-down',
            speed: 550,
            isInDialogue: false
        }
    ])
    
    spawnAvatar(player)

    if (!mapState){
        mapState = {
            playerPos: player.pos
        }
    }

    player.pos = vec2(mapState.playerPos)

    returnPos = returnPos.split(",")
    console.log("returnPos.split",returnPos[0], returnPos[1])
    if (inBldg === "CECS"){
        onCollidewithPlayer('return-trigg', player, mapState, 'inCECS',  vec2(parseInt(returnPos[0]), parseInt(returnPos[1]))) 
    }
    else if (inBldg === "HEB"){
        onCollidewithPlayer('return-trigg', player, mapState, 'inHEB',  vec2(parseInt(returnPos[0]), parseInt(returnPos[1])+140)) 
    }
    else if (inBldg === "OB"){
        onCollidewithPlayer('return-trigg', player, mapState, 'inOB',  vec2(parseInt(returnPos[0]), parseInt(returnPos[1])+140)) 
    }
}

//VMB/HEB
function setHEBclassroom(mapState){
    setBackground(Color.fromHex("#3a3a3a"))
    console.log("i read that pos is: ", returnPos)
    console.log("You were previously in: ", inBldg)
    const hebroom = [
        addLevel([//room
        '                          ',
        '        abcdefghi         ',
        '        jklmnopqr         ',
        '        stuvwxyz.         ',
        '        ,:;[]{}|~         ',
        '        `!@#$%^&*         ',
        '                          '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                'a': () => makeTile('heb-room',''),
                'b': () => makeTile('heb-room','pt1'),
                'c': () => makeTile('heb-room','pt2'),
                'd': () => makeTile('heb-room','pt3'),
                'e': () => makeTile('heb-room','pt4'), 
                'f': () => makeTile('heb-room','pt5'), 
                'g': () => makeTile('heb-room','pt6'),
                'h': () => makeTile('heb-room','pt7'),
                'i': () => makeTile('heb-room','pt8'),
                'j': () => makeTile('heb-room','pt9'),
                'k': () => makeTile('heb-room','pt10'),
                'l': () => makeTile('heb-room','pt11'),
                'm': () => makeTile('heb-room','pt12'),
                'n': () => makeTile('heb-room','pt13'),
                'o': () => makeTile('heb-room','pt14'),
                'p': () => makeTile('heb-room','pt15'),
                'q': () => makeTile('heb-room','pt16'),
                'r': () => makeTile('heb-room','pt17'),
                's': () => makeTile('heb-room','pt18'),
                't': () => makeTile('heb-room','pt19'),
                'u': () => makeTile('heb-room','pt20'),
                'v': () => makeTile('heb-room','pt21'),
                'w': () => makeTile('heb-room','pt22'),
                'x': () => makeTile('heb-room','pt23'),
                'y': () => makeTile('heb-room','pt24'),
                'z': () => makeTile('heb-room','pt25'),
                '.': () => makeTile('heb-room','pt26'),
                ',': () => makeTile('heb-room','pt27'),
                ':': () => makeTile('heb-room','pt28'),
                ';': () => makeTile('heb-room','pt29'),
                '[': () => makeTile('heb-room','pt30'), 
                ']': () => makeTile('heb-room','pt31'), 
                '{': () => makeTile('heb-room','pt32'),
                '}': () => makeTile('heb-room','pt33'),
                '|': () => makeTile('heb-room','pt34'),
                '~': () => makeTile('heb-room','pt35'),
                '`': () => makeTile('heb-room','pt36'),
                '!': () => makeTile('heb-room','pt37'),
                '@': () => makeTile('heb-room','pt38'),
                '#': () => makeTile('heb-room','pt39'),
                '$': () => makeTile('heb-room','pt40'),
                '%': () => makeTile('heb-room','pt41'),
                '^': () => makeTile('heb-room','pt42'),
                '&': () => makeTile('heb-room','pt43'),
                '*': () => makeTile('heb-room','pt44')
            }
        }),
        addLevel([//collision
        '        000000000         ',
        '       03333333332        ',
        '       0 5555555r2        ',
        '       0stuvwxyz.2        ',
        '       0 6666666 2        ',
        '       0`!@#$%^&*2        ',
        '        111111111         '
    ], {
        tileWidth: 32,
        tileHeight: 32,
        tiles: {
            '0': () => [//whole to right offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(5, 0)}),
                body({isStatic: true})
            ],
            '1': () => [//whole to up offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(0, -5)}),
                body({isStatic: true})
            ],
            '2': () => [//whole to left offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(-7, 0)}),
                body({isStatic: true})
            ],
            '3': () => [//half tile horizontal
                area({shape: new Rect(vec2(0), 32, 16), 
                    offset: vec2(0, 0)}),
                body({isStatic: true})
            ],
            '5': () => [//chair upper half
                area({shape: new Rect(vec2(0), 2, 20), 
                offset: vec2(16, -5)}),
                body({isStatic: true})
            ],
            '6': () => [//chair lower half
                area({shape: new Rect(vec2(0), 2, 44), 
                offset: vec2(16, 10)}),
                body({isStatic: true})
            ]
        }
    })
    ]

    for (const layer of hebroom) {
        layer.use(scale(4))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }

    add([area({shape: new Rect(vec2(0, 0), 30, 20)}), body({isStatic: true}), pos(1050, 735), scale(4), 'return-trigg'])
    //player
    const player = add([
        sprite('player-down'),
        pos(2080, 640),
        scale(4),
        z(3),
        area({shape: new Rect(vec2(0, 0), 21, 21)}),
        anchor("center"),
        body(),{
            currentSprite: 'player-down',
            speed: 550,
            isInDialogue: false
        }
    ])
    
    spawnAvatar(player)

    if (!mapState){
        mapState = {
            playerPos: player.pos
        }
    }

    player.pos = vec2(mapState.playerPos)

    returnPos = returnPos.split(",")
    console.log(returnPos)

    if (inBldg === "CECS"){
        onCollidewithPlayer('return-trigg', player, mapState, 'inCECS',  vec2(parseInt(returnPos[0]), parseInt(returnPos[1]))) 
    }
    else if (inBldg === "HEB"){
        onCollidewithPlayer('return-trigg', player, mapState, 'inHEB',  vec2(parseInt(returnPos[0]), parseInt(returnPos[1])+140)) 
    }
}
//GZB/LDC
function setLDCclassroom(mapState){
    setBackground(Color.fromHex("#3a3a3a"))
    console.log("i read that pos is: ", returnPos)
    const ldcroom = [
        addLevel([//room
        '                          ',
        '        abcdefghi         ',
        '        jklmnopqr         ',
        '        stuvwxyz.         ',
        '        ,:;[]{}|~         ',
        '        `!@#$%^&*         ',
        '                          '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                'a': () => makeTile('ldc-room',''),
                'b': () => makeTile('ldc-room','pt1'),
                'c': () => makeTile('ldc-room','pt2'),
                'd': () => makeTile('ldc-room','pt3'),
                'e': () => makeTile('ldc-room','pt4'), 
                'f': () => makeTile('ldc-room','pt5'), 
                'g': () => makeTile('ldc-room','pt6'),
                'h': () => makeTile('ldc-room','pt7'),
                'i': () => makeTile('ldc-room','pt8'),
                'j': () => makeTile('ldc-room','pt9'),
                'k': () => makeTile('ldc-room','pt10'),
                'l': () => makeTile('ldc-room','pt11'),
                'm': () => makeTile('ldc-room','pt12'),
                'n': () => makeTile('ldc-room','pt13'),
                'o': () => makeTile('ldc-room','pt14'),
                'p': () => makeTile('ldc-room','pt15'),
                'q': () => makeTile('ldc-room','pt16'),
                'r': () => makeTile('ldc-room','pt17'),
                's': () => makeTile('ldc-room','pt18'),
                't': () => makeTile('ldc-room','pt19'),
                'u': () => makeTile('ldc-room','pt20'),
                'v': () => makeTile('ldc-room','pt21'),
                'w': () => makeTile('ldc-room','pt22'),
                'x': () => makeTile('ldc-room','pt23'),
                'y': () => makeTile('ldc-room','pt24'),
                'z': () => makeTile('ldc-room','pt25'),
                '.': () => makeTile('ldc-room','pt26'),
                ',': () => makeTile('ldc-room','pt27'),
                ':': () => makeTile('ldc-room','pt28'),
                ';': () => makeTile('ldc-room','pt29'),
                '[': () => makeTile('ldc-room','pt30'), 
                ']': () => makeTile('ldc-room','pt31'), 
                '{': () => makeTile('ldc-room','pt32'),
                '}': () => makeTile('ldc-room','pt33'),
                '|': () => makeTile('ldc-room','pt34'),
                '~': () => makeTile('ldc-room','pt35'),
                '`': () => makeTile('ldc-room','pt36'),
                '!': () => makeTile('ldc-room','pt37'),
                '@': () => makeTile('ldc-room','pt38'),
                '#': () => makeTile('ldc-room','pt39'),
                '$': () => makeTile('ldc-room','pt40'),
                '%': () => makeTile('ldc-room','pt41'),
                '^': () => makeTile('ldc-room','pt42'),
                '&': () => makeTile('ldc-room','pt43'),
                '*': () => makeTile('ldc-room','pt44')
            }
        }),
        addLevel([//collision
        '        000000000         ',
        '       03333333332        ',
        '       0 5555555r2        ',
        '       0stuvwxyz.2        ',
        '       0 6666666 2        ',
        '       0`!@#$%^&*2        ',
        '        111111111         '
    ], {
        tileWidth: 32,
        tileHeight: 32,
        tiles: {
            '0': () => [//whole to right offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(5, 0)}),
                body({isStatic: true})
            ],
            '1': () => [//whole to up offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(0, -5)}),
                body({isStatic: true})
            ],
            '2': () => [//whole to left offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(-7, 0)}),
                body({isStatic: true})
            ],
            '3': () => [//half tile horizontal
                area({shape: new Rect(vec2(0), 32, 16), 
                    offset: vec2(0, 0)}),
                body({isStatic: true})
            ],
            '5': () => [//chair upper half
                area({shape: new Rect(vec2(0), 2, 20), 
                offset: vec2(16, -5)}),
                body({isStatic: true})
            ],
            '6': () => [//chair lower half
                area({shape: new Rect(vec2(0), 2, 44), 
                offset: vec2(16, 10)}),
                body({isStatic: true})
            ]
        }
    })
    ]

    for (const layer of ldcroom) {
        layer.use(scale(4))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }

    add([area({shape: new Rect(vec2(0, 0), 30, 20)}), body({isStatic: true}), pos(1050, 735), scale(4), 'return-trigg'])

    //player
    const player = add([
        sprite('player-down'),
        pos(2080, 640),
        scale(4),
        z(3),
        area({shape: new Rect(vec2(0, 0), 21, 21)}),
        anchor("center"),
        body(),{
            currentSprite: 'player-down',
            speed: 550,
            isInDialogue: false
        }
    ])
    
    spawnAvatar(player)

    if (!mapState){
        mapState = {
            playerPos: player.pos
        }
    }

    player.pos = vec2(mapState.playerPos)
    returnPos = returnPos.split(",")
    console.log(returnPos)
    onCollidewithPlayer('return-trigg', player, mapState, 'inLDC',  vec2(parseInt(returnPos[0]), parseInt(returnPos[1])+100))
}
//ABB/OB
function setOBclassroom(mapState){
    setBackground(Color.fromHex("#3a3a3a"))
    const obroom = [
        addLevel([//room
        '                          ',
        '        abcdefghi         ',
        '        jklmnopqr         ',
        '        stuvwxyz.         ',
        '        ,:;[]{}|~         ',
        '        `!@#$%^&*         ',
        '                          '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                'a': () => makeTile('ob-room',''),
                'b': () => makeTile('ob-room','pt1'),
                'c': () => makeTile('ob-room','pt2'),
                'd': () => makeTile('ob-room','pt3'),
                'e': () => makeTile('ob-room','pt4'), 
                'f': () => makeTile('ob-room','pt5'), 
                'g': () => makeTile('ob-room','pt6'),
                'h': () => makeTile('ob-room','pt7'),
                'i': () => makeTile('ob-room','pt8'),
                'j': () => makeTile('ob-room','pt9'),
                'k': () => makeTile('ob-room','pt10'),
                'l': () => makeTile('ob-room','pt11'),
                'm': () => makeTile('ob-room','pt12'),
                'n': () => makeTile('ob-room','pt13'),
                'o': () => makeTile('ob-room','pt14'),
                'p': () => makeTile('ob-room','pt15'),
                'q': () => makeTile('ob-room','pt16'),
                'r': () => makeTile('ob-room','pt17'),
                's': () => makeTile('ob-room','pt18'),
                't': () => makeTile('ob-room','pt19'),
                'u': () => makeTile('ob-room','pt20'),
                'v': () => makeTile('ob-room','pt21'),
                'w': () => makeTile('ob-room','pt22'),
                'x': () => makeTile('ob-room','pt23'),
                'y': () => makeTile('ob-room','pt24'),
                'z': () => makeTile('ob-room','pt25'),
                '.': () => makeTile('ob-room','pt26'),
                ',': () => makeTile('ob-room','pt27'),
                ':': () => makeTile('ob-room','pt28'),
                ';': () => makeTile('ob-room','pt29'),
                '[': () => makeTile('ob-room','pt30'), 
                ']': () => makeTile('ob-room','pt31'), 
                '{': () => makeTile('ob-room','pt32'),
                '}': () => makeTile('ob-room','pt33'),
                '|': () => makeTile('ob-room','pt34'),
                '~': () => makeTile('ob-room','pt35'),
                '`': () => makeTile('ob-room','pt36'),
                '!': () => makeTile('ob-room','pt37'),
                '@': () => makeTile('ob-room','pt38'),
                '#': () => makeTile('ob-room','pt39'),
                '$': () => makeTile('ob-room','pt40'),
                '%': () => makeTile('ob-room','pt41'),
                '^': () => makeTile('ob-room','pt42'),
                '&': () => makeTile('ob-room','pt43'),
                '*': () => makeTile('ob-room','pt44')
            }
        }),
        addLevel([//collision
        '        000000000         ',
        '       03333333332        ',
        '       0 5555555r2        ',
        '       0stuvwxyz.2        ',
        '       0 6666666 2        ',
        '       0`!@#$%^&*2        ',
        '        111111111         '
    ], {
        tileWidth: 32,
        tileHeight: 32,
        tiles: {
            '0': () => [//whole to right offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(5, 0)}),
                body({isStatic: true})
            ],
            '1': () => [//whole to up offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(0, -5)}),
                body({isStatic: true})
            ],
            '2': () => [//whole to left offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(-7, 0)}),
                body({isStatic: true})
            ],
            '3': () => [//half tile horizontal
                area({shape: new Rect(vec2(0), 32, 16), 
                    offset: vec2(0, 0)}),
                body({isStatic: true})
            ],
            '5': () => [//chair upper half
                area({shape: new Rect(vec2(0), 2, 20), 
                offset: vec2(16, -5)}),
                body({isStatic: true})
            ],
            '6': () => [//chair lower half
                area({shape: new Rect(vec2(0), 2, 44), 
                offset: vec2(16, 10)}),
                body({isStatic: true})
            ]
        }
    })
    ]

    for (const layer of obroom) {
        layer.use(scale(4))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }

    add([area({shape: new Rect(vec2(0, 0), 30, 20)}), body({isStatic: true}), pos(1050, 735), scale(4), 'return-trigg'])

    //player
    const player = add([
        sprite('player-down'),
        pos(2080, 640),
        scale(4),
        z(3),
        area({shape: new Rect(vec2(0, 0), 21, 21)}),
        anchor("center"),
        body(),{
            currentSprite: 'player-down',
            speed: 550,
            isInDialogue: false
        }
    ])
    
    spawnAvatar(player)

    if (!mapState){
        mapState = {
            playerPos: player.pos
        }
    }

    player.pos = vec2(mapState.playerPos)
    returnPos = returnPos.split(",")
    console.log(returnPos)
    onCollidewithPlayer('return-trigg', player, mapState, 'inOB',  vec2(parseInt(returnPos[0]), parseInt(returnPos[1])+140))
}

function setLibrary(mapState){
    setBackground(Color.fromHex("#3a3a3a"))
    const library = [
        addLevel([//room
        '                          ',
        '      abcdefghijklm       ',
        '      nopqrstuvwxyz       ',
        '      .,:;[]{}|~`!@       ',
        '      #$%^&*<>?/+←→       ',
        '      ↑↓αβθλμπΣσΦΩΔ       ',
        '                          '
        ], {
            tileWidth: 32,
            tileHeight: 32,
            tiles: {
                'a': () => makeTile('library',''),
                'b': () => makeTile('library','pt1'),
                'c': () => makeTile('library','pt2'),
                'd': () => makeTile('library','pt3'),
                'e': () => makeTile('library','pt4'), 
                'f': () => makeTile('library','pt5'), 
                'g': () => makeTile('library','pt6'),
                'h': () => makeTile('library','pt7'),
                'i': () => makeTile('library','pt8'),
                'j': () => makeTile('library','pt9'),
                'k': () => makeTile('library','pt10'),
                'l': () => makeTile('library','pt11'),
                'm': () => makeTile('library','pt12'),
                'n': () => makeTile('library','pt13'),
                'o': () => makeTile('library','pt14'),
                'p': () => makeTile('library','pt15'),
                'q': () => makeTile('library','pt16'),
                'r': () => makeTile('library','pt17'),
                's': () => makeTile('library','pt18'),
                't': () => makeTile('library','pt19'),
                'u': () => makeTile('library','pt20'),
                'v': () => makeTile('library','pt21'),
                'w': () => makeTile('library','pt22'),
                'x': () => makeTile('library','pt23'),
                'y': () => makeTile('library','pt24'),
                'z': () => makeTile('library','pt25'),
                '.': () => makeTile('library','pt26'),
                ',': () => makeTile('library','pt27'),
                ':': () => makeTile('library','pt28'),
                ';': () => makeTile('library','pt29'),
                '[': () => makeTile('library','pt30'), 
                ']': () => makeTile('library','pt31'), 
                '{': () => makeTile('library','pt32'),
                '}': () => makeTile('library','pt33'),
                '|': () => makeTile('library','pt34'),
                '~': () => makeTile('library','pt35'),
                '`': () => makeTile('library','pt36'),
                '!': () => makeTile('library','pt37'),
                '@': () => makeTile('library','pt38'),
                '#': () => makeTile('library','pt39'),
                '$': () => makeTile('library','pt40'),
                '%': () => makeTile('library','pt41'),
                '^': () => makeTile('library','pt42'),
                '&': () => makeTile('library','pt43'),
                '*': () => makeTile('library','pt44'),
                '<': () => makeTile('library','pt45'),
                '>': () => makeTile('library','pt46'),
                '?': () => makeTile('library','pt47'),
                '/': () => makeTile('library','pt48'),
                '+': () => makeTile('library','pt49'),
                '←': () => makeTile('library','pt50'),
                '→': () => makeTile('library','pt51'),
                '↑': () => makeTile('library','pt52'),
                '↓': () => makeTile('library','pt53'),
                'α': () => makeTile('library','pt54'),
                'β': () => makeTile('library','pt55'),
                'θ': () => makeTile('library','pt56'),
                'λ': () => makeTile('library','pt57'),
                'μ': () => makeTile('library','pt58'),
                'π': () => makeTile('library','pt59'),
                'Σ': () => makeTile('library','pt60'),
                'σ': () => makeTile('library','pt61'),
                'Φ': () => makeTile('library','pt62'),
                'Ω': () => makeTile('library','pt63'),
                'Δ': () => makeTile('library','pt64'),
                
            }
        }),
        addLevel([//collision
        '                            ',
        '     08 833333333332        ',
        '     06 5 44444444 2        ',
        '     06            2        ',
        '     0    8  9  #  2        ',
        '     0  7          2        ',
        '      1111111111111     '
    ], {
        tileWidth: 32,
        tileHeight: 32,
        tiles: {
            '0': () => [//whole to right offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(3, 0)}),
                body({isStatic: true})
            ],
            '1': () => [//whole to up offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(0, -5)}),
                body({isStatic: true})
            ],
            '2': () => [//whole to left offset tile 
                area({shape: new Rect(vec2(0), 32, 32), 
                offset: vec2(-5, 0)}),
                body({isStatic: true})
            ],
            '3': () => [//half tile horizontal
                area({shape: new Rect(vec2(0), 32, 16), 
                    offset: vec2(0, 0)}),
                body({isStatic: true})
            ],
            '4': () => [//bookshelf
                area({shape: new Rect(vec2(0), 32, 35), 
                    offset: vec2(0, -5)}),
                body({isStatic: true})
            ],
            '5': () => [//sofa
                area({shape: new Rect(vec2(0), 3, 35), 
                    offset: vec2(10, 0)}),
                body({isStatic: true})
            ],
            '6': () => [//half tile horizontal
                area({shape: new Rect(vec2(0), 18, 32), 
                    offset: vec2(0, 0)}),
                body({isStatic: true})
            ],
            '7': () => [//logbook table
                area({shape: new Rect(vec2(0), 20, 32), 
                    offset: vec2(0, -10)}),
                body({isStatic: true})
            ],
            '8': () => [//big table 1
                area({shape: new Rect(vec2(0), 56, 24), 
                    offset: vec2(14, 0)}),
                body({isStatic: true})
            ],
            '9': () => [//big table 2
                area({shape: new Rect(vec2(0), 56, 24), 
                    offset: vec2(4, 0)}),
                body({isStatic: true})
            ],
            '#': () => [//big table 3
                area({shape: new Rect(vec2(0), 56, 24), 
                    offset: vec2(-7, 0)}),
                body({isStatic: true})
            ],
        }
    })
    ]

    for (const layer of library) {
        layer.use(scale(4))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }
    add([area({shape: new Rect(vec2(0, 0), 30, 20)}), body({isStatic: true}), pos(800, 735), scale(4), 'return-trigg'])

    //player
    const player = add([
        sprite('player-down'),
        pos(913, 633), //913, 633
        scale(4),
        z(3),
        area({shape: new Rect(vec2(0, 0), 21, 21)}),
        anchor("center"),
        body(),{
            currentSprite: 'player-down',
            speed: 550,
            isInDialogue: false
        }
    ])
    
    spawnAvatar(player)

    if (!mapState){
        mapState = {
            playerPos: player.pos
        }
    }

    player.pos = vec2(mapState.playerPos)
    returnPos = returnPos.split(",")
    console.log(returnPos)
    onCollidewithPlayer('return-trigg', player, mapState, 'inOB',  vec2(parseInt(returnPos[0]), parseInt(returnPos[1])+140))
}

//#endregion

//------------------------------------------------------------------SCENES----------------------------------------------------------------

//intro
scene('tutorialStart', () => introBedroom())

//bedroom
scene('inBedroom', (mapState) => setBedroom(mapState))
scene('openedCloset', (mapState) => setCloset(mapState))

//main map
scene('bsu-map', (mapState) => setMap(mapState))

//inside buildings/other infrastructure
scene('inFacade', (mapState) => setFacade(mapState))
scene('inCECS', (mapState) => setCECS(mapState))
scene('inHEB', (mapState) => setHEB(mapState))
scene('inLDC', (mapState) => setLDC(mapState))
scene('inOB', (mapState) => setOB(mapState))

//inside building rooms
scene('inCECScomlab', (mapState) => setCECScomlab(mapState))
scene('inHEBclassroom', (mapState) => setHEBclassroom(mapState))
scene('inLDCclassroom', (mapState) => setLDCclassroom(mapState))
scene('inOBclassroom', (mapState) => setOBclassroom(mapState))
scene('inLibrary', (mapState) => setLibrary(mapState))

if (userExist){
    go('inBedroom')
}
else {
    go('tutorialStart')
}








})
.catch((error => console.log(error)));
}

initializeRecords(userId);