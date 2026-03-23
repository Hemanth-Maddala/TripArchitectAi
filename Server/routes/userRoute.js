const express = require("express");
const router = express.Router();

const {createaccount,userlogin,userdetails,updateprofile,verifyforupdate} = require("../view/userView");

router.post("/useraccount",createaccount);
router.post("/userlogin",userlogin);
router.get("/userdetails",userdetails);
router.post("/updateprofile", updateprofile);
router.post("/verifyforupdate", verifyforupdate);

module.exports = router;
