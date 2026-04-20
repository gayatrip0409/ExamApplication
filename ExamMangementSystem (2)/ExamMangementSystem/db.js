require("dotenv").config();
let mysql=require("mysql2");

let con=mysql.createConnection({
    host:process.env.db_host,
    user:process.env.db_user,
    password:process.env.db_password,
    database:process.env.db_dbname
});

con.connect((err)=>{
    if(err){
        console.log("Database connection failed");
        console.log(err);
    }
    else{
        console.log("Database connected sucessfully");
    }
});

module.exports=con;