let db=require("../../db.js");

exports.getCourse=()=>{
    return new Promise((resolve,reject)=>{
        db.query("select * from course",(err,results)=>{
            if(err){
                console.log(err);
                return reject(err);
            }
            else{
                resolve(results);
            }
        })
    })
}

exports.fetchcourseById = (course_id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM course WHERE course_id = ?", [course_id], (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.updateCourseById = (course_id, course_name) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE course SET course_name = ? WHERE course_id = ?",
            [course_name, course_id],
            (err, result) => {
                if (err) {
                    console.log("DB Error:", err);
                    reject(err);
                } else {
                    console.log("DB Update Result:", result);
                    resolve("updated successfully");
                }
            }
        );
    });
};

exports.deletecourse=(course_id)=>{
    return new Promise((resolve,reject)=>{
        db.query("delete from course where course_id=? ",[course_id],(err,result)=>{
            if(err){
                console.log(err);
                return reject(err);
            }
            else{
                resolve("Course deleted");
            }
        })
    })
}


exports.searchByName = (course_name) => {
    return new Promise((resolve, reject) => {
       
        const searchTerm = `%${course_name}%`;

        const sql = "SELECT * FROM course WHERE course_name LIKE ?";

        db.query(sql, [searchTerm], (err, results) => {
            if (err) {
                console.error("DB error in searchByName:", err);
                return reject(err);
            }
            resolve(results);  
        });
    });
};
