let cmodel=require("../models/coursemodel");

exports.getallcourse=(req,res)=>{
    let promise=cmodel.getCourse();
    promise.then((result)=>{
        res.send({result});
    })
    promise.catch((err)=>{ 
        res.send(err);
    })
}

exports.courseById =(req, res)=>{
    const course_id =req.params.course_id ;
    console.log("Requested Course ID:", course_id); 
    let promise=cmodel.fetchcourseById(course_id);
    promise.then((result)=>{
        if(result.length===0)
        {
            res.send("No course Found");
        }
        else{
            res.send(result[0]);
        }
    })
    promise.catch((err)=>{
        res.send("Error"+err);
    });
};

exports.updateById = (req, res) => {
    const course_id = req.params.course_id;
    const { course_name } = req.body;

    console.log("Course ID:", course_id);
    console.log("New Course Name:", course_name);

    cmodel.updateCourseById(course_id, course_name)
        .then(result => {
            res.send({ course: result, msg: "success" });
        })
        .catch(err => {
            console.log("Error updating:", err);
            res.status(500).send({ error: err });
        });
};

exports.deletecourseById=(req,res)=>{
      let course_id =req.params.course_id;
        let promise=cmodel.deletecourse(course_id);
    
        if(!course_id){
          return res.send({error:"course_id is required "});
        }
        promise.then((result)=>{
            res.send({result});
        })
        promise.catch((err)=>{
            next(err);
        })
}

exports.searchcourseByName = (req, res) => {
    const course_name = req.params.course_name;

    if (!course_name || course_name.length === 0) {
        return res.send({ error: "Course name is required" });
    }

    const promise = cmodel.searchByName(course_name);

    promise
        .then((courses) => {
            if (courses.length === 0) {
                res.send({ message: "No course found" });
            } else {
                res.send(courses);
            }
        })
        .catch((err) => {
            console.error("Database error:", err);
            res.send({ error: "Internal server error" });
        });
};
