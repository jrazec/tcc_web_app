const con = require('../config/db');

class questTable  {// need findsingle for get edit request
    static findAll(option = "", search = "", limitCount = 0) {
        return new Promise((resolve, reject) => {
                   // Default query
        let queryQuest = `  SELECT quest_id,question,quest_type,npc_name,room_name, 
                                MAX(CASE WHEN is_answer=true THEN choice ELSE '' END) AS answer, 
                                COUNT(choice) AS choices
                            FROM quests
                            JOIN choices
                            USING(quest_id) 
                            LEFT JOIN designation 
                            USING(quest_id) 
                            LEFT JOIN npcs 
                            USING(npc_id) 
                            LEFT JOIN rooms 
                            USING(room_id)
                            GROUP BY quest_id,question,quest_type,npc_name,room_name`;
            if (option === "") {
                // Nothing
            } else if (option.toUpperCase() === "SEARCH") {
                queryQuest = `SELECT quest_id,question,quest_type,npc_name,room_name, 
                                MAX(CASE WHEN is_answer=true THEN choice ELSE '' END) AS answer, 
                                COUNT(choice) AS choices 
                              FROM quests
                              JOIN choices
                              USING(quest_id)  
                              LEFT JOIN designation 
                              USING(quest_id) 
                              LEFT JOIN npcs 
                              USING(npc_id) 
                              LEFT JOIN rooms 
                              USING(room_id) 
                              WHERE quest_id = ${search}
                              GROUP BY quest_id,question,quest_type,npc_name,room_name;`;
    
            } else if (option.toUpperCase() === "LIMIT") {
                // If the limit button sends a get request, and value is greater than 0
                if (limitCount > 0) {
                    queryQuest += ` LIMIT ${limitCount};`
                } else {
                    queryQuest += ';'
                }
            }
    
            con.query(queryQuest, (err, result, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static findSingle(questid) {
        return new Promise((resolve,reject)=>{
            let querySingle = ` SELECT quest_id,question,quest_type,npc_name,room_name, choice, is_answer, coordinate,npc_id,room_id
                                FROM quests
                                JOIN choices
                                USING(quest_id) 
                                LEFT JOIN designation 
                                USING(quest_id) 
                                LEFT JOIN npcs 
                                USING(npc_id) 
                                LEFT JOIN rooms 
                                USING(room_id)
                                WHERE quest_id = ?;`
            con.query(querySingle,questid,(err,result,field)=>{
                if(err){
                    console.log("Error",err)
                    reject(err);
                }else {
                    resolve(result);
                }
            });
        });
    }

    static findChoices(questid){
        return new Promise((resolve,reject)=>{
            // So is Answer is always first
            let queryChoices = `SELECT choice FROM choices WHERE quest_id = ? ORDER BY is_answer DESC;`
            con.query(queryChoices,questid,(err,result,field)=>{
                if(err){
                    console.log("Error",err)
                    reject(err);
                }else {
                    resolve(result);
                }
            });
        });
    }
    static editSingle(questId,type,question,npcDesig,roomDesig,ans,c1,c2,c3,coor,oldChoices){
        return new Promise((resolve,reject)=>{
            //questId,type,question,npcDesig,roomDesig,ans,c1,c2,c3,coor
            con.beginTransaction(err => {
                if (err) {
                    reject(err); 
                    return;
                }
                if(coor === "null") {
                    coor = null;
                }

                let updateValuesT1 = `UPDATE quests
                                      SET question = ? ,quest_type= ?  
                                      WHERE quest_id = ? ;`;

                let updateValuesT2 = `UPDATE designation 
                                      SET coordinate = ?, npc_id = ?, room_id = ? 
                                      WHERE quest_id = ? ;`;

                let updateValuesT3 = `UPDATE choices
                                      SET choice = 
                                          CASE 
                                              WHEN choice = ? AND is_answer = true THEN ?
                                              WHEN choice = ? AND is_answer = false THEN ?
                                              WHEN choice = ? AND is_answer = false THEN ?
                                              WHEN choice = ? AND is_answer = false THEN ?                                              
                                          END
                                      WHERE quest_id = ? ;`;

                let T1 = [question,type,questId];
                let T2 = [coor,npcDesig,roomDesig,questId];
                let T3 = [oldChoices[0].choice,ans,oldChoices[1].choice,c1,oldChoices[2].choice,c2,oldChoices[3].choice,c3,questId];

                // Transaction 1 for NPC table
                con.query(updateValuesT1, T1,(err1, result1, fields1) => {
                    if (err1) { 
                        console.log("Failed T1 Update");
                        console.log(err1)
                        con.rollback(() => {
                            reject("failed"); // Rollback and reject with error for transaction 1
                        });
                        return;
                    }
                    console.log("Success T1");
                    con.query(updateValuesT2,T2, (err2, result2, fields2) => {
                        if (err2) {
                            console.log(err2)
                            console.log("Failed T2 Update");
                            con.rollback(() => {
                                console.log("\n\nRoll Back..");
                                reject("failed"); // Rollback and reject with error for transaction 2
                            });
                            return;
                        }
                        console.log("Success T2 Update");

                        con.query(updateValuesT3,T3, (err3, result3, fields3) => {
                            console.log(result3)
                            if (err3) {
                                console.log(err3)
                                console.log("Failed T3 Update");
                                con.rollback(() => {
                                    console.log("\n\nRoll Back..");
                                    reject("failed"); // Rollback and reject with error for transaction 3
                                });
                                return;
                            }
                            console.log("Success T3 Update");
    
                            // -------------Commiting if no Failed Transactions-----------
                            con.commit(err => {
                                if (err) {
                                    con.rollback(() => {
                                        console.log("\n\nRoll Back..");
                                        reject("failed"); // Rollback and reject if commit fails
                                    });
                                } else {
                                    resolve("success"); // Resolve with "success" status once committed
                                }
                            });
                            // ------------------------------------------------------------
                        });
                    });
                });
            });  
        });
    }

    static findAvailableNpcs() {
        return new Promise((resolve, reject) => {
                   // Default query
            let queryQuest = `SELECT npc_id,npc_name,quest_id FROM npcs LEFT JOIN designation USING(npc_id) WHERE quest_id IS NULL;`;
    
            con.query(queryQuest, (err, result, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static findAvailableRooms() {
        return new Promise((resolve, reject) => {
                   // Default query
            let queryQuest = `SELECT room_id,room_name,quest_id FROM rooms LEFT JOIN designation USING(room_id) WHERE quest_id IS NULL;`;
    
            con.query(queryQuest, (err, result, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static checkHighestDesigId() {
        return new Promise((resolve,reject)=>{
            const checkHighestDesigId = `SELECT MAX(desig_id) as cur
                                         FROM designation;`;
                                            
            con.query(checkHighestDesigId, (err,result,field)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(parseInt(result[0].cur));
                }
            });           
        });
    }

    static checkHighestQuestId() {
        return new Promise((resolve,reject)=>{
            const checkHighestQuestId = `SELECT MAX(quest_id) as cur
                                         FROM quests;`;
                                            
            con.query(checkHighestQuestId, (err,result,field)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(parseInt(result[0].cur));
                }
            });           
        });
    }

    static addQuest(questId,questType,question,npcDesig,roomDesig,answer,c1,c2,c3,desigId,coord){
        return new Promise((resolve,reject)=>{
            con.beginTransaction(err => {
                if (err) {
                    reject(err); 
                    return;
                }
                let queryAddQuestT1 = `INSERT INTO quests(quest_id,quest_type,question)
                                    VALUES (?, ?, ?);`;
                let queryAddQuestT2 = `INSERT INTO choices(choice,is_answer,quest_id)
                                    VALUES (?, true, ?),
                                            (?, false, ?),
                                            (?, false, ?),
                                            (?, false, ?);`;
                let queryAddQuestT3 = `INSERT INTO designation(desig_id,coordinate,quest_id,npc_id,room_id)
                                    VALUES(?, ?, ?, ?, ?);`;
                let T1 = [questId,questType,question];
                let T2 = [answer,questId,c1,questId,c2,questId,c3,questId];
                let T3 = [desigId,coord,questId,npcDesig,roomDesig]
                con.query(queryAddQuestT1,T1,(err,result,field)=>{
                    if (err) { 
                        console.log(err)
                        console.log("Failed T1 Update");
                        con.rollback(() => {
                            reject("failed"); // Rollback and reject with error for transaction 1
                        });
                        return;
                    }
                    console.log("Success T1");
                                        
                    con.query(queryAddQuestT2,T2, (err2, result2, fields2) => {
                        if (err2) {
                            console.log(err2)
                            console.log("Failed T2 Update");
                            con.rollback(() => {
                                console.log(err2)
                                console.log("\n\nRoll Back..");
                                reject("failed"); // Rollback and reject with error for transaction 2
                            });
                            return;
                        }                    
                        console.log("Success T2 Update");

                    
                        con.query(queryAddQuestT3,T3, (err3, result3, fields3) => {
                            if (err3) {
                                console.log("Failed T3 Update");
                                con.rollback(() => {
                                    console.log(err3)
                                    console.log("\n\nRoll Back..");
                                    reject("failed"); // Rollback and reject with error for transaction 2
                                });
                                return;
                            }
                        
                            console.log("Success T3 Update");

                            // -------------Commiting if no Failed Transactions-----------
                            con.commit(err => {
                                if (err) {
                                    con.rollback(() => {
                                        console.log("\n\nRoll Back..");
                                        reject("failed"); // Rollback and reject if commit fails
                                    });
                                } else {
                                    resolve("success"); // Resolve with "success" status once committed
                                }
                            });
                            });
                    });
                });
            });
        });

    }
    static deleteQuest(questId){
        return new Promise((resolve,reject)=>{
            con.beginTransaction(err => {
                if (err) {
                    reject(err); 
                    return;
                }

                let questDesigDeleteT1 = `DELETE FROM designation WHERE quest_id = ?;`;
                let questDesigDeleteT2 = `DELETE FROM quests WHERE quest_id = ?;`;
                let questDesigDeleteT3 = `DELETE FROM choices WHERE quest_id = ?;`;  

                // Transaction 1 for NPC table
                con.query(questDesigDeleteT1,questId, (err1, result1, fields1) => {
                    if (err1) { 
                        console.log(err1)
                        console.log("Failed T1 Delete");
                        con.rollback(() => {
                            reject("failed"); // Rollback and reject with error for transaction 1
                        });
                        return;
                    }
                    console.log("Success T1");

                    con.query(questDesigDeleteT2,questId, (err2, result2, fields2) => {
                        if (err2) {
                            console.log("Failed T2 Update");
                            con.rollback(() => {
                                console.log(err2)
                                console.log("\n\nRoll Back..");
                                reject("failed"); // Rollback and reject with error for transaction 2
                            });
                            return;
                        }
                    
                        console.log("Success T2 Delete");
                        con.query(questDesigDeleteT3,questId, (err2, result2, fields2) => {
                            if (err2) {
                                console.log("Failed T2 Update");
                                con.rollback(() => {
                                    console.log(err2)
                                    console.log("\n\nRoll Back..");
                                    reject("failed"); // Rollback and reject with error for transaction 2
                                });
                                return;
                            }
                            console.log("Success T3")
                            // -------------Commiting if no Failed Transactions-----------
                            con.commit(err => {
                                if (err) {
                                    con.rollback(() => {
                                        console.log("\n\nRoll Back..");
                                        reject("failed"); // Rollback and reject if commit fails
                                    });
                                } else {
                                    resolve("success"); // Resolve with "success" status once committed
                                }
                            });
                            // ------------------------------------------------------------
                        });
                        
                    });
                    
                });
            });
        })
    }
}

module.exports = questTable;