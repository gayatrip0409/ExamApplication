const assignmentmodel=require("../models/examassignmentmodel");

exports.addassignment=(req,res)=>{
    let{userid,exam_id}=req.body;
    if(!userid||!exam_id){
        return res.status(400).send("All feilds are mandatory");
    }

let promise=assignmentmodel.adddatintoassignment(userid,exam_id);
promise.then((result)=>{
    res.send("assignment is added");
})
promise.catch((err)=>{
    res.status(400).send({error:err});
});
}

exports.viewallasignment=(req,res)=>{
    let userid=req.params.id;
    if(!userid){
       return res.status(404).json({error:"student id is required"});
    }

    let promise=assignmentmodel.viewassign(userid);
    promise.then((result)=>{
        if(result.length==0){
            return res.status(404).json({msg:"No exams asiign to this student"});
        }
        res.send({result});
    })
    promise.catch((err)=>{

        res.status(500).send({error:"Internal servor error"});
    })
}

exports.submitexam=(req,res)=>{
    let{id,exam_id}=req.params;
    let{answers}=req.body;

    if(!id||!exam_id){
        return res.status(400).json({error:"student id and examid are required"});
    }
    if(answers.length===0){
        return res.status(400).json({error:"Answers are required"});
    }
    let promise=assignmentmodel.SubmitExamss(id,exam_id,answers);
    promise.then((result)=>{
        res.status(200).json({message:"exam submitted successfully",score:result.score,total:result.total});
    })
    .catch((err)=>{

        if (typeof err === "string") {
        return res.status(400).json({ error: err });
        }
        if (err && err.message) {
         return res.status(400).json({ error: err.message });
        }

        res.status(500).json({error:"Internal server error "});
    })
}

exports.viewallsubmit=(req,res)=>{
    let{id,exam_id}=req.params;

    if(!id||!exam_id){
        return res.status(400).json({error:"student id and examid are required"});
    }

    let promise=assignmentmodel.getExamResult(id,exam_id);
    promise.then((result)=>{
        if(result.length===0){
            return res.status(404).json({msg:"No result found for this exam"});
        }
        res.status(200).json({result});
    })
    promise.catch((err)=>{
        console.error(err);
        res.status(500).json({error: "internal server error"})
    });
};


exports.getallStudent = (req, res) => {
  assignmentmodel
    .getstudent()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(" Error fetching students:", err);
      res.status(500).json({ error: "internal server error" });
    });
};

exports.viewAllSubmittedExams = (req, res) => {
  let { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "student id is required" });
  }

  let promise = assignmentmodel.getAllExamResults(id);

  promise
    .then((results) => {
      if (results.length === 0) {
        return res.status(404).json({ msg: "No results found for this student" });
      }
      res.status(200).json({ results });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.viewResultDetails = (req, res) => {
  const { id, exam_id } = req.params;

  if (!id || !exam_id) {
    return res
      .status(400)
      .json({ error: "Student ID and Exam ID are required" });
  }

  assignmentmodel
    .getResultDetails(id, exam_id)
    .then((results) => {
      if (results.length === 0) {
        return res
          .status(404)
          .json({ msg: "No result details found for this exam" });
      }

      res.status(200).json({ result: results });
    })
    .catch((err) => {
      console.error("Error fetching result details:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};

