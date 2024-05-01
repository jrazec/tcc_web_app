const con = require('../config/db');

class userTable  { //Need findSingle
    static findAvatarCount() {
        return new Promise((resolve, reject) => {
           // Default Query for Student
            let queryStudent = `SELECT avatar_name, count(user_id) as player_count FROM users JOIN avatars GROUP BY avatar_name;`;
    
            con.query(queryStudent, (err, result, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    static findExpCount() {
        return new Promise((resolve, reject) => {
           // Default Query for Student
            let queryStudent = `SELECT SUM(current_exp) as total_exp FROM users`; 
    
            con.query(queryStudent, (err, result, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static findTotalQuest() {
        return new Promise((resolve, reject) => {
           // Default Query for Student
            let queryStudent = `SELECT COUNT(CASE WHEN user_quest_status = true THEN 1 END) as total_completed, COUNT(CASE WHEN user_quest_status = false THEN 1 END) as total_incomplete 
                                FROM quests 
                                LEFT JOIN gameplay_records 
                                USING(quest_id) 
                                LEFT JOIN users 
                                USING(user_id);`;
            con.query(queryStudent, (err, result, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    static findTotalStudents() {
        return new Promise((resolve, reject) => {
           // Default Query for Student
            let queryStudent = `SELECT COUNT(user_id) as total_student
                                FROM users;`;
            con.query(queryStudent, (err, result, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    static findStudents() {
        return new Promise((resolve, reject) => {
           // Default Query for Student
            let queryStudent = `select user_id,user_name,password,in_game_name,first_name,last_name,current_exp,department,program_id,program_name FROM users join programs using(program_id);`;
            con.query(queryStudent, (err, result, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    static findSingle(userId) {
        return new Promise((resolve,reject)=>{
            let userDesigQuery = `select user_id,user_name,password,in_game_name,first_name,last_name,current_exp,department,program_id,program_name FROM users join programs using(program_id)
                                 WHERE user_id=?`;
            con.query(userDesigQuery,userId,(err,result,field) => {
                if (err) {
                    reject(err);
                }else {
                    resolve(result);
                }

            });
        });
        
    }

}

module.exports = userTable;