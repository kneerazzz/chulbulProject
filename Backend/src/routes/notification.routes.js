import {Router} from 'express'
import {verifyJwt} from "../middlewares/auth.middleware.js"
import { deleteNotification, getAllNotifications, getNotificationById, getTodayNotifications, getUnreadedNotifications, markAllNotificationAsRead, markNotificationAsRead } from '../controllers/notification.controller.js';


const router = Router()


router.route("/get-all-notifications").get(
    verifyJwt,
    getAllNotifications
)

router.route("/c/:notificationId/mark-as-read").patch(
    verifyJwt,
    markNotificationAsRead
)

router.route("/mark-all-notifications-read").patch(
    verifyJwt,
    markAllNotificationAsRead
)

router.route("/c/:notificationId/delete-notification").delete(
    verifyJwt,
    deleteNotification
)

router.route("/c/:notificationId/get-notification").get(
    verifyJwt,
    getNotificationById
)

router.route("/get-unreaded-notifications").get(
    verifyJwt,
    getUnreadedNotifications
)

router.route("/get-today-notifications").get(
    verifyJwt,
    getTodayNotifications
)


export default router;