const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/generate-text', async (req, res) => {
    console.log("ai.js is hit");

    try {
        const plan_input_details = req.body;

        if (!plan_input_details || Object.keys(plan_input_details).length === 0) {
            return res.status(400).json({ error: "Request body is empty" });
        }

        const response = await axios.post(
            "https://triparchitectai-python.onrender.com/plan-trip",
            plan_input_details,
            {
                headers: { "Content-Type": "application/json" },
                timeout: 120000
            }
        );

        console.log("AI response received");

        res.json(response.data);

    } catch (error) {
        console.error("FULL ERROR:", error.response?.data || error.message);

        res.status(500).json({
            error: "Error connecting to AI planner",
            details: error.response?.data || error.message
        });
    }
});

module.exports = router;