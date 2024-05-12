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
    static updateUser(userId,fName,lName,exp,progId,pass,ign) {
        return new Promise((resolve,reject)=>{
            let userDesigQuery = `UPDATE users SET first_name = ?, last_name = ?, current_exp=?,program_id=?,password=?,in_game_name=?
                                  WHERE user_id=?;`;
            let userList = [fName,lName,exp,progId,pass,ign,userId]
            con.query(userDesigQuery,userList,(err,result,field) => {
                if (err) {
                    reject(err);
                }else {
                    resolve(result);
                }
            });
        });
    }
    static deleteUser(userId) {
        return new Promise((resolve,reject)=>{

            let userDesigQuery = `DELETE FROM gameplay_records
                                   WHERE user_id = ?;`;
            let userDesigQuery2 = `DELETE FROM users
                                   WHERE user_id = ?;`;


            con.query(userDesigQuery,userId, (err1, result1, fields1) => {
                console.log(result1)
                if (err1) {
                    console.log(err1)
                    console.log("Failed T1 Delete");
                    con.rollback(() => {
                        console.log("\n\nRoll Back..");
                        reject("failed"); // Rollback and reject with error for transaction 3
                    });
                    return;
                }
                console.log("Success T1 Delete");
                con.query(userDesigQuery2,userId, (err2, result2, fields2) => {
                    console.log(result2)
                    if (err2) {
                        console.log(err2)
                        console.log("Failed T2 Delete");
                        con.rollback(() => {
                            console.log("\n\nRoll Back..");
                            reject("failed"); // Rollback and reject with error for transaction 3
                        });
                        return;
                    }
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
                });
                    

            });
        });
    }

}

module.exports = userTable;