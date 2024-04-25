const con = require('../config/db');

class npcTable {
    constructor(npc_id,npc_name,npc_description,npc_image) {
        this.npc_id = npc_id;
        this.npc_name = npc_name;
        this.npc_description = npc_description;
        this.npc_image = npc_image
    }

    // -------- Update Transaction -----------
    static editSingle(npcId,npcName,npcDes,npcImg,coord) {
        return new Promise((resolve,reject)=>{
            con.beginTransaction(err => {
                if (err) {
                    reject(err); 
                    return;
                }
                let updateValuesT1 = `UPDATE npcs 
                                    SET npc_name = ? ,npc_description = ?, npc_image = ? 
                                    WHERE npc_id = ?;`;

                let updateValuesT2 = `UPDATE designation 
                                      SET coordinate = ? 
                                      WHERE npc_id = ?;`;
                if(coord === "null") {
                    coord = null;
                }
                let T1 = [npcName,npcDes,npcImg,npcId];
                let T2 = [coord,npcId];
                // Transaction 1 for NPC table
                con.query(updateValuesT1, T1,(err1, result1, fields1) => {

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
                    con.query(updateValuesT2,T2, (err2, result2, fields2) => {
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

    // --------------- Search ----------------
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

    // ---------- Search Single NPC ----------
    static findSingle(npcid) {
        return new Promise((resolve,reject)=>{
            let npcDesigQuery = `SELECT npc_id,npc_name,npc_description,npc_image,coordinate 
                                 FROM npcs 
                                 LEFT JOIN designation 
                                 USING(npc_id) 
                                 WHERE npc_id = ?;`;
            con.query(npcDesigQuery,npcid,(err,result,field) => {
                if (err) {
                    reject(err);
                }else {
                    resolve(result);
                }

            });
        });
        
    }

    // --------- Retrieve Max NpcID ---------
    static checkHighestNpcId() {
        return new Promise((resolve,reject)=>{
            const checkHighestNpcId = `SELECT MAX(npc_id) as cur
                                        FROM npcs;`;
                                            
            con.query(checkHighestNpcId, (err,result,field)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(parseInt(result[0].cur));

                }
            });           
        }); 
    }

    // -------- Retrieve Max DesigID --------
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

    // -------- Add Npc Transaction ---------
    static addNpc(npcId,npcName,npcDes,npcImg,coord,desigId) {
        return new Promise((resolve,reject)=>{
            con.beginTransaction(err => {
                if (err) {
                    reject(err); 
                    return;
                }
        
                let npcDesigQueryT1 = `INSERT INTO npcs(npc_id,npc_name,npc_description,npc_image)
                                       VALUES ( ?, ?, ?, ?);`;
                let npcDesigQueryT2 = `INSERT INTO designation(desig_id,coordinate,quest_id,room_id,npc_id)
                                       VALUES ( ?, ?,null,null, ?);`;
                if(coord === "null") {
                    coord = null;
                }  
                let T1 = [npcId,npcName,npcDes,npcImg];
                let T2 = [desigId,coord,npcId];
                // Transaction 1 for NPC table
                con.query(npcDesigQueryT1,T1, (err1, result1, fields1) => {

                    // ------------------JUST FOR ERROR HANDLING----------------
                    if (err1) { 
                        console.log(err1)
                        console.log("Failed T1 Update");
                        con.rollback(() => {
                            reject("failed"); // Rollback and reject with error for transaction 1
                        });
                        return;
                    }
                    // ---------------------------------------------------------

                    console.log("Success T1");


                    // Transaction 2 for Designation Table
                    con.query(npcDesigQueryT2,T2, (err2, result2, fields2) => {
                        if (err2) {
                            console.log("Failed T2 Update");
                            con.rollback(() => {
                                console.log(err2)
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

    // ------- Delete Npc Transaction -------
    static deleteNpc(npcId) {
        return new Promise((resolve,reject)=>{
            con.beginTransaction(err => {
                if (err) {
                    reject(err); 
                    return;
                }

                let npcDesigDeleteT1 = `DELETE FROM designation WHERE npc_id = ?;`;
                let npcDesigDeleteT2 = `DELETE FROM npcs WHERE npc_id = ?;`;  

                // Transaction 1 for NPC table
                con.query(npcDesigDeleteT1,npcId, (err1, result1, fields1) => {

                    // ------------------JUST FOR ERROR HANDLING----------------
                    if (err1) { 
                        console.log(err1)
                        console.log("Failed T1 Delete");
                        con.rollback(() => {
                            reject("failed"); // Rollback and reject with error for transaction 1
                        });
                        return;
                    }
                    // ---------------------------------------------------------

                    console.log("Success T1");


                    // Transaction 2 for Designation Table
                    con.query(npcDesigDeleteT2,npcId, (err2, result2, fields2) => {
                        if (err2) {
                            console.log("Failed T2 Update");
                            con.rollback(() => {
                                console.log(err2)
                                console.log("\n\nRoll Back..");
                                reject("failed"); // Rollback and reject with error for transaction 2
                            });
                            return;
                        }
                        // -----------------------------------------------------------
                    
                        console.log("Success T2 Delete");

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
        })
    }
}
 
module.exports = npcTable;