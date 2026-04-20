let db=require("../../db.js");

exports.addquestionsdetails=(question_text,option_a,option_b,option_c,option_d,correct_option,marks)=>{
     return new Promise((resolve,reject)=>{
        db.query("insert into questions(question_text,option_a,option_b,option_c,option_d,correct_option,marks) values(?,?,?,?,?,?,?)",[question_text, option_a,option_b,option_c,option_d,correct_option,marks],(err,results)=>{
            if(err){
                console.log("question not added");
                 return reject(err);

            }
            else{
                console.log("Mysql insert result",results);
                resolve("questions added");
            }
        })
    })
}

exports.viewques=()=>{
    return new Promise((resolve,reject)=>{
        db.query("select * from questions",(err,result)=>{
            if(err){
                return reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}



/*Assign questions to exam*/
exports.assignquesexam=(exam_id,questionsIds)=>{
    return new Promise((resolve,reject)=>{
            db.query("SELECT exam_id FROM exam WHERE exam_id = ?", [exam_id], (err, examRows) => {
            if (err) return reject(err);
            if (examRows.length === 0) {
                return reject("Exam does not exist");
            }
                 db.query(
                "SELECT question_id FROM questions WHERE question_id IN (?)",
                 [questionsIds],
                 (err, questionRows) => {
                         if (err) return reject(err);

                        if (questionRows.length !== questionsIds.length) {
                        return reject("One or more question IDs do not exist");
                        }
               
            
                        db.query("select question_id from exam_question where exam_id=?",[exam_id],(err,rows)=>{
                        if(err){
                                return reject(err);
                        }
                        else{
                            const alreadyassign=rows.map(r=>r.question_id);
                            
                            const newquestion=questionsIds.filter(
                            qid=>!alreadyassign.includes(qid)
                        );

                        if(newquestion.length===0){
                            return reject("All provideded questions are already assigned to this exam");
                        }
                        const values=newquestion.map(qid=>[exam_id,qid]);
                        db.query("insert into exam_question(exam_id,question_id) VALUES ?",[values],(err,result)=>{
                        if(err){
                            return reject(err);
                        }
                        else{
                            resolve(`${result.affectedRows}questions assigns to exam sucessfully`);
                        }
                  });
           
                }
            
            });
         });

     });
})};

//search questions by exam
exports.searchByExamTitleAndDate = (title, start_time) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT q.* 
       FROM questions q 
       JOIN exam_question eq ON q.question_id = eq.question_id 
       JOIN exam e ON eq.exam_id = e.exam_id 
       JOIN schedule s ON e.exam_id = s.exam_id 
       WHERE e.title = ? AND DATE(s.start_time) = DATE(?)`,
      [title, start_time],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};



//search by course
exports.getQuestionByCname=(course_name)=>{
    return new Promise((resolve, reject) => {
    db.query( "SELECT q.* FROM questions q JOIN exam_question eq ON q.question_id = eq.question_id JOIN exam e ON eq.exam_id = e.exam_id JOIN course c ON e.course_id = c.course_id WHERE c.course_name = ?",[course_name], (err, result) => {
    if (err) return reject(err);
    resolve(result);
});
});
}



exports.getQuestBYId=(question_id)=>{
    return new Promise((resolve,reject)=>{
        db.query("Select * from questions where question_id=?", [question_id], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}


exports.UpQueById = (quest, question_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE questions SET question_text=?, option_a=?, option_b=?, option_c=?, option_d=?, correct_option=?, marks=? WHERE question_id=?",
            [quest.question_text,quest.option_a,quest.option_b,quest.option_c,quest.option_d,quest.correct_option,quest.marks,question_id],(err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};

exports.delquestion=(question_id)=>{
    return new Promise((resolve,reject)=>{
        db.query("delete from questions where question_id=? ",[question_id],(err,result)=>{
            if(err){
                console.log(err);
                return reject(err);
            }
            else{
                resolve("Question deleted");
            }
        });
    });
}


exports.searchByName = (question_text) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM questions WHERE LOWER(question_text) LIKE LOWER(?)';
    const values = [`%${question_text}%`];

    db.query(sql, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.getQuestionsByExamId = (exam_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT q.question_id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d 
      FROM questions q 
      JOIN exam_question eq ON q.question_id = eq.question_id 
      WHERE eq.exam_id = ?
    `;

    db.query(query, [exam_id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};



