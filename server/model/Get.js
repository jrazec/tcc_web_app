const con = require('../config/db');

class npcTable {
    constructor(npc_id,npc_name,npc_description,npc_image) {
        this.npc_id = npc_id;
        this.npc_name = npc_name;
        this.npc_description = npc_description;
        this.npc_image = npc_image
    }

    static editSingle(npcId,npcName,npcDes,npcImg,coord) {
        return new Promise((resolve,reject)=>{
            con.beginTransaction(err => {
                if (err) {
                    reject(err); 
                    return;
                }
                let updateValuesT1 = `UPDATE npcs 
                                    SET npc_name=\"${npcName}\",npc_description=\"${npcDes}\",npc_image=\"${npcImg}\" 
                                    WHERE npc_id=${npcId};`;

                let updateValuesT2 = `UPDATE designation 
                                    SET coordinate=${coord} 
                                    WHERE npc_id=${npcId};`;

                // Transaction 1 for NPC table
                con.query(updateValuesT1, (err1, result1, fields1) => {

                    // ------------------JUST FOR ERROR HANDLING----------------
                    if (err1) { 
                        console.log("Failed T1 Update");
                        con.rollback(() => {
                            reject("failed"); // Rollback and reject with error for transaction 1
                        });
                        return;
                    }
                    // ---------------------------------------------------------

                    console.log("Success T1");


                    // Transaction 2 for Designation Table
                    con.query(updateValuesT2, (err2, result2, fields2) => {
                        if (err2) {
                            console.log("Failed T2 Update");
                            con.rollback(() => {
                                console.log("\n\nRoll Back..");
                                reject("failed"); // Rollback and reject with error for transaction 2
                            });
                            return;
                    }
                    // -----------------------------------------------------------
                    
                    console.log("Success T2 Update");

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
    }

    static findAll(option = "", search = "", limitCount = 0) {
        return new Promise((resolve, reject) => {
            let queryNpc = `SELECT npc_id,npc_name,npc_description,npc_image,coordinate 
                            FROM npcs 
                            LEFT JOIN designation 
                            USING(npc_id)`; // Main Query
            if (option === "") {
                // Nothing
            } else if (option.toUpperCase() === "SEARCH") {
                queryNpc = `SELECT npc_id,npc_name,npc_description,npc_image,coordinate 
                            FROM npcs 
                            LEFT JOIN designation 
                            USING(npc_id) 
                            WHERE npc_id = ${search};`;
    
            } else if (option.toUpperCase() === "LIMIT") {
                // If the limit button sends a get request, and value is greater than 0
                if (limitCount > 0) {
                    queryNpc += ` LIMIT ${limitCount};`
                } else {
                    queryNpc += ';'
                }
            }
    
            con.query(queryNpc, (err, result, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static findSingle(npcid) {
        return new Promise((resolve,reject)=>{
            let npcDesigQuery = `SELECT npc_id,npc_name,npc_description,npc_image,coordinate 
                                 FROM npcs 
                                 LEFT JOIN designation 
                                 USING(npc_id) 
                                 WHERE npc_id=${npcid}`;
            con.query(npcDesigQuery,(err,result,field) => {
                if (err) {
                    reject(err);
                }else {
                    resolve(result);
                }

            });
        });
        
    }

}
 
class roomTable  { //Need findSingle
    static findAll(option = "", search = "", limitCount = 0) {
        return new Promise((resolve, reject) => {
           // Default Query for classroom
            let queryClassroom = `SELECT room_id,room_name,room_purpose,room_image,floor_number,bldg_name 
                                  FROM rooms 
                                  LEFT JOIN floors 
                                  USING(floor_id) 
                                  LEFT JOIN buildings 
                                  USING(bldg_id)`;
            if (option === "") {
                // Nothing
            } else if (option.toUpperCase() === "SEARCH") {
                queryClassroom = `SELECT room_id,room_name,room_purpose,room_image,floor_number,bldg_name 
                                  FROM rooms 
                                  LEFT JOIN floors 
                                  USING(floor_id) 
                                  LEFT JOIN buildings 
                                  USING(bldg_id) 
                                  WHERE room_id = ${search};`
    
            } else if (option.toUpperCase() === "LIMIT") {
                // If the limit button sends a get request, and value is greater than 0
                if (limitCount > 0) {
                    queryClassroom += ` LIMIT ${limitCount};`
                } else {
                    queryClassroom += ';'
                }
            }
    
            con.query(queryClassroom, (err, result, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

class questTable  {// need findsingle for get edit request
    static findAll(option = "", search = "", limitCount = 0) {
        return new Promise((resolve, reject) => {
                   // Default query
        let queryQuest = `SELECT quest_id,question,quest_type,npc_name,room_name 
                          FROM quests 
                          LEFT JOIN designation 
                          USING(quest_id) 
                          LEFT JOIN npcs 
                          USING(npc_id) 
                          LEFT JOIN rooms 
                          USING(room_id)`;
            if (option === "") {
                // Nothing
            } else if (option.toUpperCase() === "SEARCH") {
                queryQuest = `SELECT quest_id,question,quest_type,npc_name,room_name 
                              FROM quests 
                              LEFT JOIN designation 
                              USING(quest_id) 
                              LEFT JOIN npcs 
                              USING(npc_id) 
                              LEFT JOIN rooms 
                              USING(room_id) 
                              WHERE quest_id = ${search};`;
    
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
}

module.exports = {npcTable,roomTable,questTable};