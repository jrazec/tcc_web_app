const con = require('../config/db');


class facilityTable  { //Need findSingle
    
    static findQuestForBuilding() {
        return new Promise((resolve, reject) => {
           // Default Query for Student
           
            let queryStudent = `SELECT quest_id, question, quest_type, coordinate,npc_id, npc_name,room_id,room_name FROM quests LEFT JOIN designation using(quest_id) LEFT JOIN rooms USING(room_id) LEFT JOIN npcs USING(npc_id);`;
            con.query(queryStudent, (err, result, field) => {
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

    static findBuildings() {
        return new Promise((resolve, reject) => {
           // Default Query for Student
            let queryStudent = `select bldg_id, bldg_name, COUNT(DISTINCT(floor_ID)) as flr_count, COUNT(DISTINCT(room_id)) as room_count from buildings join floors using(bldg_id) join rooms using(floor_id) GROUP BY bldg_id, bldg_name;`;
            con.query(queryStudent, (err, result, field) => {
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

    static updateBldg(bldgList) {
        return new Promise((resolve, reject) => {
            // Default Query for Student
             let queryStudent = `UPDATE buildings SET bldg_name=(
                                 CASE WHEN bldg_id = 1 THEN ? 
                                      WHEN bldg_id = 2 THEN ? 
                                      WHEN bldg_id = 3 THEN ? 
                                      WHEN bldg_id = 4 THEN ? END)
                                 WHERE bldg_id BETWEEN 1 AND 4;`;
             con.query(queryStudent,bldgList, (err, result, field) => {
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
   
}

module.exports = facilityTable;