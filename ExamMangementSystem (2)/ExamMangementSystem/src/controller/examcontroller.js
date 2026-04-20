let exmodel=require("../models/exammodel");

exports.getallallexams=(req,res)=>{
    let promise=exmodel.getExam();
    promise.then((result)=>{
        res.send({result});
    })
    promise.catch((err)=>{
        res.send(err);
    })
}

exports.getexamById=(req,res)=>{
    const exam_id=req.params.exam_id;
        let promise=exmodel.fetchexamById(exam_id);
        promise.then((result)=>{
            if(result.length===0)
            {
                res.send("No Exam Found");
            }
            else{
                res.send(result[0]);
            }
        })
        promise.catch((err)=>{
            next("Error"+err);
        });

}

exports.updateexam=(req,res)=>{
    let{title,total_marks,duration,userid,created_at,course_id,exam_id}=req.body;
    console.log( exam_id);
    let promise=exmodel.updateexamdata(title,total_marks,duration,userid,created_at,course_id,exam_id);
    promise.then((result)=>{
        res.send({exam: result,msg:"success"})
    })
    promise.catch((err)=>{
        res.send({error:err});
    });
}

exports.deleteexamById=(req,res)=>{
      let exam_id =req.params.exam_id;
        let promise=exmodel.deleteexam(exam_id);
    
        if(!exam_id){
          return res.send({error:"exam_id is required "});
        }
        promise.then((result)=>{
            res.send({result});
        })
        promise.catch((err)=>{
            next(err);
        })
}



exports.searchByDate = (req, res) => {
    const created_at = req.params.created_at;

    exmodel.searchExamByDate(created_at)
        .then(results => {
            if (results.length === 0) {
                return res.status(404).send('No Exam found');
            }

            let output = '';
            for (const row of results) {
                output += `Exam ID: ${row.exam_id}, Title: ${row.title}, Marks: ${row.total_marks}, Duration: ${row.duration}, Created: ${row.created_at}\n`;
            }

            console.log("Searching for exam on:", created_at);
            res.send(output);
        })
        .catch(err => {
            res.status(500).send('Database error: ' + err);
        });
};
exports.assignSchedule = (req, res) => {
  const exam_id = req.params.exam_id;
  const { start_time, end_time } = req.body;

  if (!start_time || !end_time) {
    return res.status(400).send("Start time and end time are required");
  }

  exmodel.assignSchedule(exam_id, start_time, end_time)
    .then((result) => {
      res.send("Schedule assigned successfully");
    })
    .catch((err) => {
      res.status(500).send("Error assigning schedule: " + err);
    });
};

exports.searchExamByName = (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: "Missing search term" });

  exmodel.searchExamByName(name, (err, results) => {
    if (err) return res.status(500).json({ error: "Search failed" });
    res.json({ result: results });
  });
};