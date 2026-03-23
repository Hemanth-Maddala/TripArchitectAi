const express = require("express");
const router = express.Router();

const {saveliked, getliked, getSingletrip, unsavetrip} = require("../view/likedView");

router.post("/saveliked",saveliked);
router.get("/getliked/:userId",getliked);
router.get("/getSingleTrip/:saveId", getSingletrip);
router.delete("/unsaveTrip/:tripId", unsavetrip);

module.exports = router;