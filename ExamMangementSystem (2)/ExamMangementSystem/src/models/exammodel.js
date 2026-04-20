let db=require("../../db.js");

exports.getExam=()=>{
    return new Promise((resolve,reject)=>{
        db.query("select * from exam",(err,results)=>{
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

exports.fetchexamById=(exam_id)=>{
    return new Promise((resolve,reject)=>{
        db.query("Select * from exam where exam_id=?",[exam_id],(err,result)=>{
            if(err)
            {
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    });

}

exports.updateexamdata=(title,total_marks,duration,userid,created_at,course_id,exam_id)=>{
    return new Promise((resolve,reject)=>{
        db.query("update exam set title=?,total_marks=?,duration=?,userid=?,created_at=?,course_id=? where exam_id=?",[title,total_marks,duration,userid,created_at,course_id,exam_id],(err,result)=>{
            if(err){
                console.log(err);
               return  reject(err);
            }else
            {
                console.log(result);
                resolve("updated successfully");
            }
        });
    });
}

exports.deleteexam=(exam_id)=>{
    return new Promise((resolve,reject)=>{
        db.query("delete from exam where exam_id=? ",[exam_id],(err,result)=>{
            if(err){
                console.log(err);
                return reject(err);
            }
            else{
                resolve("exam deleted");
            }
        })
    })
}






exports.searchExamByDate = (created_at) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM exam WHERE DATE(created_at) = ?", [created_at], (err, results) => {
            if (err) {
                console.log("DB Error:", err);
                return reject(err);
            }
            resolve(results);
        });
    });
};
exports.assignSchedule = (exam_id, start_time, end_time) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO schedule (exam_id, start_time, end_time)
      VALUES (?, ?, ?)
    `;
    db.query(sql, [exam_id, start_time, end_time], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.searchExamByName = (name, callback) => {
  const query = "SELECT * FROM exam WHERE LOWER(title) LIKE ?";
  db.query(query, [`%${name.toLowerCase()}%`], callback);
};