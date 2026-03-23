const express = require("express")
require('dotenv').config();
const connectDb = require("./connection/db.js")

// Nodemailer
const cron = require('node-cron');
const nodemailer = require('nodemailer');

const app = express()
const cors = require('cors');
connectDb();

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})

// Nodemailer 
// POST /send-email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendEmail = async (req, res) => {
  try {
    const { from, subject, message } = req.body;

    if (!from || !subject || !message) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required",
      });
    }

    await transporter.sendMail({
      from: from, // ✅ safer
      to: process.env.EMAIL,
      subject: `${subject} (from ${from})`,
      text: message,
    });

    return res.status(200).json({
      success: true,
      msg: "Email sent successfully",
    });

  } catch (error) {
    console.log("Email error:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to send email",
    });
  }
};

app.post("/send-email", sendEmail);

// routes
app.use('/api/ai', require('./routes/ai'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/hoteldetails', require('./routes/hotel_details'));

// user schema
app.use("/user",require("./routes/userRoute.js"));
app.use("/trip",require("./routes/tripRoute.js"));
app.use("/like",require("./routes/likedRoute.js"));

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});

