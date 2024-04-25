const con = require('../config/db');

class roomTable  { //Need findSingle
    static findAll(option = "", search = "", limitCount = 0) {
        return new Promise((resolve, reject) => {
           // Default Query for classroom
            let queryClassroom = `SELECT room_id,room_name,room_purpose,room_image,floor_number,bldg_name,coordinate 
                                  FROM rooms
                                  LEFT JOIN designation
                                  USING(room_id) 
                                  LEFT JOIN floors 
                                  USING(floor_id) 
                                  LEFT JOIN buildings 
                                  USING(bldg_id)`;
            if (option === "") {
                // Nothing
            } else if (option.toUpperCase() === "SEARCH") {
                queryClassroom = `SELECT room_id,room_name,room_purpose,room_image,floor_number,bldg_name,coordinate 
                                  FROM rooms
                                  LEFT JOIN designation
                                  USING(room_id)  
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

    static findFloor() {
        return new Promise((resolve,reject)=>{
            let queryF = `SELECT floor_id as id,floor_number as num, bldg_id 
                                  FROM floors;`;
            con.query(queryF, (err, result, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static findBldg() {
        return new Promise((resolve,reject)=>{
            let queryB = `SELECT bldg_id as id,bldg_name as name
                                  FROM buildings;`;
            con.query(queryB, (err, result, field) => {
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

    static checkHighestRoomId(bldgId) { // TBA if null ung result, return 0
        return new Promise((resolve,reject)=>{
            const checkHighestDesigId = `SELECT MAX(room_id) as cur
                                         FROM rooms 
                                         JOIN floors
                                         USING(floor_id)
                                         JOIN buildings
                                         USING(bldg_id)
                                         WHERE room_id LIKE '?__';`;
                                            
            con.query(checkHighestDesigId,parseInt(bldgId), (err,result,field)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(parseInt(result[0].cur));
                }
            });           
        });

      
    }
    
    static addRoom(roomId,roomName,roomPurp,roomImage,floorId,coord,desigId) {
        return new Promise((resolve,reject)=>{
            con.beginTransaction(err => {
                if (err) {
                    reject(err); 
                    return;
                }
                if (coord === "null") {
                    coord = null;
                }

                let roomDesigQueryT1 = `INSERT INTO rooms(room_id,room_name,room_purpose,room_image,floor_id)
                                        VALUES (?,?, ?, ?, ?);`;
                let roomDesigQueryT2 = `INSERT INTO designation(desig_id,coordinate,quest_id,npc_id,room_id)
                                        VALUES (?,?,null,null,?);`;  
                let T1 = [roomId,roomName,roomPurp,roomImage,floorId];
                let T2 = [desigId,coord,roomId];
                // Transaction 1 for NPC table
                con.query(roomDesigQueryT1,T1, (err1, result1, fields1) => {

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
                    con.query(roomDesigQueryT2,T2,(err2, result2, fields2) => {
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

    static findSingle(roomid) {
        return new Promise((resolve,reject)=>{
            let roomDesigQuery = `SELECT room_id,room_name,room_purpose,room_image,floor_id,floor_number,bldg_id,bldg_name,coordinate 
                                 FROM designation 
                                 RIGHT JOIN rooms 
                                 USING(room_id)
                                 JOIN floors
                                 USING(floor_id)
                                 JOIN buildings
                                 USING(bldg_id) 
                                 WHERE room_id=?`;
            con.query(roomDesigQuery,roomid,(err,result,field) => {
                if (err) {
                    reject(err);
                }else {
                    resolve(result);
                }

            });
        });
        
    }

    // -------- Update Transaction -----------
    static editSingle(roomId,roomName,roomPurp,roomImage,floorId,coord,bldgId) {
        return new Promise((resolve,reject)=>{
            con.beginTransaction(err => {
                if (err) {
                    reject(err); 
                    return;
                }
                if(coord === "null") {
                    coord = null
                }
                let updateValuesT1 = `UPDATE rooms 
                                    SET room_name= ? ,room_purpose = ? ,room_image= ? ,floor_id = ? 
                                    WHERE room_id= ? ;`;

                let updateValuesT2 = `UPDATE designation 
                                      SET coordinate = ? 
                                      WHERE room_id = ? ;`;

                let T1 = [roomName,roomPurp,roomImage,floorId,roomId];
                let T2 = [coord,roomId]
                console.log(T2)
                if (floorId === "undefined") { // The floorid isnt changed
                    updateValuesT1 = `UPDATE rooms 
                                      SET room_name= ?,room_purpose= ?,room_image= ? 
                                      WHERE room_id= ?;`;
                    T1 = [roomName,roomPurp,roomImage,roomId]
                }
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
                            console.log(result2,err2)
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

    static deleteRoom(roomId){
        console.log("Delete Room");
        return new Promise((resolve,reject)=>{
            con.beginTransaction(err => {
                if (err) {
                    reject(err); 
                    return;
                }
                console.log(roomId)
                let roomDesigDeleteT1 = `DELETE FROM designation WHERE room_id = ?;`;
                let roomDesigDeleteT2 = `DELETE FROM rooms WHERE room_id = ?;`;  

                // Transaction 1 for NPC table
                con.query(roomDesigDeleteT1,roomId, (err1, result1, fields1) => {
                    console.log(result1)
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
                    con.query(roomDesigDeleteT2,roomId, (err2, result2, fields2) => {
                        console.log("Result2:",result2)
                        if (err2) {
                            console.log("Failed T2 Delete");
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

module.exports = roomTable;