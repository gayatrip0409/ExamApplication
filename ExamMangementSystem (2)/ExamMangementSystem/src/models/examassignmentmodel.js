let db=require("../../db.js");

exports.adddatintoassignment=(userid,exam_id)=>{
    return new Promise((resolve,reject)=>{
       db.query(`select * from assignment where userid=? and exam_id=?`,[userid,exam_id],(err,rows)=>{
        if(err){
            return reject(err);
        }
        if(rows.length>0){
            return reject("Exam already asssignned to this student");
        }

         db.query("insert into assignment(userid,exam_id) values(?,?)",[userid,exam_id],(err,result)=>{
            if(err){
                console.log("assignment is not shedule");
                 return reject(err);
            }
            else{
                console.log("Mysql insert result",result);
                resolve("assignment is scheduled ");
            }
        })
       })
    })
}

exports.viewassign=(userid)=>{
    return new Promise((resolve,reject)=>{
        db.query(`select 
         a.assignment_id,
         e.exam_id,
         e.title,
         e.total_marks,
         e.duration,
         s.start_time,
         s.end_time,
         case 
           when r.result_id is not null then 1
           else 0
         end as is_submitted
       from assignment a
       join exam e on a.exam_id = e.exam_id
       left join schedule s on e.exam_id = s.exam_id
       left join result r on r.exam_id = e.exam_id and r.userid = a.userid
       where a.userid = ?`,[userid],(err,result)=>{
            if(err){
                return reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

exports.SubmitExamss = (userid, exam_id, answers) => {
  return new Promise((resolve, reject) => {
    // 1️⃣ Check if exam is assigned to the student
    db.query(
      "SELECT * FROM assignment WHERE userid=? AND exam_id=?",
      [userid, exam_id],
      (err, assignmentRows) => {
        if (err) return reject(err);
        if (assignmentRows.length === 0) {
          return reject("Exam not assigned to this student");
        }

        // 2️⃣ Check if already submitted
        db.query(
          "SELECT * FROM result WHERE userid=? AND exam_id=?",
          [userid, exam_id],
          (err, resultRows) => {
            if (err) return reject(err);
            if (resultRows.length > 0) {
              return reject("You have already submitted this exam");
            }

            // 3️⃣ Fetch questions of this exam
            db.query(
              `SELECT q.question_id, q.correct_option 
               FROM questions q 
               JOIN exam_question eq ON q.question_id = eq.question_id 
               WHERE eq.exam_id = ?`,
              [exam_id],
              (err, questions) => {
                if (err) return reject(err);
                if (questions.length === 0) {
                  return reject("No questions found for this exam");
                }

                // 4️⃣ Validate answer count
                if (answers.length !== questions.length) {
                  return reject(
                    "Number of answers does not match number of questions"
                  );
                }

                // 5️⃣ Calculate score
                let score = 0;
                for (let i = 0; i < questions.length; i++) {
                  let q = questions[i];
                  for (let j = 0; j < answers.length; j++) {
                    let a = answers[j];
                    if (
                      Number(a.question_id) === Number(q.question_id) &&
                      a.selected_option.trim().toLowerCase() ===
                        q.correct_option.trim().toLowerCase()
                    ) {
                      score++;
                    }
                  }
                }

                // 6️⃣ Insert submitted answers into user_answer
                let insertAnswers = answers.map((a) => [
                  userid,
                  exam_id,
                  a.question_id,
                  a.selected_option,
                ]);

                db.query(
                  "INSERT INTO user_answer (userid, exam_id, question_id, selected_option) VALUES ?",
                  [insertAnswers],
                  (err) => {
                    if (err) return reject(err);

                    // 7️⃣ Insert score into result
                    db.query(
                      "INSERT INTO result (userid, exam_id, score) VALUES (?, ?, ?)",
                      [userid, exam_id, score],
                      (err) => {
                        if (err) return reject(err);
                        resolve({ score, total: questions.length });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
};


exports.getExamResult=(userid,exam_id)=>{
    return new Promise((resolve,reject)=>{
        db.query(`select r.result_id, r.score,e.total_marks,e.title,s.start_time,s.end_time from result r join exam e on r.exam_id=e.exam_id left join schedule s on e.exam_id=s.exam_id where r.userid=? and r.exam_id=?`,[userid,exam_id],(err,result)=>{
            if(err){
                return reject(err);
            }
            if(result.length > 0){
                let row=result[0];
                row.percentage=(row.score/row.total_marks)*100;
            }
            resolve(result);
        })
    })
}

exports.getstudent = () => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT userid, name, email, role FROM users WHERE role='student' OR role='Student'`,
      (err, result) => {
        if (err) {
          return reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

exports.getAllExamResults = (userid) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT r.result_id, r.score, e.total_marks, e.title, e.exam_id, 
              s.start_time, s.end_time
       FROM result r
       JOIN exam e ON r.exam_id = e.exam_id
       LEFT JOIN schedule s ON e.exam_id = s.exam_id
       WHERE r.userid = ?`,
      [userid],
      (err, results) => {
        if (err) {
          return reject(err);
        }

        // calculate percentage for each result
        results = results.map((row) => {
          row.percentage = (row.score / row.total_marks) * 100;
          return row;
        });

        resolve(results);
      }
    );
  });
};


exports.getResultDetails = (userid, exam_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
          q.question_id,
          q.question_text,
          q.option_a,
          q.option_b,
          q.option_c,
          q.option_d,
          q.correct_option,
          ua.selected_option
      FROM exam_question eq
      JOIN questions q ON eq.question_id = q.question_id
      LEFT JOIN user_answer ua 
        ON q.question_id = ua.question_id 
       AND ua.userid = ? 
       AND ua.exam_id = ?
      WHERE eq.exam_id = ?
    `;

    db.query(sql, [userid, exam_id, exam_id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};