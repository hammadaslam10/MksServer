const app = require("./app");
const Db = require("./config/Connection");
// const { Server } = require(".io");
const { AdsGet } = require("./Controller/AdvertismentController");
const db = require("./config/Connection");
const schedule = require("node-schedule");
const AdvertismentModel = db.AdvertismentModel;
const Trackerror = require("./Middleware/TrackError");
process.on("uncaughtException", (err) => {
  console.log(`Error ${err.message}`);
  console.log(`Shutting down the server due to unhandled exception`);
  process.exit(1);
});
async () => {
  try {
    await Db.authenticate();
    console.log(Db);
    console.log("done");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./config/Secrets.env" });
}

const server = app.listen(process.env.PORT || 8081, () => {
  console.log(`Server is working on port http:localhost:${process.env.PORT}`);
  // const A = new Date(
  //   "Mon Feb 27 2023 20:14:48 GMT+0500 (Pakistan Standard Time)"
  // );
  // const b = new Date();
  // console.log(b.getTime(), b);
  // console.log(Date.now(), "now");
  // console.log(A.toISOString(), "a");
  // console.log(A.toUTCString(), "a");
  // const startTime = new Date(Date.now() + 5000);
  // const endTime = new Date(startTime.getTime() + 5000);
  // const job = schedule.scheduleJob("abc", startTime, function () {
  //   console.log("Time for tea!");
  // });
  // console.log(schedule.scheduledJobs.abc.cancel());
  });
// const io = new Server(server);
// io.on("connection", (socket) => {
//   console.log("hello socket");
//   socket.on(
//     "Ads",
//     Trackerror(async (req, res, next) => {
//       const data = await AdvertismentModel.findAll();
//       socket.emit("Ads", data);
//       console.log("done");
//     })
//   );
// });
process.on("unhandledRejection", (err) => {
  console.log(`Error ${err.message}`);
  console.log(`Shutting down the server due to Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
