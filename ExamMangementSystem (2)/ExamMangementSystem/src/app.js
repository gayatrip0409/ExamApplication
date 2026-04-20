let express=require("express");
let bodyparser=require("body-parser");
let cors = require("cors");
require("dotenv").config();
let db=require("../db.js");
let router=require("./routes/route.js");
let {notfound,errorhandler}=require("./middleware/errorhandler.js");

let app=express();


app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());
app.use("/",router);
app.use(notfound);
app.use(errorhandler);



module.exports=app;



