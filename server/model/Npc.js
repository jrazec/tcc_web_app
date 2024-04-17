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
 
module.exports = npcTable;