kaboom ({
    width: 1280,
    height:960,
    scale: 0.7
})

setBackground(Color.fromHex('#817973'))  

function loadCharSprite(gender, clothing){
    let atlasName = `${gender}_${clothing}`;
    let imagePath = `/public/Assets/${atlasName}.png`;

    loadSpriteAtlas(imagePath, {
        'player-down': {x: 0, y: 0, width: 32, height: 32, sliceX: 10},
        'player-up': {x: 32, y: 0, width: 32, height: 32, sliceX: 10},
        'player-side': {x: 0, y: 64, width: 32, height: 32, sliceX: 10, 
            anims: {'walk': {from: 0, to: 1, speed: 6}}
        }
    })
}
function loadAssets() {
    loadCharSprite('boy', 'school-unif')
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

}

loadAssets()

function setMap(mapState){
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
            '        0    1111111        0            ',
            '        0                   0            ',
            '        0                   0            ',
            '        0    0000000        0            ',
            '        0    0000000        0            ',
            '        0    0000000        0            ',
            '        0    1111111        0            ',
            '        0   0       0000000 0            ',
            '        0  0             00 0            ',
            '        0  00            00 0            ',
            '        0  00333 033 00  00 0            ',
            '        0  00 003    00  00 0            ',
            '        0  00 0      00  00 0            ',
            '        0  00  0     00  00 0            ',
            '        0  11 0      11  11 0            ',
            '        0     2             0            ',
            '        0                   0            ',
            '        0  000000000        0            ',
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
                '0': () => [
                    area({shape: new Rect(vec2(0), 32, 32)}),
                    body({isStatic: true})
                ],
                '1': () => [
                    area({shape: new Rect(vec2(0), 32, 16), 
                        offset: vec2(0, 0)}),
                    body({isStatic: true})
                ],
                '2': () => [
                    area({shape: new Rect(vec2(0), 4, 32)}),
                    body({isStatic: true})
                ],
                '3': () => [
                    area({shape: new Rect(vec2(0), 32, 4)}),
                    body({isStatic: true})
                ]
            }
        })
    ]

    for (const layer of map) {
        layer.use(scale(1))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }
    
    //player
    // const player = add([
    //     sprite('player-down'),
    //     pos(500, 700),
    //     scale(1),
    //     area(),
    //     body(),{
    //         currentSprite: 'player-down',
    //         speed: 300,
    //         isInDialogue: false
    //     }
    // ])
}

function setInside(mapState){
    return console.log("");
}

scene('bsu-map', (mapState) => setMap(mapState))
scene('inbldg', (mapState) => setInside(mapState))
go('bsu-map')