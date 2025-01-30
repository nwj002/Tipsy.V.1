const router = require('express').Router();
const userController = require('../controllers/userController');
const { authGuard } = require('../middleware/authGuard');

//create anew account
router.post('/create', userController.createUser);

//login to an account
router.post('/login', userController.loginUser);

//get user profile
router.get('/profile/:id', userController.getSingleUser);
router.get('/user/:id', userController.getUserByID);
router.get('/all_user', userController.getAllUsers);
router.get("/get_single_user", authGuard, userController.getSingleUser);
// router.get("/get_single_users", userController.getSingleUsermobile);
//update user profile
router.put('/update/:id', userController.updateUser);

//getActivityLogs
router.get('/activity_logs', userController.getActivityLogs)

// forgot password
router.post('/forgot_password', userController.forgotPassword)

// verify otp and set password
router.post('/verify_otp', userController.verifyOptandSetPassword)

//delete account
router.delete('/delete_account/:id', userController.deleteUser)

// getting user details
router.get('/getMe', userController.getMe)

//verifyLoginOtp
router.post('/verify_login_otp', userController.verifyLoginOtp)

module.exports = router;