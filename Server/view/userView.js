const userSchema = require("../schema/user.js");
const bcrypt = require("bcrypt");

let success = false;

const createaccount = async (req, res) => {
    try {
        const { Username, Email, Password } = req.body;
        const checkemail = await userSchema.findOne({ Email: Email });
        if (checkemail) {
            return res.status(400).json({
                success: false,
                msg: "Email already registered. Please login or use a different email."
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(Password, salt);
        const userdata = await userSchema.create({
            Username: Username,
            Email: Email,
            Password: hashpassword,
        });

        return res.status(200).json({
            success: true,
            data: userdata
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            msg: "Server error occurred during registration"
        });
    }
}
const userlogin = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        if (!Email || !Password) {
            return res.status(400).json({
                success: false,
                msg: "Email and password are required"
            });
        }
        const checkmail = await userSchema.findOne({ Email: Email });
        if (!checkmail) {
            return res.status(400).json({
                success: false,
                msg: "Email not registered. Please sign up first."
            });
        }
        const correctpass = await bcrypt.compare(Password, checkmail.Password);
        if (!correctpass) {
            return res.status(400).json({
                success: false,
                msg: "Invalid password"
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                _id: checkmail._id,
                Username: checkmail.Username,
                Email: checkmail.Email,
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            msg: "Server error occurred during login"
        });
    }
}

const userdetails = async (req, res) => {
    try {
        const { Email } = req.query;
        const details = await userSchema.findOne({ Email: Email });

        if (!details) {
            return res.status(400).json({
                success: false,
                msg: "Email not registered. Please sign up first."
            });
        }

        console.log(details)

        return res.status(200).json({
            success: true,
            details: details
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
}

const updateprofile = async (req, res) => {
    try {

        const { oldEmail, newEmail, Username, Password } = req.body;

        const user = await userSchema.findOne({ Email: oldEmail });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }
        const emailExists = await userSchema.findOne({ Email: newEmail });

        if (emailExists && oldEmail !== newEmail) {
            return res.status(400).json({
                success: false,
                msg: "Email already in use"
            });
        }

        const updateFields = { Username: Username, Email: newEmail };
        if (Password && typeof Password === "string" && Password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            const hashpassword = await bcrypt.hash(Password, salt);
            updateFields.Password = hashpassword;
        }

        const updatedUser = await userSchema.findOneAndUpdate(
            { Email: oldEmail },
            { $set: updateFields },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            // details: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};

const verifyforupdate = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const details = await userSchema.findOne({ Email: Email });

        if (!details) {
            return res.status(400).json({
                success: false,
                msg: "Email not registered. Please sign up first."
            });
        }

        const correctpass = await bcrypt.compare(Password, details.Password);
        if (!correctpass) {
            return res.status(400).json({
                success: false,
                msg: "not Authorized"
            });
        }

        return res.status(200).json({
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
}
module.exports = { createaccount, userlogin, userdetails, updateprofile, verifyforupdate };