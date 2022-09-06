const express=require ("express")
const checkName = require("../middlewares/checkname")
const product = require("../models/product")
const isAuth = require("../middlewares/isAuth");
const upload=require("../utils/multer")

const router=express.Router()


router.post("/addProduct",upload("products").single("file"),isAuth(), async(req, res)=>{
    console.log(req.file)
    const url = `${req.protocol}://${req.get('host')}`;
   // console.log(req.file);  
   const { file } = req;
    try {
        const existProduct=await product.findOne({name:req.body.name})
        if(existProduct){
           return res.status(400).send({msg:"product already exist"})
        }
        const newProduct=new product({...req.body,user:req.user._id})
        newProduct.image = `${url}/${file.path}`;
        await newProduct.save()
        res.send({msg:"successfully added", newProduct})
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get("/allProducts" ,async(req, res)=>{
    try {
        const allProducts=await product.find({}).populate("user")
        res.send({msg:"all products exist", allProducts})
    } catch (error) {
        res.status(400).send(error.message)

        
    }
})
router.delete("/deleteProduct/:id", async(req, res)=>{
    try {
        const deleteProduct=await product.deleteOne({_id:req.params.id})
        if (deleteProduct.deletedCount){    return    res.send({msg:"product deleted"})
    }
    res.status(400).send({msg:"product already deleted"})

        res.send({msg:"product deleted"})
    } catch (error) {
        res.status(400).send(error.message)
        
    }
})
router.put("/edit/:id", async(req, res)=>{
    try {
        const editProduct=await product.updateOne({_id:req.params.id}, {$set:{...req.body}})
        if (editProduct.modifiedCount){ return res.send({msg:"product edited"})}
        res.status(400).send({msg:"product already edited"})

    } catch (error) {
        res.status(400).send(error.message)
    }
})
router.get("/details/:id",async(req,res)=>{
    try {
       const oneProduct=await Product.findOne({_id:req.params.id}) 
       res.send({oneProduct})
      } catch (error) {
          console.log(error)
          res.status(400).send("failed to get the product")
      }
   
  })

module.exports=router