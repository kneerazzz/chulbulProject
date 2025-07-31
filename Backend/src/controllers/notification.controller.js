import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getAllNotifications = asyncHandler(async(req, res) => {
    const user = req.user;

    if(!user){
        throw new ApiError(401,"Auth middle ware is broken - user not found")
    }

    const notifications = await Notification.find({
        user: user._id
    }).sort({createdAi: -1})

    if(!notifications){
        throw new ApiError(500, "No notications found - error getting notifications")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, notifications, "Notifications fetched successfully")
    )
})


const markNotificationAsRead = asyncHandler(async(req, res) => {
    const user = req.user;

    if(!user){
        throw new ApiError(401, "Auth middleware is broken - user not found")
    }

    const {notificationId} = req.params;

    if(!notificationId){
        throw new ApiError(400, "No notication id found")
    }

    const notification = await Notification.findOne({
        user: user._id,
        _id: notificationId
    })

    if(!notification){
        throw new ApiError(400, "No notication found")
    }
    notification.isRead = true;

    await notification.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(200, notification, "Notification marked as read")
    )
})

const markAllNotificationAsRead = asyncHandler(async(req, res) => {
    const user = req.user;

    if(!user){
        throw new ApiError(400, "Auth middleware is broken - user not found")
    }

    const notifications = await Notification.updateMany({
        user: user._id,
        isRead: false
    }, {$set: {
        isRead: true
    }})

    return res
    .status(200)
    .json(
        new ApiResponse(200, notifications, "All notications are marked as read")
    )

})

const deleteNotification = asyncHandler(async(req, res) => {
    const user = req.user;

    if(!user){
        throw new ApiError(401, "Auth middleware is broken - user not found")
    }

    const {notificationId} = req.params;

    if(!notificationId){
        throw new ApiError(400, "No notication id found")
    }

    const notification = await Notification.findOneAndDelete({
        user: user._id,
        _id: notificationId
    })

    if(!notification){
        throw new ApiError(500,"Error deleting notification")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, notification, "Notification deleted successfully")
    )

})

const getNotificationById = asyncHandler(async(req, res) => {
    const user = req.user;

    if(!user){
        throw new ApiError(401, "Auth middleware is broken - user not found")
    }

    const {notificationId} = req.params;

    if(!notificationId){
        throw new ApiError(400, "No notication id found")
    }

    const notification = await Notification.findOne({
        user: user._id,
        _id: notificationId
    })

    if(!notification){
        throw new ApiError(400, "notication not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, notification, "Notification fetched successfully")
    )
})

const getUnreadedNotifications = asyncHandler(async(req, res) => {

    const user = req.user;

    if(!user){
        throw new ApiError(400, "Either the auth middleware broken - user not found")
    }

    const unReadNotifications = await Notification.find({
        user: user._id,
        isRead: false
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, unReadNotifications, "Unread notifications fetched successfully")
    )
})

const getTodayNotifications = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Auth middleware broken - user not found");
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayNotifications = await Notification.find({
        user: user._id,
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, todayNotifications, "Today's notifications fetched successfully"));
});

export {
    getAllNotifications,
    markAllNotificationAsRead,
    markNotificationAsRead,
    deleteNotification,
    getNotificationById,
    getUnreadedNotifications,
    getTodayNotifications
}