let express=require("express");
let adminctrl=require("../controller/admincontroller");
let adminmodel=require("../models/adminmodel");
let examctrl=require("../controller/examcontroller");
let exammodel=require("../models/exammodel");
let coursectrl=require("../controller/coursecontroller");
let coursemodel=require("../models/coursemodel");
let quesctrl=require("../controller/questioncontroller");
let quesmodel=require("../models/questionmodel");
let examasignctrl=require("../controller/examassignmentcontroller");
let examassignmodel=require("../models/examassignmentmodel");
let batchctrl=require("../controller/batchcontroller");
let batchmodel=require("../models/batchmodel");


const{verifytoken,isAdmin,isStudent}=require("../middleware/authmiddleware");

let router=express.Router();
router.get("/",adminctrl.homePage);

/*login and register*/
router.post("/api/admin/register",adminctrl.registerpage);
router.post("/api/admin/login",adminctrl.loginpage);

/*Batch*/
router.post("/api/admin/create-batch", batchctrl.createBatch);
router.put("/api/admin/assign-batch", batchctrl.assignBatch);
router.get("/api/admin/students-without-batch", batchctrl.getUnassignedStudents);
router.get("/api/admin/batches", batchctrl.getAllBatches);

/*course roter*/
router.post("/api/addcourse",verifytoken,isAdmin,adminctrl.addCourse);
router.get("/api/course/viewcourse",coursectrl.getallcourse);
router.get("/api/course/searchcoursebyid/:course_id",coursectrl.courseById);
router.put("/api/course/updatecoursebyid/:course_id",verifytoken,isAdmin,coursectrl.updateById);
router.delete("/api/course/deletecoursebyid/:course_id",verifytoken,isAdmin,coursectrl.deletecourseById);
router.get("/api/course/search/:course_name",coursectrl.searchcourseByName);

/*schedule router*/
router.post("/api/schedule/addschedule",verifytoken,isAdmin,adminctrl.createschedule);
router.get("/api/schedule/getallSchedule",adminctrl.getallSchedule);
router.delete("/api/delete/schedule/:schedule_id",verifytoken,isAdmin,adminctrl.deleteScheduleById);
router.get('/api/schedule/:schedule_id',adminctrl.getScheduleById);
router.put("/api/schedule/update",verifytoken,isAdmin,adminctrl.updateshedule);
router.get("/api/schedule/bydate/:date", adminctrl.searchSchedByDate);

/*exam router*/
router.post("/api/addexam",verifytoken,isAdmin,adminctrl.addexam);
router.get("/api/exams/getallexams",examctrl.getallallexams);
router.get("/api/exam/:exam_id",verifytoken,isAdmin,examctrl.getexamById);
router.put("/api/exam/update",examctrl.updateexam);
router.delete("/api/delete/exam/:exam_id",verifytoken,isAdmin,examctrl.deleteexamById);
router.get('/api/exam/search/:created_at', examctrl.searchByDate);
router.post('/api/exam/:exam_id/schedule', examctrl.assignSchedule);
router.get("/api/exams/searchbyname",examctrl.searchExamByName);

/*Question router*/
router.post("/api/questions/addquestions",quesctrl.addQuestions);
router.get("/api/questions/viewquestions",quesctrl.viwequestuions);
router.get("/api/question/schedule/:question_id",quesctrl.getQuestionBYId);
router.put("/api/question/update/:question_id",quesctrl.updateQuestById);
router.delete("/api/question/delete/:question_id",quesctrl.deletequesById);
router.get("/api/question/search/:question_text", quesctrl.searchQuestionByName);


/*Assign questions to exam*/
router.post("/api/questions/exam/assignexam",quesctrl.assignquestionstoexam);
//search questions by exam
router.get("/api/question/byexam/details", quesctrl.getQueByExmDetail);
//search by course name
router.get("/api/question/bycoursename/:course_name", quesctrl.getQueByCouName);


//exam Assignment 
router.post("/api/exams/assign",examasignctrl.addassignment);
router.get("/api/student/:id/examassign",examasignctrl.viewallasignment);
router.post("/api/student/:id/exam/:exam_id/submit",examasignctrl.submitexam);
router.get("/api/student/:id/exam/:exam_id/viewsubmitexam",examasignctrl.viewallsubmit);


router.get("/api/student/:id/view-all-submitted-exams", examasignctrl.viewAllSubmittedExams);
//fail not working
router.get("/api/student/:id/exam/:exam_id/result-details",examasignctrl.viewResultDetails);


// get all students
router.get("/api/admin/allstudents", examasignctrl.getallStudent);

router.get("/api/exam/:exam_id/questions", quesctrl.getQuestionsByExamId);


module.exports=router;
