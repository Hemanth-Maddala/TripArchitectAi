const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/generate-text', async (req, res) => {
    console.log("ai.js is hit");
    try {
        const plan_input_details = req.body;
        console.log("Received plan input details:", plan_input_details);

        // Send user inputs directly to Python FastAPI
        const response = await axios.post(
            "http://127.0.0.1:8000/plan-trip",   // ✅ Correct URL
            plan_input_details,                   // ✅ Send raw JSON
            { headers: { "Content-Type": "application/json" } }
        );

        console.log("Response from AI planner:", response.data);
        console.log("only itinerary =>",JSON.stringify(response.data.itinerary, null, 2));
        console.log("full json => ",JSON.stringify(response.data, null, 2));
        res.json(response.data);

    } catch (error) {
        console.error("Error connecting to AI planner:", error.message);
        res.status(500).json({ error: "Error connecting to AI planner" });
    }
});

module.exports = router;
