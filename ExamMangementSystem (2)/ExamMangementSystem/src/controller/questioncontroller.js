let qmodel=require("../models/questionmodel");

exports.addQuestions=(req,res)=>{
    let{question_text,option_a,option_b,option_c,option_d,correct_option,marks}=req.body;
    if(!question_text||
        !option_a||
        !option_b||
        !option_c||
        !option_d||
        !correct_option||
        marks===undefined||
        marks===null){
        return res.status(400).send({message:"All feilds are mandatory"});
    }
    let promise=qmodel.addquestionsdetails(question_text,option_a,option_b,option_c,option_d,correct_option,marks);
    promise.then((result)=>{
        res.send({result});
    })
    promise.catch((err)=>{
        res.status(400).send({error:err});
    })

}

exports.viwequestuions=(req,res)=>{
    let promise=qmodel.viewques();
    promise.then((result)=>{
        res.send({result});
    })
    promise.catch((err)=>{
        res.status(400).send({error:err});
    })
}

//assign questions to exam
exports.assignquestionstoexam=async(req,res)=>{
    try{
        let{exam_id,questionsIds }=req.body;
        let result= await qmodel.assignquesexam(exam_id,questionsIds);
        res.status(201).send({message:result});
    }
    catch(err){
         res.status(400).send({error:err.message||err});

    }
}

//search exam by name
exports.getQueByExmDetail = (req, res) => {
  const { title, start_time } = req.query;

  if (!title || !start_time) {
    return res.status(400).json({ message: 'title and exam_date are required' });
  }

  qmodel.searchByExamTitleAndDate(title, start_time)
    .then(results => {
      if (results.length === 0) {
        return res.status(404).json({ message: 'No questions found for the given title and date' });
      }
      res.status(200).json(results);
    })
    .catch(error => {
      console.error('DB error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    });
};



//search by course name
exports.getQueByCouName=(req,res)=>{
const{course_name}=req.params;
if (!course_name) {
    return res.status(400).json({ message: 'course name required' });
  }
qmodel.getQuestionByCname(course_name)
.then(result => {
      if (result.length === 0) {
        return res.status(404).json({ message: 'No questions found for the given course' });
      }
      res.status(200).json(result);
    })
    .catch(error => {
      console.error('DB error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    });
}

exports.getQuestionBYId=(req,res)=>{
    const question_id=req.params.question_id;
    let promise=qmodel.getQuestBYId(question_id);
    promise.then((result)=>{
        if(result.length===0)
        {
            res.send("No Question Found");
        }else{
            res.send(result[0]);
        }
    })
    promise.catch((err)=>{
        res.send(err);
    })
};

exports.updateQuestById = (req, res) => {
    const question_id = req.params.question_id;
    const quest = { ...req.body };
    const promise = qmodel.UpQueById(quest, question_id);
    promise.then((result) => {
        if (result.affectedRows === 0) {
            return res.status(404).send({ msg: "question not found " });
        }
        res.status(200).send({ msg: "Question updated successfully" });
    }).catch((err) => {
        res.status(500).send({ error: err });
    });
};


exports.deletequesById=(req,res)=>{
    let question_id=req.params.question_id;
    let promise=qmodel.delquestion(question_id);

    if(!question_id)
    {
        return res.send({error:"question_id is required"});
    }
    promise.then((result)=>{
        res.send({result});
    })
    promise.catch((err)=>{
        next(err);
    })

}

exports.searchQuestionByName = (req, res) => {
   const question_text = req.params.question_text; 

  if (!question_text) {
    return res.status(400).json({ message: 'Question is required' });
  }

  qmodel.searchByName(question_text)
    .then(results => res.status(200).json(results))
    .catch(error => {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    });
};


exports.getQuestionsByExamId = (req, res) => {
  const exam_id = req.params.exam_id;

  if (!exam_id) {
    return res.status(400).json({ message: "Exam ID is required" });
  }

  qmodel
    .getQuestionsByExamId(exam_id)
    .then((questions) => {
      if (questions.length === 0) {
        return res.status(404).json({ message: "No questions found for this exam" });
      }
      res.status(200).json({ questions });
    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Internal Server Error" });
    });
};
