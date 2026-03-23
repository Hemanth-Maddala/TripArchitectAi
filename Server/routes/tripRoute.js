const express = require("express");
const router = express.Router();

const {savetrip, gettrip, getSingletrip, deletetrip} = require("../view/tripView");

router.post("/savetrip",savetrip);
router.get("/gettrip/:userId",gettrip);
router.get("/getSingleTrip/:tripId", getSingletrip);
router.delete("/deleteTrip/:tripId", deletetrip);

module.exports = router;