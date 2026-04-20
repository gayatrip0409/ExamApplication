
let admodel=require("../models/adminmodel");
let jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

exports.homePage=(req,res)=>{
    res.render("home.ejs");

};



exports.loginpage = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Get user from DB
    const result = await admodel.loginentry(email);
    const user = result.user;

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Remove password before sending
    delete user.password;

    // Check JWT Secret
    if (!process.env.jwt_secret) {
      return res.status(500).json({ message: "JWT Secret missing in .env" });
    }

    // Generate token
    const token = jwt.sign(
      {
        userid: user.userid,
        email: user.email,
        role: user.role,
      },
      process.env.jwt_secret,
      { expiresIn: "2d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    return res.status(401).json({
      message: err.message || "Login failed",
    });
  }
};

// ================= REGISTER =================
exports.registerpage = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    let created_at = new Date();

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await admodel.registerentry(
      name,
      email,
      hashedPassword,
      role,
      created_at
    );

    return res.status(200).json({
      message: "Registration successful",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Registration failed",
    });
  }
};

exports.createschedule = async (req, res) => {
    try {
        let { exam_id, start_time, end_time } = req.body;

        if (!exam_id || !start_time || !end_time) {
            return res.status(400).send({ error: "All fields are mandatory" });
        }

        let result = await admodel.createScehe(exam_id, start_time, end_time);

        res.send({ message: result });

    } catch (err) {
        res.status(400).send({ error: err });
    }
};
//imp ctrl
exports.searchSchedByDate = (req, res) => {
    const date = req.params.date;
    console.log("==== Route /api/schedule/:date hit ====");
    console.log("Received start_time param:", date);

    if (!date) {
        return res.status(400).send("Date parameter is missing");
    }

    admodel.searchScheduleByDate(date)
        .then(results => {
            console.log("DB results:", results);
            if (results.length === 0) {
                return res.status(404).send('No schedule found');
            }

            /*let output = '';
            for (const row of results) {
                output += `Schedule ID: ${row.schedule_id}, Exam ID: ${row.exam_id}, Start: ${row.start_time}, End: ${row.end_time}\n`;
            }

            res.send(output);*/
            res.json({ result: results });

        })
        .catch(err => {
            console.log("DB Error:", err);
            res.status(500).send('Database error: ' + err);
        });
};


exports.addCourse = (req, res) => {
  const { course_name } = req.body;

  if (!course_name || !course_name.trim()) {
    return res.status(400).send({ error: "Course name is required" });
  }

  admodel.addcoursedetails(course_name.trim())
    .then((result) => res.send({ result }))
    .catch((err) => {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).send({ error: "Course already exists" });
      }
      res.status(500).send({ error: "Server error" });
    });
};


exports.addexam = async (req, res) => {
  const { title, total_marks, duration, course_id, start_time, end_time } = req.body;
  const userid = req.user.userid;

  if (!title || !total_marks || !duration || !course_id || !start_time || !end_time) {
    return res.status(400).json({ error: "All fields are required (including schedule)" });
  }
  const now = new Date();
  const start = new Date(start_time);
  const end = new Date(end_time);

  if (start < now) {
    return res.status(400).json({ error: "Exam start time cannot be in the past" });
  }

  if (end <= start) {
    return res.status(400).json({ error: "Exam end time must be after start time" });
  }

  try {
    const result = await admodel.addexamdetails(title, total_marks, duration, userid, course_id, start_time, end_time);
    res.json({ message: "Exam and schedule added successfully", result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



exports.getallSchedule=(req,res)=>{
    let promise=admodel.getSchedule();
    promise.then((result)=>{
        res.send({result});
    })
    promise.catch((err)=>{
        res.send(err);
    })
}


exports.deleteScheduleById=(req,res)=>{
    let schedule_id =req.params.schedule_id;
    let promise=admodel.deleteSchedule(schedule_id);

    if(!schedule_id){
      return res.send({error:"schedule_id is required "});
    }
    promise.then((result)=>{
        res.send({result});
    })
    promise.catch((err)=>{
        res.send(err);
    })
}

exports.getScheduleById=(req,res)=>{
    const schedule_id=req.params.schedule_id;
    let promise=admodel.fetchScheduleById(schedule_id);
    promise.then((result)=>{
        if(result.length===0)
        {
            res.send("No schedule Found");
        }
        else{
            res.send(result[0]);
        }
    })
    promise.catch((err)=>{
        res.send("Error"+err);
    });
}

exports.updateshedule=(req,res)=>{
    let{schedule_id,exam_id,start_time ,end_time}=req.body;
    console.log( exam_id);
    let promise=admodel.upschedulDeta(schedule_id,exam_id,start_time ,end_time);
    promise.then((result)=>{
        res.send({schedule: result,msg:"success"})
    })
    .catch((err)=>{
         console.error("Update schedule error:", err);
        res.status(500).send({ error: "Internal server error" });
    });
}


