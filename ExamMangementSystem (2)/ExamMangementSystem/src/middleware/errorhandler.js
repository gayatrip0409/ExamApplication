const notfound=(req,res,next)=>{
    res.status(404).json({error:"Not Found"});
};

const errorhandler=(err,req,res,next)=>{
     res.status(500).json({error:"internal server error"})
}

module.exports={notfound,errorhandler};