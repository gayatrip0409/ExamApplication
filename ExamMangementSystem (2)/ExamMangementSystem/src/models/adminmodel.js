let db=require("../../db.js");

exports.registerentry = (name, email, password, role, created_at) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO users (name, email, password, role, created_at) VALUES (?,?,?,?,?)",
      [name, email, password, role, created_at],
      (err, result) => {
        if (err) {
          console.log(err);
          return reject(new Error("Registration failed"));
        }
        resolve("Registration successful");
      }
    );
  });
};

// ================= LOGIN =================
exports.loginentry = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          console.log("Database error:", err);
          return reject(new Error("Database error"));
        }

        if (results.length === 0) {
          return reject(new Error("Invalid email or password"));
        }

        const user = results[0];

        resolve({
          message: "Login successful",
          user: {
            userid: user.userid,
            name: user.name,
            email: user.email,
            password: user.password, // needed for bcrypt compare
            role: user.role,
          },
        });
      }
    );
  });
};

exports.createScehe = (exam_id, start_time, end_time) => {
    return new Promise((resolve, reject) => {

        db.query(
            `select s.* 
             from schedule s 
             join exam e on s.exam_id = e.exam_id 
             where e.course_id = (
                select course_id from exam where exam_id = ?
             ) 
             and date(s.start_time) = date(?)`,
            [exam_id, start_time],
            (err, result) => {

                if (err) {
                    return reject("Database Error");
                }

                if (result.length > 0) {
                    return reject("Schedule already exist");
                }

                db.query(
                    "insert into schedule(exam_id,start_time,end_time) values(?,?,?)",
                    [exam_id, start_time, end_time],
                    (err, results) => {

                        if (err) {
                            return reject("Schedule not created");
                        }

                        resolve("Schedule generated");
                    }
                );
            }
        );
    });
};

exports.addcoursedetails=(course_name)=>{
     return new Promise((resolve,reject)=>{
        db.query("insert into course(course_name) values(?)",[course_name],(err,results)=>{
            if(err){
                console.log("course not added");
                 return reject(err);

            }
            else{
                console.log("Mysql insert result",results);
                resolve("course added");
            }
        })
    })
}

exports.addexamdetails = (title, total_marks, duration, userid, course_id, start_time, end_time) => {
  return new Promise((resolve, reject) => {
    const created_at = new Date();

    // ✅ Step 1: Check if course_id exists
    db.query("SELECT * FROM course WHERE course_id = ?", [course_id], (err, rows) => {
      if (err) {
        return reject(new Error("Database error while checking course"));
      }

      if (rows.length === 0) {
        return reject(new Error(`Course with id ${course_id} does not exist`));
      }

      // ✅ Step 2: Insert exam
      db.query(
        "INSERT INTO exam(title, total_marks, duration, userid, course_id, created_at) VALUES (?,?,?,?,?,?)",
        [title, total_marks, duration, userid, course_id, created_at],
        (err, results) => {
          if (err) {
            console.log("exam not added", err);
            return reject(new Error("Failed to add exam"));
          }

          const exam_id = results.insertId; // get the new exam_id

          // ✅ Step 3: Insert schedule for this exam
          db.query(
            "INSERT INTO schedule (exam_id, start_time, end_time) VALUES (?,?,?)",
            [exam_id, start_time, end_time],
            (err2) => {
              if (err2) {
                console.log("schedule not added", err2);
                return reject(new Error("Exam added but failed to add schedule"));
              }
              resolve("Exam and schedule added successfully");
            }
          );
        }
      );
    });
  });
};


exports.getSchedule=()=>{
    return new Promise((resolve,reject)=>{
        db.query("select * from schedule",(err,results)=>{
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

exports.deleteSchedule=(schedule_id)=>{
    return new Promise((resolve,reject)=>{
        db.query("delete from schedule where schedule_id=? ",[schedule_id],(err,result)=>{
            if(err){
                console.log(err);
                return reject(err);
            }
            else{
                resolve("schedule deleted");
            }
        })
    })
}
         
exports.fetchScheduleById=(schedule_id)=>{
    return new Promise((resolve,reject)=>{
        db.query("Select * from schedule where schedule_id=?",[schedule_id],(err,result)=>{
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

exports.upschedulDeta=(schedule_id,exam_id,start_time ,end_time)=>{
    return new Promise((resolve,reject)=>{
        db.query("update schedule set exam_id=?,start_time=?,end_time=? where schedule_id=?",[exam_id,start_time ,end_time,schedule_id],(err,result)=>{
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



exports.searchScheduleByDate = (date) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM schedule WHERE DATE(start_time) = DATE(?)", [date], (err, results) => {
            if (err) {
                console.log("DB Error:", err);
                return reject(err);
            }
            resolve(results);
        });
    });
};
