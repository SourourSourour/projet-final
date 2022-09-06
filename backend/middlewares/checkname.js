const checkName= (req, res, next)=>{
    if(req.body.name){  next()}
    else{
        res.status(400).send("name is required")
    }

}
module.exports=checkName