const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const sendOtp = require('../service/sendOtp');
const axios = require("axios");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const sanitizeHtml = require("sanitize-html");

dotenv.config();

// Helper function to sanitize inputs
const cleanInput = (input) => sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
});

// Create New User (Registration)
const createUser = async (req, res) => {
    console.log(req.body);

    const fullname = cleanInput(req.body.fullname);
    const username = cleanInput(req.body.username);
    const email = cleanInput(req.body.email);
    const password = cleanInput(req.body.password);
    const age = cleanInput(req.body.age);
    const phone = cleanInput(req.body.phone);
    const captchaToken = req.body.captchaToken;

    if (!fullname || !email || !username || !age || !password || !phone || !captchaToken) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    // Validate CAPTCHA
    const isHuman = await verifyRecaptcha(captchaToken);
    if (!isHuman) {
        return res.status(400).json({
            success: false,
            message: "CAPTCHA verification failed",
        });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character",
        });
    }

    try {
        const userExists = await userModel.findOne({
            $or: [{ email: email }, { username: username }],
        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "Email or username already exists!",
            });
        }

        if (age < 18) {
            return res.status(400).json({
                success: false,
                message: "You must be at least 18 years old to create an account",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            fullname,
            username,
            email,
            password: hashedPassword,
            age,
            phone,
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User created successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// User Login with OTP
const loginUser = async (req, res) => {
    console.log(req.body);
    const email = cleanInput(req.body.email);
    const password = cleanInput(req.body.password);
    const captchaToken = req.body.captchaToken;

    if (!email || !password || !captchaToken) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields and verify CAPTCHA.",
        });
    }

    const isHuman = await verifyRecaptcha(captchaToken);
    if (!isHuman) {
        return res.status(400).json({
            success: false,
            message: "CAPTCHA verification failed",
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist.",
            });
        }

        const lockoutTime = 15 * 60 * 1000;
        if (user.failedAttempts >= 5 && Date.now() - user.lastAttemptTime < lockoutTime) {
            return res.status(400).json({
                success: false,
                message: "Account is locked. Try again later.",
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            user.failedAttempts = (user.failedAttempts || 0) + 1;
            user.lastAttemptTime = Date.now();
            await user.save();

            if (user.failedAttempts >= 5) {
                return res.status(400).json({
                    success: false,
                    message: "Too many failed attempts. Your account is locked for 15 minutes.",
                });
            }

            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }

        // Reset failed attempts
        user.failedAttempts = 0;
        user.lastAttemptTime = null;

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Convert OTP to string
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes validity

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        console.log("Generated OTP:", otp); // Debugging log

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "nwj.shrestha@gmail.com",
                pass: "kcazmnuxtxeexnrx",
            },
        });

        await transporter.sendMail({
            from: "tipsy@gmail.com",
            to: email,
            subject: "Your Login OTP",
            text: `Your OTP for login is ${otp}. It is valid for 10 minutes.`,
        });

        res.status(200).json({
            success: true,
            message: "OTP sent to your email. Please verify to complete login.",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

const verifyLoginOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required.",
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist.",
            });
        }

        console.log("Stored OTP:", user.otp, "User entered OTP:", otp); // Debugging

        if (!user.otp || user.otpExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired, please try again.",
            });
        }

        if (String(user.otp) !== String(otp)) {  // Ensure both are compared as strings
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please try again.",
            });
        }

        // Clear OTP on successful verification
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            success: true,
            message: "OTP verified successfully!",
            token,
            userData: user,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};


// verify captcha
const verifyRecaptcha = async (token) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    try {
        const response = await axios.post(url);
        return response.data.success;
    } catch (error) {
        console.error("reCAPTCHA verification error:", error);
        return false;
    }
};

//fetch user data
// const getUserData = async (req, res) => {
//     const { userId } = req.query;

//     // if (!userId) {
//     //     return res.json({
//     //         success: false,
//     //         message: "User ID is required!",
//     //     });
//     // }

//     try {
//         const user = await userModel.findById(userId);
//         if (!user) {
//             return res.json({
//                 success: false,
//                 message: "User does not exist!",
//             });
//         }

//         res.json({
//             success: true,
//             message: "User details fetched successfully",
//             userData: user,
//         });
//     } catch (e) {
//         console.log(e);
//         return res.json({
//             success: false,
//             message: "Internal server error!",
//         });
//     }
// };
// function to get single user
const getSingleUser = async (req, res) => {
    const id = req.user.id;
    if (!id) {
        return res.json({
            success: false,
            message: "User id is required!"
        })
    }
    try {
        const singleUser = await userModel.findById(id);
        res.json({
            success: true,
            message: "User fetched successfully",
            data: singleUser

        })

    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error")

    }
}

const updateUser = async (req, res) => {
    try {
        const { fullname, username, email, age, phone } = req.body;
        const userId = req.params.id;

        // Check if the user exists
        const userExists = await userModel.findById(userId);

        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update user fields
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { fullname, username, email, age, phone },
            { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators: true` applies validation
        );

        // Send the response
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

//delete user
const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        await user.remove();
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error
        })
    }
}
// Forgot Password
const forgotPassword = async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({
            'success': false,
            'message': 'Provide your phone number!'
        })
    }

    try {

        // finding user
        const user = await userModel.findOne({ phone: phone })
        if (!user) {
            return res.status(400).json({
                'success': false,
                'message': 'User Not Found!'
            })
        }

        // generate random 6 digit otp
        const otp = Math.floor(100000 + Math.random() * 900000)

        // generate expiry date
        const expiryDate = Date.now() + 360000;

        // save to database for verification
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = expiryDate;
        await user.save();

        // send to registered phone number
        const isSend = await sendOtp(phone, otp)
        if (!isSend) {
            return res.status(400).json({
                'success': false,
                'message': 'Error Sending OTP Code!'
            })
        }

        // if success
        res.status(200).json({
            'success': true,
            'message': 'OTP Send Successfully!'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            'success': false,
            'message': 'Server Error!'
        })
    }
}
//verify opt  and set new password
const verifyOptandSetPassword = async (req, res) => {
    //get date 
    const { phone, otp, newPassword } = req.body;
    if (!phone || !otp || !newPassword) {
        return res.status(400).json({
            'success': false,
            'message': 'Please provide all the fields!'
        })
    }
    try {
        //find user
        const user = await userModel.findOne({ phone: phone })
        //check otp
        if (user.resetPasswordOTP != otp) {
            return res.status(400).json({
                'success': false,
                'message': 'Invalid OTP!'
            })
        }
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                'success': false,
                'message': 'OTP Expired!'
            })
        }
        // hashing/encryption of the password
        const randomSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, randomSalt)

        //set new password
        user.password = hashedPassword;
        await user.save();

        //response
        res.status(200).json({
            'success': true,
            'message': 'Password Reset Successfully!'
        })



    } catch (error) {
        console.log(error)
        res.status(500).json({
            'success': false,
            'message': 'Server Error!'
        })

    }
}

// Get user by ID
const getUserByID = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// get all users for admin
const getAllUsers = async (req, res) => {
    try {
        const allusers = await userModel.find();
        res.status(200).json({ success: true, "data": allusers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(`Decoded token: ${JSON.stringify(decoded)}`);

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist!",
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};



module.exports = {
    createUser,
    loginUser,
    getSingleUser,
    updateUser,
    forgotPassword,
    verifyOptandSetPassword,
    deleteUser,
    getUserByID,
    getAllUsers,
    // getSingleUsermobile,
    getMe,
    verifyLoginOtp,
};

