kaboom ({
    width: 1280,
    height: 960,
    scale: 0.7
})

//visual debugging
//debug.inspect = true

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
    
    //MAIN MAP --------- load outside map
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

    //TRIGGERS -------- load trigger points (transparent tiles from map tileset)
    loadSpriteAtlas('/public/Assets/map-tileset.png', {
        'trigger-tile': {x: 0, y: 0, width: 512, height: 256, sliceX: 16, sliceY: 8,
            anims: {
                'cecs-trigger': 112,
                'heb-trigger': 113, 
                'ob-trigger': 114, 
                'ldc-trigger': 115,
                'returnMap-trigger': 116 // ^
            }}
    })

    //FLOORS --------- load building common hallways/corridors
    loadSpriteAtlas('/public/Assets/hallway-tileset.png', {
        'hallway-tile':{x: 0, y: 0, width: 256, height: 224, sliceX: 8, sliceY: 7, 
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
                'ob-tile': 49
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

loadAssets()

//-----------------------------------------------------------BSU MAP SCENE FUNCTION-------------------------------------------------------
function setMap(mapState){
    setBackground(Color.fromHex('#817973'))
    
    const map = [
        addLevel([//ground
            '                                        ',
            '   aa  aa a b aba a a aa b a bb aba b a ',
            'babab b a b b b bbb b  b a aaa b a bb b ',
            '    b    bbb    a  a aaaa   b bbbb  bb  ',
            '  bb ababab abaab abbbb baba ababab aba ',
            ' aab  ab abab bb c  aaa  bbb  a  b bb   ',
            '      b    b    a                       ',
            '             a      b                   ',
            '                b                       ',
            '                      a                 ',
            '                                        ',
            '            jkklijkkkklaa               ',
            '            ooopmnoooopcc               ',
            '            ddddefgh    a               ',
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
                'a': () => makeTile('tile','dirtv1'),
                'b': () => makeTile('tile','dirtv2'),
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
            '        0                   0            ',
            '        0    9000 90        0            ',
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
            '        0  00000 900 9      0            ',
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
        '        abcdbcadabcdbcadabcdbca         ',
        '        hefgefighefgefighefgefi         ',
        '        jjjjjjjkjjjjjjjkjjjjjjj         ',
        '        lllllllmlllllllmlllllll         '
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
                'm': () => makeTile('hallway-tile','cecs-pillar-tile')
            }
        }),
        addLevel([//collision
        '       0000000000000000000000000        ',
        'hefgefighefgefighefgefighefgefighefgefi0',
        'jjjjjjjkjjjjjjjkjjjjjjjkjjjjjjjkjjjjjjj0',
        'lllllllmlllllllmlllllllmlllllllmlllllll0',
        '       0000000000000000000000000        ',
        '                                        ',
        '                                        ',
        '       0000000000000000000000000        ',
        'hefgefighefgefighefgefighefgefighefgefi0',
        'jjjjjjjkjjjjjjjkjjjjjjjkjjjjjjjkjjjjjjj0',
        'lllllllmlllllllmlllllllmlllllllmlllllll0',
        '       0000000000000000000000000        ',
        '                                        ',
        '                                        ',
        '       0000000000000000000000000        ',
        'hefgefighefgefighefgefighefgefighefgefi0',
        'jjjjjjjkjjjjjjjkjjjjjjjkjjjjjjjkjjjjjjj0',
        'lllllllmlllllllmlllllllmlllllllmlllllll0',
        '       0000000000000000000000000        ',
        '                                        ',
        '                                        ',
        '       0000000000000000000000000        ',
        'hefgefighefgefighefgefighefgefighefgefi0',
        'jjjjjjjkjjjjjjjkjjjjjjjkjjjjjjjkjjjjjjj0',
        'lllllllmlllllllmlllllllmlllllllmlllllll0',
        '       0000000000000000000000000        ',
        '                                        ',
        '                                        ',
        '       0000000000000000000000000        ',
        'hefgefighefgefighefgefighefgefighefgefi0',
        'jjjjjjjkjjjjjjjkjjjjjjjkjjjjjjjkjjjjjjj0',
        'lllllllmlllllllmlllllllmlllllllmlllllll0',
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

    for (const layer of cecshallway) {
        layer.use(scale(4))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }

    const returnMapTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(900, 3852), scale(4), 'returnMap-trigg-tile'])
    returnMapTrigger.play('returnMap-trigger')

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
        'abcdbcadabcdbcadabcdbcadabcdbcadabcdbca ',
        'hefgefighefgefighefg   ghefgefighefgefi ',
        'jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj ',
        'lllllllllllllllllllllllllllllllllllllll '
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
                'l': () => makeTile('hallway-tile','heb-tile')
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

    //trigger point to ldc
    const ldcMapTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(2690, 3677), scale(4), 'ldcMap-trigg-tile'])
    ldcMapTrigger.play('ldc-trigger')

    const returnMapTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(2430, 4102), scale(4), 'returnMap-trigg-tile'])
    returnMapTrigger.play('returnMap-trigger')

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
        'abcdbcadabcdbcadabcdbcadabcdbcadabcdbca ',
        'hefgefighefgefighefgefighefgefighefgefi ',
        'jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj ',
        'lllllllllllllllllllllllllllllllllllllll '
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
                'l': () => makeTile('hallway-tile','ldc-tile')
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

    const returnMapTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(3576, 4097), scale(4), 'returnMap-trigg-tile'])
    returnMapTrigger.play('returnMap-trigger')

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
}

//-------------------------------------------------------------OB SCENE FUNCTION----------------------------------------------------------
function setOB(mapState){
    setBackground(Color.fromHex('#3A3A3A'))

    const obhallway = [
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
        'abcdbcadabcdbcadabcdbcadabcdbcadabcdbca ',
        'hefgefighefgefighefgefighefgefighefgefi ',
        'jjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjjkjjj ',
        'lllllllllllllllllllllllllllllllllllllll '
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
                'l': () => makeTile('hallway-tile','ob-tile')
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

    const returnMapTrigger = add([sprite('trigger-tile'), area(), body({isStatic: true}), pos(1150, 4097), scale(4), 'returnMap-trigg-tile'])
    returnMapTrigger.play('returnMap-trigger')

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
    onCollidewithPlayer('returnMap-trigg-tile', player, mapState, 'bsu-map',  vec2(2986, 1526))
}



//------------------------------------------------------------------SCENES----------------------------------------------------------------
scene('bsu-map', (mapState) => setMap(mapState))
scene('inCECS', (mapState) => setCECS(mapState))
scene('inHEB', (mapState) => setHEB(mapState))
scene('inLDC', (mapState) => setLDC(mapState))
scene('inOB', (mapState) => setOB(mapState))
go('inHEB')