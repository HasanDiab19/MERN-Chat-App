const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
module.exports.allNotifications = asyncHandler(async (req, res) => {
  try {
    const notif = await Notification.find({
      belong: req.user._id,
    })
      .populate("belong", "name pic")
      .populate("message");
    const notifs = await Chat.populate(notif, {
      path: "message.chat",
      select: "isGroupChat users chatName",
    });
    const notifications = await User.populate(notifs, {
      path: "message.chat.users",
      select: "name",
    });
    console.log("notifications: ", notifications);
    return res.json(notifications);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports.addNotification = asyncHandler(async (req, res) => {
  const { newMessage } = req.body;
  if (!newMessage) {
    res.status(400);
    throw new Error("Please provide message to get notification");
  }
  try {
    let notification = await Notification.create({
      belong: req.user._id,
      message: newMessage,
    });
    notification = await notification.populate("belong", "name email pic");
    notification = await notification.populate("message");
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports.removeNotification = asyncHandler(async (req, res) => {
  const { notifId } = req.params;
  console.log('hii');
  try {
    await Notification.deleteOne({
      _id: notifId,
    });
    res.status(200).send("Deleted");
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
