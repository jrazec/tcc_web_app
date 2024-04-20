kaboom ({
    width: 1280,
    height: 960,
    scale: 0.7
})
  

//-----------------------------------------------------------GLOBAL FUNCTIONS-------------------------------------------------------
//character tiling
function loadCharSprite(gender, clothing){
    let atlasName = `${gender}_${clothing}`;
    let imagePath = `/public/Assets/characs/${atlasName}.png`;

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
    loadCharSprite('boy', 'uniform')
    
    //load outside map
    loadSpriteAtlas('/public/Assets/map-tileset.png', {
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
                'free-space1': 125,
                'free-space2': 126,
                'free-space3': 127
            }}
    })

    //load trigger points (transparent tiles from map tileset)
    loadSpriteAtlas('/public/Assets/map-tileset.png', {
        'trigger-tile': {x: 0, y: 0, width: 512, height: 256, sliceX: 16, sliceY: 8,
            anims: {
                'cecs-trigger': 96, //125 for transparent, 96 is placeholder for visibility
                'heb-trigger': 97, //126
                'ob-trigger': 98, //127,
                'ldc-trigger': 99 //replace for another transparent tiel
            }}
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
function onCollidewithPlayer(bldgName, player, mapState, inBldg){
    
    player.onCollide(bldgName, () => {
        flashScreen()
        setTimeout(() => {
            mapState.playerPos = player.pos
            mapState.bldgName = bldgName
            go(inBldg, mapState)
        }, 1000)
    })
}


loadAssets()

//-----------------------------------------------------------BSU MAP SCENE FUNCTION-------------------------------------------------------
function setMap(mapState){
    setBackground(Color.fromHex('#817973'))
    
    function makeTile(type) {
        return [
            sprite('tile'),
            {type}
        ];
    }

    const map = [
        addLevel([//ground
            '                                        ',
            '   aa  aa a b aba a a aa b a bb aba b a ',
            'babab b a b b b bbb b  b a aaa b a bb b ',
            '    b    bbb    a  a aaaa   b bbbb  bb  ',
            '  bb ababab abaab abbbb baba ababab aba ',
            ' aab  ab abab bb b  aaa  bbb  a  b bb   ',
            '      b    b    a                       ',
            '             a      b                   ',
            '                b                       ',
            '                      a                 ',
            '                                        ',
            '            jkklijkkkkl                 ',
            '            ooopmnoooop                 ',
            '            ddddefgh                    ',
            '            dd                          ',
            '            dd   a                      ',
            '            ddd                         ',
            '            dda       b                 ',
            '            dd                          ',
            '              bb     a                  ',
            '                                        ',
            '                                        ',
            '                                        ',
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
                'a': () => makeTile('dirtv1'),
                'b': () => makeTile('dirtv2'),
                'c': () => makeTile('concrete'),
                'd': () => makeTile('groundtile'),
                'e': () => makeTile('stair-pt1'),
                'f': () => makeTile('stair-pt2'),
                'g': () => makeTile('stair-pt3'),
                'h': () => makeTile('stair-pt4'),
                'i': () => makeTile('path-pt1'),
                'j': () => makeTile('path-pt2'),
                'k': () => makeTile('path-pt3'),
                'l': () => makeTile('path-pt4'),
                'm': () => makeTile('path-pt5'),
                'n': () => makeTile('path-pt6'),
                'o': () => makeTile('path-pt7'),
                'p': () => makeTile('path-pt8'),

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
                '1': () => makeTile(''),
                '2': () => makeTile('cecs-pt2'),
                '3': () => makeTile('cecs-pt3'),
                '4': () => makeTile('cecs-pt4'),
                '5': () => makeTile('cecs-pt5'),
                '6': () => makeTile('cecs-pt6'),
                '7': () => makeTile('fcd-pt1'),
                '8': () => makeTile('fcd-pt2'),
                '9': () => makeTile('fcd-pt3'),
                '0': () => makeTile('fcd-pt4'),
                'a': () => makeTile('fcd-pt5'),
                'b': () => makeTile('fcd-pt6'),
                'c': () => makeTile('fcd-pt7'),
                'd': () => makeTile('fcd-pt8'),
                'e': () => makeTile('fcd-pt9'),
                'f': () => makeTile('heb-pt1'),
                'g': () => makeTile('heb-pt2'),
                'h': () => makeTile('heb-pt3'),
                'i': () => makeTile('heb-pt4'),
                'j': () => makeTile('heb-pt5'),
                'k': () => makeTile('heb-pt6'),
                'l': () => makeTile('heb-pt7'),
                'm': () => makeTile('heb-pt8'),
                'n': () => makeTile('heb-pt9'),
                'o': () => makeTile('heb-pt10'),
                'p': () => makeTile('heb-pt11'),
                'q': () => makeTile('heb-pt12'),
                'r': () => makeTile('heb-pt13'),
                's': () => makeTile('heb-pt14'),
                't': () => makeTile('heb-pt15'),
                'u': () => makeTile('heb-pt16'),
                'v': () => makeTile('heb-pt17'),
                'w': () => makeTile('heb-pt18'),
                'x': () => makeTile('heb-pt19'),
                'y': () => makeTile('heb-pt20'),
                'z': () => makeTile('heb-pt21'),
                '.': () => makeTile('heb-xtra'),
                ',': () => makeTile ('ldc-pt1'),
                '/': () => makeTile ('ldc-pt2'),
                '?': () => makeTile ('ldc-pt3'),
                ';': () => makeTile ('ldc-pt4'),
                ':': () => makeTile ('ldc-pt5'),
                '<': () => makeTile ('ldc-pt6'),
                '>': () => makeTile ('ldc-pt7'),
                '|': () => makeTile ('ldc-pt8'),
                ']': () => makeTile ('ldc-pt9'),
                '[': () => makeTile ('ldc-pt10'),
                '}': () => makeTile ('ldc-pt11'),
                '{': () => makeTile ('ldc-pt12'),
                '(': () => makeTile ('ldc-pt13'),
                ')': () => makeTile ('ldc-pt14'),
                '`': () => makeTile ('ob-pt1'),
                '@': () => makeTile ('ob-pt2'),
                '#': () => makeTile ('ob-pt3'),
                '$': () => makeTile ('ob-pt4'),
                '%': () => makeTile ('ob-pt5'),
                '^': () => makeTile ('ob-pt6'),
                '&': () => makeTile ('gym-pt1'),
                '*': () => makeTile ('gym-pt2'),
                '-': () => makeTile ('gym-pt3'),
                '_': () => makeTile ('gym-pt4'),
                '=': () => makeTile ('gym-pt5'),
                '+': () => makeTile ('gym-pt6'),
                '!': () => makeTile ('flag')
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
                '1': () => makeTile('hroof-pt1'),
                '2': () => makeTile('hroof-pt2'),
                '3': () => makeTile('hroof-pt3'),
                '4': () => makeTile('hroof-pt4'),
                '5': () => makeTile('hroof-pt5'),
                '6': () => makeTile('hroof-pt6'),
                '7': () => makeTile('vroof-pt1'),
                '8': () => makeTile('vroof-pt2'),
                '9': () => makeTile('vroof-pt3'),
                '0': () => makeTile('vroof-pt4'),
                'a': () => makeTile('vroof-pt5'),
                'b': () => makeTile('vroof-pt6'),
                'c': () => makeTile('sroof-pt1'),
                'd': () => makeTile('sroof-pt2'),
                'e': () => makeTile('sroof-pt3')
            }
        }),
        addLevel([//collision
            '        000000000000000000000            ',
            '        0    0000000        0            ',
            '        0    0000000        0            ',
            '        0    0000000        0            ',
            '        0    3333333        0            ',
            '        0                   0            ',
            '        0    9000000        0            ',
            '        0    9000000        0            ',
            '        0    9000000        0            ',
            '        0    90000000000000 0            ',
            '        0   03333333333  90 0            ',
            '        0  0             90 0            ',
            '        0  00            90 0            ',
            '        0  90--- 988890  90 0            ',
            '        0  90 908    90  90 0            ',
            '        0  90 9      90  90 0            ',
            '        0  90  |     90  90 0            ',
            '        0  90 9      90  90 0            ',
            '        0 081 2      80  81 0            ',
            '        0 0          999999 0            ',
            '        0  000000000 9      0            ',
            '        000         000000000            ',
            '                                         ',
            '                                         ',
            '                                         ',
            '                                         ',
            '                                         ',
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
    
    //place trigger points on the map
    const cecsTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(1470, 2230), scale(4), 'cecs-trigg-tile'])
    cecsTrigger.play('cecs-trigger')

    const hebTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(2045, 1220), scale(4), 'heb-trigg-tile'])
    hebTrigger.play('heb-trigger')

    //player
    const player = add([
        sprite('player-down'),
        pos(2070, 1465), //base (1670, 2300)
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


    

    //go to cecs (lsb)
    onCollidewithPlayer('cecs-trigg-tile', player, mapState, 'inCECS')
    //got to heb (vmb)
    onCollidewithPlayer('heb-trigg-tile', player, mapState, 'inHEB')
}

//-------------------------------------------------------------CECS SCENE FUNCTION--------------------------------------------------------
function setCECS(mapState){
    //change bg to black
    setBackground(Color.fromHex('#000000'))

    //player
    const player = add([
        sprite('player-down'),
        pos(1670, 2300),
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
}

//-------------------------------------------------------------HEB SCENE FUNCTION---------------------------------------------------------
function setHEB(mapState){
    //change bg color to gray temporarily for visibility
    setBackground(Color.fromHex('#808080'))

    //trigger point to ldc
    const ldcTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(2045, 1120), scale(4), 'ldc-trigg-tile'])
    ldcTrigger.play('ldc-trigger')

    //player
    const player = add([
        sprite('player-down'),
        pos(2050, 1350), //1670, 2300
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

    function onCollidewithPlayerLDC(bldgName, player, mapState, inBldg){
    
        player.onCollide(bldgName, () => {
            flashScreen()
            setTimeout(() => {
                mapState.playerPos = vec2(2170, 640)
                mapState.bldgName = bldgName
                go(inBldg, mapState)
            }, 1000)
        })
    }
    //go to ldc (gzb)
    onCollidewithPlayerLDC('ldc-trigg-tile', player, mapState, 'bsu-map')
}

//------------------------------------------------------------LDC SCENE FUNCTION----------------------------------------------------------
//function here

//-------------------------------------------------------------OB SCENE FUNCTION----------------------------------------------------------
//function here



//------------------------------------------------------------------SCENES----------------------------------------------------------------
scene('bsu-map', (mapState) => setMap(mapState))
scene('inCECS', (mapState) => setCECS(mapState))
scene('inHEB', (mapState) => setHEB(mapState))
//scene('inLDC', (mapState) => setLDC(mapState))
//scene('inOB', (mapState) => setOB(mapState))
go('bsu-map')