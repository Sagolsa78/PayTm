const express=require("express");


const router=express.Router();
const zod =require("zod");
const {User,Account}=require("../DB/db");
const jwt =require("jsonwebtoken");
const JWT_SECRET=require("../config");
const {authMiddleware}=require("../middleware/authmiddleware");



const signupBody=zod.object({
    username:zod.string().email(),
    firstname:zod.string(),
    lastname:zod.string(),
    password:zod.string(),

})

router.post("/signup",async (req,res)=>{
    const {success}=signupBody.safeParse(req.body)
    if(success){
        return res.status(411).json({
            msg:"EMAil already taken/incorrect inputs"

        })
    }

    try
    {const existingUser=await User.findOne({
        username:req.body.username
    })

    if(existingUser){
        return res.status(411).json({
            msg:"Email aleardy taken/"
        })
    }
    const user=await User.create({
        username:req.body.username,
        password:req.body.password,
        firstname:req.body.firstname,
        lastnamea:req.body.lastname
    })

    const userId=user._id;

    await Account.create({
        userId,
        balance:1+Math.random()*10000
    })

    const token =jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        msg:"User created successfully ",
        token:token
    })}
    catch{
        return res.status.json({
            msg:'error while creating user'
        })
    }
})


module.exports=router;