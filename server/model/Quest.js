const con = require('../config/db');

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
}

module.exports = questTable;