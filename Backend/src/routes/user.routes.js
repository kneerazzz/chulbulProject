import {Router} from 'express'
import { upload } from '../middlewares/multer.middleware.js'
import { loginUser, logoutUser, refreshAcessToken, registerUser, updatePassword, updateUserDetails } from '../controllers/user.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';


const router = Router()

router.route("/register").post(
    upload.single('profilePic'),
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


export default router;