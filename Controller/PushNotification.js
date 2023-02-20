const db = require("../config/Connection");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
// const { getMessaging } = require("fcm-node");
let admin = require("firebase-admin");
let fcm = require("fcm-notification");
let { Template } = require("../Utils/DynamicTemplate");
let serviceAccount = require("./mksracing-87bea-firebase-adminsdk-oyldy-7a7d6c1276.json");
const certPath = admin.credential.cert(serviceAccount);
let FCM = new fcm(certPath);
exports.GetSendNotification = Trackerror(async (req, res, next) => {
  sendPushNotification(
    "fvn_8K9fY727wo--nd9YBt:APA91bHCOJhed2vbcsMoorARb7aEzOkD5PddQnNJbnO1IWawffvUsjOPhB6jEHyvdMEQ4rwXIWcCRl5VBAEDmvNNOYhL9oB-QQFa1BrhkTu2cYxg-8PVBNZ2Tj3P_rPTkN73UOhUlDqQ",
    "title test",
    "body test"
  );
  res.status(200).json({
    success: true,
  });
});
sendPushNotification = (fcm_token, title, body) => {
  try {
    let message = {
      notification: {
        title: title,
        body: body,
      },

      token: fcm_token,
    };

    FCM.send(message, function (err, resp) {
      if (err) {
        throw err;
      } else {
        console.log("Successfully sent notification");
      }
    });
  } catch (err) {
    throw err;
  }
};
const schedule = require("node-schedule");
exports.TemplateChanging = Trackerror(async (req, res, next) => {
  const { email } = req.body;
  // const date = new Date(Date.UTC(2023, 2, 2, 5, 56, 0));
  const startTime = new Date("2023-02-20 19:03");
  console.log(startTime);
  const endTime = new Date(startTime.getTime() + 50000);

  // const endTime = new Date(startTime.getTime() + 5000);
  schedule.scheduleJob(
    { start: startTime, end: endTime, rule: "*/1 * * * * *" },
    function () {
      console.log("Time for tea!");
    }
  );
  console.log(startTime.getHours());
  // const emaildata = await db.EmailTemplateModel.findOne({
  //   where: {
  //     TemplateName: "SignUp",
  //   },
  // });
  // let c = email;
  // let d = emaildata.Html.replaceAll(`[user]`, c);
  // let a = Template(emaildata.Html, c);
  // // console.log(email);
  // // console.log(totalcount);
  // // console.log(data[0]._id);
  res.status(200).json({
    email,
    startTime,
    // a,
    // d,
  });
});
// const { email } = req.body;
//   const { count: totalcount, rows: data } =
//     await db.EmailTemplateModel.findAndCountAll({
//       where: {
//         TemplateName: "SignUp",
//       },
//     });
//   // let a = Template();
//   console.log(email);
//   console.log(totalcount);
//   console.log(data[0]._id);
//   res.status(200).json({
//     email,
//     data,
//   });
