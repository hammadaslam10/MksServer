const db = require("../config/Connection");
const TrackLengthModel = db.TrackLengthModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { TrackLengths, Breeder } = require("../Utils/Path");
const { Op } = require("sequelize");
const { getPagination, getPagingData1 } = require("../Utils/Pagination");
exports.GetDeletedTrackLength = Trackerror(async (req, res, next) => {
  const data = await TrackLengthModel.findAll({
    paranoid: false,
    where: {
      [Op.not]: { deletedAt: null },
    },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.RestoreSoftDeletedTrackLength = Trackerror(async (req, res, next) => {
  const data = await TrackLengthModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await TrackLengthModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});

exports.CreateTrackLength = Trackerror(async (req, res, next) => {
  const { RaceCourse, TrackLength, RailPosition, GroundType } = req.body;
  if (req.files === null) {
    try {
      const data = await TrackLengthModel.create({
        TrackLength: TrackLength,
        RaceCourse: RaceCourse,
        RailPosition: RailPosition,
        GroundType: GroundType,
      });
      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(403);
        res.send({
          status: "error",
          message: [
            "This Short Code already exists, Please enter a different one.",
          ],
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.errors.map((singleerr) => {
            return singleerr.message;
          }),
        });
      }
    }
  } else {
    const file = req.files.image;
    const Image = generateFileName();
    console.log(file);
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(
      req.files.image.data,
      `${TrackLengths}/${Image}`,
      file.mimetype
    );
    const data = await TrackLengthModel.create({
      TrackLength: TrackLength,
      RaceCourseImage: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${TrackLengths}/${Image}`,
      RaceCourse: RaceCourse,
      RailPosition: RailPosition,
      GroundType: GroundType,
    });
    res.status(201).json({
      success: true,
      data,
    });
  }
});
exports.TrackLengthGet = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  const totalcount = await TrackLengthModel.count();
  await TrackLengthModel.findAndCountAll({
    order: [["createdAt", "DESC"]],
    where: {
      TrackLength: {
        [Op.like]: `%${req.query.TrackLength || ""}%`,
      },
      // RaceCourse: {
      //   [Op.like]: `%${req.query.RaceCourse || ""}%`,
      // },
      GroundType: {
        [Op.like]: `%${req.query.GroundType || ""}%`,
      },
      createdAt: {
        [Op.between]: [
          req.query.startdate || "2021-12-01 00:00:00",
          req.query.endDate || "4030-12-01 00:00:00",
        ],
      },
    },
    include: { all: true },
    limit,
    offset,
  })
    .then((data) => {
      const response = getPagingData1(data, page, limit, totalcount);
      res.status(200).json({
        data: response.data,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalcount: response.totalcount,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving Color.",
      });
    });
});
exports.GetTrackLengthAdmin = Trackerror(async (req, res, next) => {});
exports.EditTrackLength = Trackerror(async (req, res, next) => {
  const { RaceCourse, TrackLength, RailPosition, GroundType } = req.body;

  try {
    let data = await TrackLengthModel.findOne({
      where: { _id: req.params.id },
    });
    if (data === null) {
      return next(new HandlerCallBack("data not found", 404));
    }
    if (req.files == null) {
      const updateddata = {
        RaceCourseImage: data.image,
        RaceCourse: RaceCourse || data.RaceCourse,
        TrackLength: TrackLength || data.TrackLength,
        RailPosition: RailPosition || data.RailPosition,
        GroundType: GroundType || data.GroundType,
      };
      data = await TrackLengthModel.update(updateddata, {
        where: {
          _id: req.params.id,
        },
      });
      res.status(200).json({
        success: true,
        data,
      });
    } else {
      const file = req.files.image;
      await deleteFile(`${TrackLengths}/${data.image}`);
      const Image = generateFileName();
      const fileBuffer = await resizeImageBuffer(
        req.files.image.data,
        214,
        212
      );
      await uploadFile(
        req.files.image.data,
        `${TrackLengths}/${Image}`,
        file.mimetype
      );
      const updateddata = {
        RaceCourseImage: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${TrackLengths}/${Image}`,
        RaceCourse: RaceCourse || data.RaceCourse,
        TrackLength: TrackLength || data.TrackLength,
        RailPosition: RailPosition || data.RailPosition,
        GroundType: GroundType || data.GroundType,
      };
      data = await TrackLengthModel.update(updateddata, {
        where: {
          _id: req.params.id,
        },
      });

      res.status(200).json({
        success: true,
        data,
      });
    }
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(403);
      res.json({
        status: "error",
        message: [
          "This Short Code already exists, Please enter a different one.",
        ],
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.errors.map((singleerr) => {
          return singleerr.message;
        }),
      });
    }
  }
});
exports.DeleteTrackLength = Trackerror(async (req, res, next) => {
  const data = await TrackLengthModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await TrackLengthModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteTrackLength = Trackerror(async (req, res, next) => {
  const data = await TrackLengthModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await TrackLengthModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
// uploading gif image to s3 bucket nodejs ?
