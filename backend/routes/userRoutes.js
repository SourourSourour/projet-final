const express=require ("express")
const checkName = require("../middlewares/checkname")
const User = require("../models/User")
const router=express.Router()
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

// login logout register getUser getusers update delete

router.post("/registeruser",  async (req, res) => {
    const { email, password } = req.body;
    try {
      const existUser = await User.findOne({ email });
      if (existUser) {
        return res.status(400).send({ msg: "user already exist, please login" });
      }
      const newUser = new User({ ...req.body });
      const hashedPassword = await bcrypt.hash(password, 10);
      // console.log(hashedPassword);
      newUser.password = hashedPassword;
      //erroooooooooooooooooooooooooooooooor: newUser={...newUser,password:password}
      await newUser.save();
      res.send({ msg: "user successfully registred", newUser });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  });
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existedUser = await User.findOne({ email });
      if (!existedUser) {
        return res.status(400).send({ msg: "bad credential" });
      }
      const isMatched = await bcrypt.compare(password, existedUser.password);
      if (!isMatched) {
        return res.status(400).send({ msg: "bad credential" });
      }
      const payload = { idUser: existedUser._id };
      const token = await jwt.sign(payload, process.env.secretOrPublicKey);
      res.send({ user: existedUser, token });
    } catch (error) {
      console.log(error);
    }
  });

router.put("/:id",async(req,res)=>{
    try {
     // console.log({...req.body});
     const result=await Product.updateOne({_id:req.params.id},{$set:{...req.body}})
     const productUpdated=await Product.findOne({_id:req.params.id})
  
       //const result=await Product.findByIdAndUpdate({_id:req.params.id},{$set:{...req.body}},{new:true})
       if(result.modifiedCount){return res.send({msg:"product updated ",productUpdated})}
        res.status(400).send({msg:"already updated"})
      //console.log(result);
    } catch (error) {
      console.log(error)
      res.status(400).send("failed to update")
    }
  })
router.delete("/delete/:id",async(req, res)=>{
    try {
        const deleteuser=await user.deleteOne({_id:req.params.id})
        if (deleteuser.deletedCount){    return    res.send({msg:"user deleted"})
    }
    res.status(400).send({msg:"user already deleted"})

        res.send({msg:"user deleted"})
    } catch (error) {
        res.status(400).send(error.message)
        
    }
})

router.get("/currentUser", isAuth(), (req, res) => {
  console.log(req.user);
  res.send(req.user);
});
router.get("/allUsers", isAuth(), isAdmin, async (req, res) => {
  /*console.log(req.user);
  res.send(req.user);*/
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});


module.exports=router