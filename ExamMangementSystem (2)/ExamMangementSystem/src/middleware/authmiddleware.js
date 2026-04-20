const jwt=require("jsonwebtoken");

exports.verifytoken=(req,res,next)=>{
    const authheader=req.headers.authorization;

    if(!authheader || !authheader.startsWith("Bearer")){
        return res.status(401).json({error:"unauthorized token"});
    }

    const token=authheader.split(" ")[1];

    try{
        const decoded=jwt.verify(token,process.env.jwt_secret);
        req.user=decoded;
        next();
    }catch(err){
        res.status(403).json({error:"Inavlid or expired token"});
    }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role.toLowerCase() !== "admin") {
    return res.status(403).json({ error: "admin only" });
  }
  next();
};

exports.isStudent = (req, res, next) => {
  if (req.user.role.toLowerCase() !== "student") {
    return res.status(403).json({ error: "student only" });
  }
  next();
};