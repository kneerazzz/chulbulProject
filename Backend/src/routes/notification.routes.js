import {Router} from 'express'
import {verifyJwt} from "../middlewares/auth.middleware.js"
import { deleteNotification, getAllNotifications, markAllNotificationAsRead, markNotificationAsRead } from '../controllers/notification.controller.js';


const router = Router()


router.route("/c/get-all-notifications").get(
    verifyJwt,
    getAllNotifications
)

router.route("/c/:notificationId/mark-as-read").patch(
    verifyJwt,
    markNotificationAsRead
)

router.route("/c/mark-all-notication-read").patch(
    verifyJwt,
    markAllNotificationAsRead
)

router.route("/c/:notificationId/delete-notification").delete(
    verifyJwt,
    deleteNotification
)


export default router;