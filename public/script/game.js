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

function initializeRecords(userId){
    fetch(`http://localhost:3000/user/${userId}/rec`)
    .then(response => response.json())
    .then(data => {
        records = data;
        // let curQuest = 1;

        // Setting Quests
        for(let i = 0; i < records.userRecords.length;i = i + 4){ // Filtering out quests | Can try to create obj and merge choices
            let tempQuest = {};
            tempQuest.quest_id = records.userRecords[i].quest_id; 
            tempQuest.question = records.userRecords[i].question; 
            tempQuest.quest_type = records.userRecords[i].quest_type; 
            tempQuest.status = records.userRecords[i].user_quest_status; 
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
            tempQuest.choices = tempChoice;
            quests.push(tempQuest)
        }

        // User Credss 
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



// ------------------------------------------------------- KABOOM! -------------------------------------------------------

kaboom ({
    width: 1280,
    height: 960,
    scale: 0.7
})

//visual debugging (helps see position and collision/trigger tiles)
//debug.inspect = true

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
//asset tiling
function loadAssets() {
    //load character 
    let avatar = (avatarUser.avatar_id === 1) ? "boy" : "girl"; // If 1, yuhgie, else bad di
    let garment = "techis";// this will be sent by another ejs file, from bedroom
    loadCharSprite(avatar, garment)
    
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
    const flash = add([rect(1280, 960), color(10, 10, 10), fixed(), opacity(0)])
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
//location indicator
function locIndicator(content, position){
    return text(content, {
        pos: position, 
        origin: vec2(0, 0),
        fixed: true
    });
}

loadAssets()

//-----------------------------------------------------------BSU MAP SCENE FUNCTION-------------------------------------------------------
function setMap(mapState){
    setBackground(Color.fromHex('#8e7762'))
    
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
        pos(2050, 2820), //base (1670, 2300)
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

add([
    pos(2000, 3000),
    text(`Username: ${userCreds.first_name}
          Avatar: ${avatarUser.avatar_name}`, {
        size: 48, // 48 pixels tall
        width: 500, // it'll wrap to next line when width exceeds this value
        font: "sans-serif", // specify any font you loaded or browser built-in
    }),
])

    //enter the campus
    onCollidewithPlayer('enterCampus-trigg-tile', player, mapState, 'bsu-map', vec2(1895, 2432))
    //exit the campus
    onCollidewithPlayer('exitCampus-trigg-tile', player, mapState, 'bsu-map', vec2(1665, 2760))
    //go to cecs (lsb)
    onCollidewithPlayer('cecs-trigg-tile', player, mapState, 'inCECS', vec2(1143, 3872))
    //go to heb (vmb)
    onCollidewithPlayer('heb-trigg-tile', player, mapState, 'inHEB', vec2(2561, 3872))
    //return to heb from ldc
    onCollidewithPlayer('heb-trigg-tile2', player, mapState, 'inHEB', vec2(2561, 3872))
    //go to ldc (gzb) from back of heb pathway
    onCollidewithPlayer('ldc-trigg-tile', player, mapState, 'inLDC', vec2(3576, 3907))
    //go to ob (abb)
    onCollidewithPlayer('ob-trigg-tile', player, mapState, 'inOB', vec2(1125, 3907))

}

//-------------------------------------------------------------CECS SCENE FUNCTION--------------------------------------------------------
function setCECS(mapState){
    //change bg color
    setBackground(Color.fromHex('#3A3A3A'))

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
        '       kjjjjjjjkjjjjjjjkjjjjjjj0        ',
        '       0lllllllmlllllllmlllllll0        ',
        '       0000000000000000000000000        ',
        '                                        ',
        '                                        ',
        '       0000000000000000000000000        ',
        '       0333333333333333333333330        ',
        '       kjjjjjjjkjjjjjjjkjjjjjjj0        ',
        '       0lllllllmlllllllmlllllll0        ',
        '       0000000000000000000000000        ',
        '                                        ',
        '                                        ',
        '       0000000000000000000000000        ',
        '       0333333333333333333333330        ',
        '       kjjjjjjjkjjjjjjjkjjjjjjj0        ',
        '       0lllllllmlllllllmlllllll0        ',
        '       0000000000000000000000000        ',
        '                                        ',
        '                                        ',
        '       0000000000000000000000000        ',
        '       0333333333333333333333330        ',
        '       kjjjjjjjkjjjjjjjkjjjjjjj0        ',
        '       0lllllllmlllllllmlllllll0        ',
        '       0000000000000000000000000        ',
        '                                        ',
        '                                        ',
        '       0000000000000000000000000        ',
        '       0333333333333333333333330        ',
        '       kjjjjjjjkjjjjjjjkjjjjjjj0        ',
        '        lllllllmlllllllmlllllll0        ',
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
    const returnMapTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(900, 3852), scale(4), 'returnMap-trigg-tile'])
    returnMapTrigger.play('returnMap-trigger')
    //moving up flrs
    const secondflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3940, 3852), scale(4), 'to2ndflr-trigg-tile'])
    secondflrTrigger.play('moveflr-trigger') 

    const thirdflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3940, 2983), scale(4), 'to3rdflr-trigg-tile'])
    thirdflrTrigger.play('moveflr-trigger')

    const fourthflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3940, 2093), scale(4), 'to4thflr-trigg-tile'])
    fourthflrTrigger.play('moveflr-trigger')

    const fifthflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3940, 1203), scale(4), 'to5thflr-trigg-tile'])
    fifthflrTrigger.play('moveflr-trigger')
    //moving down flrs
    const downfourthTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(930, 301), scale(4), 'down4thflr-trigg-tile'])
    downfourthTrigger.play('moveflr-trigger')

    const downthirdTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(930, 1203), scale(4), 'down3rdflr-trigg-tile'])
    downthirdTrigger.play('moveflr-trigger')

    const downsecondTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(930, 2093), scale(4), 'down2ndflr-trigg-tile'])
    downsecondTrigger.play('moveflr-trigger')

    const downfirstTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(930, 2983), scale(4), 'down1stflr-trigg-tile'])
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

    //return outside
    onCollidewithPlayer('returnMap-trigg-tile', player, mapState, 'bsu-map',  vec2(1650, 2294))
    //                move up
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
    const ldcMapTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(2690, 3627), scale(4), 'ldcMap-trigg-tile'])
    ldcMapTrigger.play('ldc-trigger')
    //return to map
    const returnMapTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(2430, 4102), scale(4), 'returnMap-trigg-tile'])
    returnMapTrigger.play('returnMap-trigger')
    //moving up flrs
    const secondflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(4960, 3852), scale(4), 'to2ndflr-trigg-tile'])
    secondflrTrigger.play('moveflr-trigger') 

    const thirdflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(4960, 2983), scale(4), 'to3rdflr-trigg-tile'])
    thirdflrTrigger.play('moveflr-trigger')

    const fourthflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(4960, 2093), scale(4), 'to4thflr-trigg-tile'])
    fourthflrTrigger.play('moveflr-trigger')

    const fifthflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(4960, 1203), scale(4), 'to5thflr-trigg-tile'])
    fifthflrTrigger.play('moveflr-trigger')
    //moving down flrs
    const downfourthTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(-95, 301), scale(4), 'down4thflr-trigg-tile'])
    downfourthTrigger.play('moveflr-trigger')

    const downthirdTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(-95, 1203), scale(4), 'down3rdflr-trigg-tile'])
    downthirdTrigger.play('moveflr-trigger')

    const downsecondTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(-95, 2093), scale(4), 'down2ndflr-trigg-tile'])
    downsecondTrigger.play('moveflr-trigger')

    const downfirstTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(-95, 2983), scale(4), 'down1stflr-trigg-tile'])
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
        '0000000000000000000000000000 000        '
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
    const returnMapTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3576, 4097), scale(4), 'returnMap-trigg-tile'])
    returnMapTrigger.play('returnMap-trigger')
    //moving up flrs
    const secondflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3940, 3852), scale(4), 'to2ndflr-trigg-tile'])
    secondflrTrigger.play('moveflr-trigger') 

    const thirdflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(4950, 2983), scale(4), 'to3rdflr-trigg-tile'])
    thirdflrTrigger.play('moveflr-trigger')

    //moving down flrs
    const downsecondTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(-90, 2093), scale(4), 'down2ndflr-trigg-tile'])
    downsecondTrigger.play('moveflr-trigger')

    const downfirstTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(-90, 2983), scale(4), 'down1stflr-trigg-tile'])
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

    const obhallway = [
        addLevel([//5 floors
        '    abcdbcadabcdbcadabcdbcadabcdbca     ',
        '    hefgefigh<>gefighefgefighefgefi     ',
        '    jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj     ',
        '    lllllllllllllllllllllllllllllll     ',
        '                                        ',
        '                                        ',
        '                                        ',
        '    abcdbcadabcdbcadabcdbcadabcdbca     ',
        '    hefgefighefgefighefgefighefgefi     ',
        '    jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj     ',
        '    lllllllllllllllllllllllllllllll     ',
        '                                        ',
        '                                        ',
        '                                        ',
        '    abcdbcadabcdbcadabcdbcadabcdbca     ',
        '    hefgefighefgefighefgefighefgefi     ',
        '    jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj     ',
        '    lllllllllllllllllllllllllllllll     ',
        '                                        ',
        '                                        ',
        '                                        ',
        '    -~_!bcadabcdbcadabcdbcadabcdbca     ',
        '    [/]|efighefgefighefgefighefgefi     ',
        '    jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj     ',
        '    lllllllllllllllllllllllllllllll     ',
        '                                        ',
        '                                        ',
        '                                        ',
        '    abcdbcadabcdbcadabcdbcadabcdbca     ',
        '    hefgefighefgefighefgefighefgefi     ',
        '    jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj     ',
        '    lllllllllllllllllllllllllllllll     ',
        '    lllll                               '
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
        '   000000000000000000000000000000000    ',
        '   033333333333333333333333333333330    ',
        '   0jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj0    ',
        '   0lllllllllllllllllllllllllllllll0    ',
        '   000000000000000000000000000000000    ',
        '                                        ',
        '                                        ',
        '   000000000000000000000000000000000    ',
        '   033333333333333333333333333333330    ',
        '   0jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj0    ',
        '   0lllllllllllllllllllllllllllllll0    ',
        '   000000000000000000000000000000000    ',
        '                                        ',
        '                                        ',
        '   000000000000000000000000000000000    ',
        '   033333333333333333333333333333330    ',
        '   0jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj0    ',
        '   0lllllllllllllllllllllllllllllll0    ',
        '   000000000000000000000000000000000    ',
        '                                        ',
        '                                        ',
        '   000000000000000000000000000000000    ',
        '   033333333333333333333333333333330    ',
        '   0jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj0    ',
        '   0lllllllllllllllllllllllllllllll0    ',
        '   000000000000000000000000000000000    ',
        '                                        ',
        '                                        ',
        '   000000000000000000000000000000000    ',
        '   033333333333333333333333333333330    ',
        '   0jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj0    ',
        '   0lllllllllllllllllllllllllllllll0    ',
        '   0     000000000000000000000000000    ',
        '    00000                              '
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
    const returnMapTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(765, 4157), scale(4), 'returnMap-trigg-tile'])
    returnMapTrigger.play('returnMap-trigger')
    //moving up flrs
    const secondflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(4460, 3852), scale(4), 'to2ndflr-trigg-tile'])
    secondflrTrigger.play('moveflr-trigger') 

    const thirdflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(4460, 2983), scale(4), 'to3rdflr-trigg-tile'])
    thirdflrTrigger.play('moveflr-trigger')

    const fourthflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(4460, 2093), scale(4), 'to4thflr-trigg-tile'])
    fourthflrTrigger.play('moveflr-trigger')

    const fifthflrTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(4460, 1203), scale(4), 'to5thflr-trigg-tile'])
    fifthflrTrigger.play('moveflr-trigger')
    //moving down flrs
    const downfourthTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(410, 301), scale(4), 'down4thflr-trigg-tile'])
    downfourthTrigger.play('moveflr-trigger')

    const downthirdTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(410, 1203), scale(4), 'down3rdflr-trigg-tile'])
    downthirdTrigger.play('moveflr-trigger')

    const downsecondTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(410, 2093), scale(4), 'down2ndflr-trigg-tile'])
    downsecondTrigger.play('moveflr-trigger')

    const downfirstTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(410, 2983), scale(4), 'down1stflr-trigg-tile'])
    downfirstTrigger.play('moveflr-trigger')

    //player
    const player = add([
        sprite('player-down'),
        pos(1192, 3907), //1192, 3907
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



//------------------------------------------------------------------SCENES----------------------------------------------------------------
scene('bsu-map', (mapState) => setMap(mapState))
scene('inCECS', (mapState) => setCECS(mapState))
scene('inHEB', (mapState) => setHEB(mapState))
scene('inLDC', (mapState) => setLDC(mapState))
scene('inOB', (mapState) => setOB(mapState))
go('bsu-map')





});
}

initializeRecords(userId);