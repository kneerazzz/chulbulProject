import {Router} from 'express'
import { upload } from '../middlewares/multer.middleware.js'
import { getUserDetails, loginUser, logoutUser, refreshAcessToken, registerUser, updatePassword, updateProfilePic, updateUserDetails } from '../controllers/user.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';


const router = Router()

router.route("/register").post(
    registerUser   
)

router.route("/login").post(
    loginUser
)

router.route("/logout").post(
    verifyJwt,
    logoutUser
)

router.route("/update-details").patch(
    verifyJwt,
    updateUserDetails
)

router.route("/change-password").patch(
    verifyJwt,
    updatePassword,
)

router.route("/refresh-access-token").get(
    verifyJwt, 
    refreshAcessToken
)

router.route("/get-user-details").get(
    verifyJwt,
    getUserDetails
)

router.route("/update-profile-pic").patch(
    verifyJwt,
    upload.single('profilePic'),
    updateProfilePic
)


export default router;