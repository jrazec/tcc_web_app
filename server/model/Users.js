const con = require('../config/db');

class userTable {
    static searchUser(userId,pass){
        return new Promise((resolve,reject)=>{
            let queryAcc = 'SELECT * FROM users WHERE user_id = ? AND password = ?';
            con.query(queryAcc, [userId,pass],(err, result, field) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    console.log(result)
                    resolve(result);
                }
            });
        });
    }
    static retrieveRecords(userId){
        return new Promise((resolve,reject)=>{
            let queryRecords = 'select * from users join gameplay_records using(user_id) join quests using(quest_id) join choices using(quest_id) join designation using(quest_id) left join npcs using(npc_id) left join rooms using(room_id) where users.user_id = ?';
            con.query(queryRecords, userId,(err, result, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    static retrieveFacilites(){
        return new Promise((resolve,reject)=>{
            let qRoom = 'SELECT * FROM rooms;';
            let qFlr = 'SELECT * FROM floors;';
            let qBldg = 'SELECT * FROM buildings;';
            con.query(qRoom,(err1, result1, field1) => {
                if (err1) {
                    reject(err1);
                } else {
                    con.query(qFlr,(err2, result2, field2) => {
                        if (err2) {
                            reject(err2);
                        } else {
                            con.query(qBldg,(err3, result3, field3) => {
                                if (err3) {
                                    reject(err3);
                                } else {
                                    console.log(result1,result2,result3);
                                    resolve([result1,result2,result3]);
                                }
                            });
                        }
                    });

                }
            });
        });
    }

    static retrieveUserAvatar(userId){
        return new Promise((resolve,reject)=>{
            let queryRecords = 'SELECT * FROM users JOIN avatars USING(avatar_id) JOIN avatar_garments USING(avatar_id) JOIN garments USING(garment_id) WHERE user_id = ?;';
            con.query(queryRecords, userId,(err, result, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = userTable;
