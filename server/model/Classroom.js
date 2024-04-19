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
}

module.exports = roomTable;