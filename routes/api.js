const router = require("express").Router();
const Delegate = require("../models/Delegate");

/* LOGIN */
router.get("/login",(req,res)=>{
  const {username,password}=req.query;

  if(username==="admin" && password==="axon2026"){
    return res.json({status:"SUCCESS"});
  }
  res.json({status:"FAIL"});
});

/* CHECKIN */
router.get("/checkin",async(req,res)=>{
  const user=await Delegate.findOne({delegateId:req.query.id});

  if(!user) return res.json({status:"NOT_FOUND"});

  if(user.checked){
    return res.json({
      status:"ALREADY",
      name:user.firstName+" "+user.lastName,
      workshops:user.workshops
    });
  }

  user.checked=true;
  user.timestamp=new Date();
  await user.save();

  res.json({
    status:"VALID",
    name:user.firstName+" "+user.lastName,
    workshops:user.workshops
  });
});

/* DASHBOARD */
router.get("/dashboard",async(req,res)=>{
  const total=await Delegate.countDocuments();
  const checked=await Delegate.countDocuments({checked:true});

  res.json({
    total,
    checked,
    pending:total-checked
  });
});

module.exports=router;