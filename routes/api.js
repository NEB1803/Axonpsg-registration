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

/* CHECK-IN (SAFE VERSION) */
router.get("/checkin", async (req,res)=>{

  const id = req.query.id;

  const user = await Delegate.findOneAndUpdate(
    { delegateId: id, checked: false },
    { checked: true, timestamp: new Date() },
    { new: true }
  );

  if (user) {
    return res.json({
      status:"VALID",
      name:user.firstName+" "+user.lastName,
      workshops:user.workshops
    });
  }

  const already = await Delegate.findOne({ delegateId: id });

  if (!already) return res.json({ status:"NOT_FOUND" });

  return res.json({
    status:"ALREADY",
    name:already.firstName+" "+already.lastName,
    workshops:already.workshops
  });
});

/* DASHBOARD */
router.get("/dashboard", async (req,res)=>{

  const total = await Delegate.countDocuments();
  const checked = await Delegate.countDocuments({checked:true});

  res.json({
    total,
    checked,
    pending: total - checked
  });
});

module.exports = router;