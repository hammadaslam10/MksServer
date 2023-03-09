const db = require("../config/Connection");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const TrainerModel = db.TrainerModel;
const HorseAndRaceModel = db.HorseAndRaceModel;
const HorseModel = db.HorseModel;
const OwnerModel = db.OwnerModel;
const JockeyModel = db.JockeyModel;
const NationalityModel = db.NationalityModel;
const HorseKindModel = db.HorseKindModel;
const BreederModel = db.BreederModel;
const ColorModel = db.ColorModel;
const SexModel = db.SexModel;
const Features = require("../Utils/Features");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const HorseJockeyComboModel = db.HorseJockeyComboModel;
const HorseOwnerComboModel = db.HorseOwnerComboModel;
const HorseTrainerComboModel = db.HorseTrainerComboModel;
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { Horse } = require("../Utils/Path");
const { Conversion } = require("../Utils/Conversion");
const { Op, Sequelize } = require("sequelize");
const RaceModel = db.RaceModel;
const { getPagination, getPagingData1 } = require("../Utils/Pagination");
function difference(arr1, arr2) {
  var a1 = flatten(arr1, true);
  var a2 = flatten(arr2, true);

  var a = [],
    diff = [];
  for (var i = 0; i < a1.length; i++) a[a1[i]] = false;
  for (i = 0; i < a2.length; i++)
    if (a[a2[i]] === true) {
      delete a[a2[i]];
    } else a[a2[i]] = true;
  for (var k in a) diff.push(k);
  return diff;
}

var flatten = function (a, shallow, r) {
  if (!r) {
    r = [];
  }
  if (shallow) {
    return r.concat.apply(r, a);
  }
  for (i = 0; i < a.length; i++) {
    if (a[i].constructor == Array) {
      flatten(a[i], shallow, r);
    } else {
      r.push(a[i]);
    }
  }
  return r;
};
function exchangefunctionv2(arraytobechecked, valuetobechecked, val) {
  let a = arraytobechecked.find(
    (item) => item.NameEn.toLowerCase() == valuetobechecked.toLowerCase()
  );
  // console.log(a, valuetobechecked, val);
  return a.id;
}
function exchangefunctionv3(arraytobechecked, valuetobechecked, val) {
  let a = arraytobechecked.find((item) => item.Code == valuetobechecked);
  // console.log(a, valuetobechecked, val);
  return a.id;
}

function CheckAge(a, b) {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  let day = now.getDay();
  let dateofbirth = year - (a, b);
  let value = dateofbirth + "-" + month + "-" + day;
  return value;
  // console.log(dateofbirth + "-" + month + "-" + day, "dateofbirth");
}
function EnglishLanguageVerification(Name) {
  if (Name.trim() == "") {
    return true;
  }
  if (
    /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(Name) ||
    /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(Name)
  ) {
    return false;
  } else {
    return true;
  }
}
// function ArabicLanguageVerification(Name) {
//   if (this.Name.trim() == "") {
//     throw new Error("Please Enter  Remarks in  Arabic ");
//   }
//   if (
//     /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
//       this.Name
//     ) ||
//     /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
//       this.Name
//     )
//   ) {
//   } else {
//     throw new Error("Remarks Arabic Validation Failed");
//   }
// }

exports.HorseMassUploadV2 = Trackerror(async (req, res, next) => {
  let century = 20;

  if (!req.files || !req.files.file) {
    res.status(404).json({ message: "File not found" });
  } else if (req.files.file.mimetype === "application/json") {
    let errorstatements = [];
    let recordswhicharenotgetentered = [];
    let de = JSON.parse(req.files.file.data.toString("utf8"));
    for (let i = 0; i < de.length; i++) {
      if (de[i].shortCode == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing shortcode `,
          recordetail: de[i],
        });
      }
      if (EnglishLanguageVerification(de[i].Name)) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is not validating horsename `,
          recordetail: de[i],
        });
      }
      if (EnglishLanguageVerification(de[i].Dam)) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is not validating Dam `,
          recordetail: de[i],
        });
      }
      if (EnglishLanguageVerification(de[i].Sire)) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is not validating horseSire `,
          recordetail: de[i],
        });
      }
      if (EnglishLanguageVerification(de[i].GSIRE)) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is not validating horseGSIRE `,
          recordetail: de[i],
        });
      }
      if (EnglishLanguageVerification(de[i].ActiveOwner)) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is not validating ActiveOwner `,
          recordetail: de[i],
        });
      }
      if (EnglishLanguageVerification(de[i].Breeder)) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is not validating Breeder `,
          recordetail: de[i],
        });
      }
      if (EnglishLanguageVerification(de[i].ActiveTrainer)) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is not validating ActiveTrainer `,
          recordetail: de[i],
        });
      }
      if (de[i].Age == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing Age `,
          recordetail: de[i],
        });
      }
      //   recordswhicharenotgetentered.push(de[i], Error);
      if (de[i].Foal == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          messFoal: `RecordNo ${i + 1} is missing Foal `,
          recordetail: de[i],
        });
      }
      if (de[i].Name == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing Name `,
          recordetail: de[i],
        });
      }
      if (de[i].Color == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing Color `,
          recordetail: de[i],
        });
      }
      if (de[i].Gender == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing Gender `,
          recordetail: de[i],
        });
      }
      if (de[i].Dam == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing Dam `,
          recordetail: de[i],
        });
      }
      if (de[i].Sire == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing Sire `,
          recordetail: de[i],
        });
      }
      if (de[i].GSIRE == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing GSIRE `,
          recordetail: de[i],
        });
      }
      if (de[i].OwnerShortCode == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing OwnerShortCode `,
          recordetail: de[i],
        });
      }
      if (de[i].ActiveOwner == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing ActiveOwner `,
          recordetail: de[i],
        });
      }
      if (de[i].Breeder == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing Breeder `,
          recordetail: de[i],
        });
      }
      if (de[i].TrainerCode == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing TrainerCode `,
          recordetail: de[i],
        });
      }
      if (de[i].ActiveTrainer == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing ActiveTrainer `,
          recordetail: de[i],
        });
      }
      if (de[i].HorseKind == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing HorseKind `,
          recordetail: de[i],
        });
      }
      if (de[i].Gelded == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing Gelded `,
          recordetail: de[i],
        });
      }
      if (de[i].Rds == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing Rds `,
          recordetail: de[i],
        });
      }
      if (de[i].PurchasePrice == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing PurchasePrice number`,
          recordetail: de[i],
        });
      }
      if (de[i].Nationality == undefined) {
        errorstatements.push({
          recordnumber: i + 1,
          message: `RecordNo ${i + 1} is missing Nationality `,
          recordetail: de[i],
        });
      }
    }

    if (errorstatements.length === 0) {
      let Nationality = Array.from(new Set(de.map((item) => item.Nationality)));
      let Color = Array.from(new Set(de.map((item) => item.Color)));
      let Gender = Array.from(new Set(de.map((item) => item.Gender)));
      let Breeder = Array.from(new Set(de.map((item) => item.Breeder)));
      console.log(Color);
      let ActiveTrainer = Array.from(
        new Set(de.map((item) => item.TrainerCode))
      );
      let ActiveOwner = Array.from(
        new Set(de.map((item) => item.OwnerShortCode))
      );
      let AllTrainer = [];
      let AllOwner = [];
      de.map((item) => {
        AllOwner.push({
          ActiveOwner: item.ActiveOwner,
          Code: item.OwnerShortCode,
        });
      });
      de.map((item) => {
        AllTrainer.push({
          ActiveTrainer: item.ActiveTrainer,
          Code: item.TrainerCode,
        });
      });
      let HorseKind = Array.from(new Set(de.map((item) => item.HorseKind)));
      console.log(HorseKind);
      let NationalityData = [];
      let ColorData = [];
      let GenderData = [];
      let BreederData = [];
      let ActiveTrainerData = [];
      let ActiveOwnerData = [];
      let HorseKindData = [];
      let HorseData = [];

      const filteredOwner = [
        ...new Set(AllOwner.map((a) => JSON.stringify(a))),
      ].map((a) => JSON.parse(a));
      console.log(filteredOwner);
      const filteredTrainer = [
        ...new Set(AllTrainer.map((a) => JSON.stringify(a))),
      ].map((a) => JSON.parse(a));
      console.log(filteredTrainer);
      const [defaultnatioanlityrow, created] =
        await db.NationalityModel.findOrCreate({
          where: { NameEn: "UAE" },
          defaults: {
            NameEn: "UAE",
            NameAr: "UAE",
            AbbrevEn: "UAE",
            AbbrevAr: "UAE",
            AltNameEn: "UAE",
            AltNameAr: "UAE",
            BackupId: 4777777,
          },
          attributes: ["_id", "NameEn"],
        });
      NationalityData.push({
        id: defaultnatioanlityrow.dataValues._id,
        NameEn: defaultnatioanlityrow.dataValues.NameEn,
        created: created,
      });
      for (let i = 0; i < Nationality.length; i++) {
        // try {
        const [row, created] = await db.NationalityModel.findOrCreate({
          where: { AbbrevEn: Nationality[i] },
          defaults: {
            NameEn: Nationality[i],
            NameAr: Nationality[i],
            AbbrevEn: Nationality[i],
            AbbrevAr: Nationality[i],
            AltNameEn: Nationality[i],
            AltNameAr: Nationality[i],
            BackupId: 4777777,
          },
          attributes: ["_id", "AbbrevEn"],
        });
        console.log(NationalityData[i]);
        NationalityData.push({
          id: row.dataValues._id,
          NameEn: row.dataValues.AbbrevEn,
          createdS: created,
        });
        // } catch (Error) {
        // }
      }
      // console.log("horsekind");
      for (let i = 0; i < HorseKind.length; i++) {
        const [row, created] = await db.HorseKindModel.findOrCreate({
          where: { AbbrevEn: HorseKind[i] },
          defaults: {
            NameEn: HorseKind[i],
            NameAr: HorseKind[i],
            AbbrevEn: HorseKind[i],
            AbbrevAr: HorseKind[i],
            BackupId: 4777777,
          },
          attributes: ["_id", "AbbrevEn"],
        });
        HorseKindData.push({
          id: row.dataValues._id,
          NameEn: row.dataValues.AbbrevEn,
          created: created,
        });
      }
      // console.log(HorseKindData);
      for (let i = 0; i < Color.length; i++) {
        const [row, created] = await db.ColorModel.findOrCreate({
          where: { AbbrevEn: Color[i] },
          defaults: {
            NameEn: Color[i],
            NameAr: Color[i],
            AbbrevEn: Color[i],
            AbbrevAr: Color[i],
            BackupId: 4777777,
          },
          attributes: ["_id", "AbbrevEn"],
        });
        // recordswhicharenotgetentered.push(de[i], Error);

        ColorData.push({
          id: row.dataValues._id,
          NameEn: row.dataValues.AbbrevEn,
          created: created,
        });
      }

      for (let i = 0; i < Gender.length; i++) {
        const [row, created] = await db.SexModel.findOrCreate({
          where: { AbbrevEn: Gender[i] },
          defaults: {
            NameEn: Gender[i],
            NameAr: Gender[i],
            AbbrevEn: Gender[i],
            AbbrevAr: Gender[i],
            BackupId: 4777777,
          },
          attributes: ["_id", "AbbrevEn"],
        });

        GenderData.push({
          id: row.dataValues._id,
          NameEn: row.dataValues.AbbrevEn,
          created: created,
        });
      }

      for (let i = 0; i < Breeder.length; i++) {
        const [row, created] = await db.BreederModel.findOrCreate({
          where: { NameEn: Breeder[i] },
          defaults: {
            NameEn: Breeder[i],
            NameAr: Breeder[i],
            DescriptionEn: Breeder[i],
            DescriptionAr: Breeder[i],
            BackupId: 4777777,
          },
          attributes: ["_id", "NameEn"],
        });

        BreederData.push({
          id: row.dataValues._id,
          NameEn: row.dataValues.NameEn,
          created: created,
        });
      }

      for (let i = 0; i < filteredTrainer.length; i++) {
        const [row, created] = await db.TrainerModel.findOrCreate({
          where: { shortCode: filteredTrainer[i].Code },
          defaults: {
            NameEn: filteredTrainer[i].ActiveTrainer,
            NameAr: filteredTrainer[i].ActiveTrainer,
            TitleEn: filteredTrainer[i].ActiveTrainer,
            TitleAr: filteredTrainer[i].ActiveTrainer,
            shortCode: filteredTrainer[i].Code,
            ShortNameEn: filteredTrainer[i].ActiveTrainer,
            ShortNameAr: filteredTrainer[i].ActiveTrainer,
            DetailAr: filteredTrainer[i].ActiveTrainer,
            DetailEn: filteredTrainer[i].ActiveTrainer,
            RemarksEn: filteredTrainer[i].ActiveTrainer,
            RemarksAr: filteredTrainer[i].ActiveTrainer,
            NationalityID: defaultnatioanlityrow.dataValues._id,
            DOB: Date.now(),
            TrainerLicenseDate: Date.now(),
            BackupId: 4777777,
          },
          attributes: ["_id", "shortCode"],
        });
        ActiveTrainerData.push({
          id: row.dataValues._id,
          Code: row.dataValues.shortCode,
          created: created,
        });
      }

      console.log(ActiveTrainerData);
      for (let i = 0; i < filteredOwner.length; i++) {
        const [row, created] = await db.OwnerModel.findOrCreate({
          where: { shortCode: filteredOwner[i].Code },
          defaults: {
            NameEn: filteredOwner[i].ActiveOwner,
            NameAr: filteredOwner[i].ActiveOwner,
            TitleEn: filteredOwner[i].ActiveOwner,
            TitleAr: filteredOwner[i].ActiveOwner,
            shortCode: filteredOwner[i].Code,
            // ShortNameEn: filteredOwner[i].ActiveOwner,
            // ShortNameAr: filteredOwner[i].ActiveOwner,
            ShortAr: filteredOwner[i].ActiveOwner,
            ShortEn: filteredOwner[i].ActiveOwner,
            RemarksEn: filteredOwner[i].ActiveOwner,
            RemarksAr: filteredOwner[i].ActiveOwner,
            NationalityID: defaultnatioanlityrow.dataValues._id,
            RegistrationDate: Date.now(),
            BackupId: 4777777,
          },
          attributes: ["_id", "shortCode"],
        });

        ActiveOwnerData.push({
          id: row.dataValues._id,
          Code: row.dataValues.shortCode,
          created: created,
        });
      }
      console.log(ActiveOwnerData, "As");
      let nationtemp;
      let colortemp;
      let breedertemp;
      let horsekindtemp;
      let sextemp;
      let trainertemp;
      let ownertemp;
      for (let i = 0; i < de.length; i++) {
        nationtemp = exchangefunctionv2(
          NationalityData,
          de[i].Nationality,
          "nat"
        );
        colortemp = exchangefunctionv2(ColorData, de[i].Color, "col");
        breedertemp = exchangefunctionv2(BreederData, de[i].Breeder, "bred");
        horsekindtemp = exchangefunctionv2(
          HorseKindData,
          de[i].HorseKind,
          "horsekind"
        );
        sextemp = exchangefunctionv2(GenderData, de[i].Gender, "sex");
        trainertemp = exchangefunctionv3(
          ActiveTrainerData,
          de[i].TrainerCode,
          "trainer"
        );
        ownertemp = exchangefunctionv3(
          ActiveOwnerData,
          de[i].OwnerShortCode,
          "owner"
        );
        console.log(horsekindtemp);
        try {
          const [row, created] = await db.HorseModel.findOrCreate({
            where: { shortCode: de[i].shortCode },
            defaults: {
              NameEn: de[i].Name,
              NameAr: de[i].Name,
              SireNameEn: de[i].Sire || "N/A",
              SireNameAr: de[i].Sire || "N/A",
              GSireNameEn: de[i].GSIRE || "N/A",
              GSireNameAr: de[i].GSIRE || "N/A",
              DamNameEn: de[i].Dam || "N/A",
              DamNameAr: de[i].Dam || "N/A",
              DOB: CheckAge(century, de[i].Age),
              ActiveTrainer: trainertemp,
              Breeder: breedertemp,
              RemarksEn: de[i].RemarksEn || "N/A",
              Sex: sextemp,
              Color: colortemp,
              Earning: de[i].Earning || 0,
              STARS: de[i].STARS || 0,
              ActiveOwner: ownertemp,
              NationalityID: nationtemp,
              Foal: de[i].Foal || 1,
              PurchasePrice: de[i].PurchasePrice,
              Rds: de[i].Rds,
              ColorID: colortemp,
              CreationId: nationtemp,
              HorseStatus: de[i].HorseStatus,
              // Dam: de[i].Dam || null,
              // Sire: de[i].Sire || null,
              // GSire: de[i].GSire || null,
              Height: de[i].Height || 0,
              KindHorse: horsekindtemp,
              shortCode: de[i].shortCode,
              RemarksAr: de[i].RemarksAr || "N/A",
              BackupId: 4777777,
            },
          });

          HorseData.push({
            id: row.dataValues._id,
            NameEn: row.dataValues.NameEn,
            created: created,
          });
        } catch (Error) {}
      }
      res.status(200).json({
        success: true,
        HorseData: HorseData,
        NationalityData,
        GenderData,
        ActiveTrainerData,
        ColorData,
        BreederData,
        ActiveOwnerData,
        recordswhicharenotgetentered,
      });
      res.end();
    } else {
      res.status(200).json({
        success: false,
        message: errorstatements,
        recordswhicharenotgetentered,
      });
      res.end();
    }
  } else {
  }
});
exports.VerifyShortCode = Trackerror(async (req, res, next) => {
  const { shortCode } = req.body;
  const data = await db.HorseModel.findOne({
    where: {
      shortCode: shortCode,
    },
    attributes: ["_id", "NameEn", "NameAr"],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.SearchHorsesAccordingToRaceKind = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  if (req.params.HorseKind.length == 0) {
    return next(new HandlerCallBack("No HorseKind Has Been Given", 404));
  }
  let totalcount = await HorseModel.count();
  await HorseModel.findAndCountAll({
    order: [["createdAt", "DESC"]],
    attributes: ["_id", "NameEn", "NameAr"],
    include: [
      {
        model: db.NationalityModel,
        as: "NationalityData",
        attributes: ["_id", "NameEn", "NameAr"],
      },
    ],
    where: {
      KindHorse: req.params.HorseKind,
      Breeder: {
        [Op.like]: `%${req.query.Breeder || ""}%`,
      },
      Sex: {
        [Op.like]: `%${req.query.Sex || ""}%`,
      },
      ActiveOwner: {
        [Op.like]: `%${req.query.ActiveOwner || ""}%`,
      },
      ActiveTrainer: {
        [Op.like]: `%${req.query.ActiveTrainer || ""}%`,
      },
      NationalityID: {
        [Op.like]: `%${req.query.NationalityID || ""}%`,
      },
      CreationId: {
        [Op.like]: `%${req.query.CreationId || ""}%`,
      },
      Foal: {
        [Op.like]: `%${req.query.Foal || ""}%`,
      },
      RemarksEn: {
        [Op.like]: `%${req.query.RemarksEn || ""}%`,
      },
      RemarksAr: {
        [Op.like]: `%${req.query.RemarksAr || ""}%`,
      },
      NameEn: {
        [Op.like]: `%${req.query.NameEn || ""}%`,
      },
      NameAr: {
        [Op.like]: `%${req.query.NameAr || ""}%`,
      },

      createdAt: {
        [Op.between]: [
          req.query.startdate || "2021-12-01 00:00:00",
          req.query.endDate || "4030-12-01 00:00:00",
        ],
      },

      ColorID: {
        [Op.like]: `%${req.query.ColorID || ""}%`,
      },
    },
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
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
});
exports.SearchHorse = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  let totalcount = await HorseModel.count();
  await HorseModel.findAndCountAll({
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: db.SexModel,
        as: "SexModelData",
        attributes: ["_id", "NameEn", "NameAr"],
      },
      {
        model: db.HorseKindModel,
        as: "KindHorseData",
        attributes: ["_id", "NameEn", "NameAr"],
      },
      {
        model: db.ColorModel,
        as: "ColorIDData",
        attributes: ["_id", "NameEn", "NameAr"],
      },
      {
        model: db.BreederModel,
        as: "BreederData",
        attributes: ["_id", "NameEn", "NameAr"],
      },
      {
        model: db.NationalityModel,
        as: "NationalityData",
        attributes: ["_id", "NameEn", "NameAr"],
      },
      {
        model: db.TrainerModel,
        as: "ActiveTrainerData",
        attributes: ["_id", "NameEn", "NameAr"],
      },
      {
        model: db.TrainerModel,
        as: "ActiveTrainerData",
        attributes: ["_id", "NameEn", "NameAr"],
      },
      {
        model: db.HorseModel,
        as: "DamData",
        attributes: ["_id", "NameEn", "NameAr"],
      },
      {
        model: db.HorseModel,
        as: "SireData",
        attributes: ["_id", "NameEn", "NameAr"],
      },
      {
        model: db.HorseModel,
        as: "GSireData",
        attributes: ["_id", "NameEn", "NameAr"],
      },
      {
        model: db.OwnerModel,
        as: "ActiveOwnerData",
        attributes: ["_id", "NameEn", "NameAr"],
      },
    ],
    attributes: [
      "NameEn",
      "NameAr",
      "_id",
      "DOB",
      "PurchasePrice",
      "RemarksEn",
      "RemarksAr",
      "Rds",
      "Foal",
      "HorseStatus",
      "HorseImage",
      "shortCode",
    ],
    where: {
      KindHorse: {
        [Op.like]: `%${req.query.KindHorse || ""}%`,
      },
      Breeder: {
        [Op.like]: `%${req.query.Breeder || ""}%`,
      },
      Sex: {
        [Op.like]: `%${req.query.Sex || ""}%`,
      },
      ActiveOwner: {
        [Op.like]: `%${req.query.ActiveOwner || ""}%`,
      },
      ActiveTrainer: {
        [Op.like]: `%${req.query.ActiveTrainer || ""}%`,
      },
      NationalityID: {
        [Op.like]: `%${req.query.NationalityID || ""}%`,
      },
      CreationId: {
        [Op.like]: `%${req.query.CreationId || ""}%`,
      },
      Foal: {
        [Op.like]: `%${req.query.Foal || ""}%`,
      },
      RemarksEn: {
        [Op.like]: `%${req.query.RemarksEn || ""}%`,
      },
      RemarksAr: {
        [Op.like]: `%${req.query.RemarksAr || ""}%`,
      },
      NameEn: {
        [Op.like]: `%${req.query.NameEn || ""}%`,
      },
      NameAr: {
        [Op.like]: `%${req.query.NameAr || ""}%`,
      },

      createdAt: {
        [Op.between]: [
          req.query.startdate || "2021-12-01 00:00:00",
          req.query.endDate || "4030-12-01 00:00:00",
        ],
      },

      ColorID: {
        [Op.like]: `%${req.query.ColorID || ""}%`,
      },
    },
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
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
});
exports.RaceHorse = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  const racedata = await RaceModel.findOne({
    where: {
      _id: req.params.raceid,
    },
  });
  if (!req.params.raceid) {
    return next(new HandlerCallBack("No Race id Available in param", 404));
  }
  let totalcount = await HorseModel.count();
  await HorseModel.findAndCountAll({
    include: [
      {
        model: db.OwnerModel,
        as: "ActiveOwnerData",
        include: [
          {
            model: db.OwnerSilkColorModel,
            as: "OwnerIDData",
          },
        ],
      },
    ],
    attributes: ["NameEn", "NameAr", "_id", "ActiveOwner", "STARS"],
    where: {
      KindHorse: {
        [Op.eq]: racedata.HorseKindinRace,
      },
      NameEn: {
        [Op.like]: `%${req.query.NameEn || ""}%`,
      },
      NameAr: {
        [Op.like]: `%${req.query.NameAr || ""}%`,
      },
      shortCode: {
        [Op.like]: `${req.query.shortCode || "%%"}`,
      },
    },
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
exports.HorsesInRace = Trackerror(async (req, res, next) => {
  // HorseModelIdData1
  const data = await HorseAndRaceModel.findAll({
    include: [
      {
        model: db.HorseModel,
        as: "HorseModelIdData1",
        attributes: [
          "_id",
          "HorseImage",
          "KindHorse",
          "NameEn",
          "NameAr",
          "STARS",
        ],
      },
      // {
      //   model: db.JockeyModel,
      //   as: "HorseModelIdData1",
      //   attributes: ["_id", "HorseImage", "KindHorse", "NameEn", "NameAr"],
      // },
      // {
      //   model: db.TrainerModel,
      //   as: "HorseModelIdData1",
      //   attributes: ["_id", "HorseImage", "KindHorse", "NameEn", "NameAr"],
      // },
      // {
      //   model: db.EquipmentModel,
      //   as: "HorseModelIdData1",
      //   attributes: ["_id", "HorseImage", "KindHorse", "NameEn", "NameAr"],
      // },
    ],
    attributes: ["_id", "TrainerOnRace", "JockeyOnRace", "HorseNo"],
    where: {
      RaceModelId: {
        [Op.eq]: req.params.raceid,
      },
    },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetDeletedHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findAll({
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
exports.RestoreSoftDeletedHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  let checkcode = await HorseModel.findOne({
    paranoid: false,
    where: { shortCode: -1 * data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    let [result] = await HorseModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-1 * (result.dataValues.maxshortCode + 1));
    let newcode = result.dataValues.maxshortCode + 1;
    console.log(newcode, "dsd");
    await HorseModel.update(
      { shortCode: newcode },
      {
        where: {
          _id: req.params.id,
        },
        paranoid: false,
      }
    );
    const restoredata = await HorseModel.restore({
      where: { _id: req.params.id },
    });

    res.status(200).json({
      success: true,
      restoredata,
    });
  } else {
    console.log("done else");
    let newcode = -1 * (data.shortCode + 1);
    console.log(newcode);
    console.log(newcode);
    try {
      await HorseModel.update(
        { shortCode: newcode },
        {
          where: {
            _id: req.params.id,
          },
          paranoid: false,
        }
      );
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
      } else {
        res.status(500).json({
          success: false,
          message: error,
        });
      }
    }

    const restoredata = await HorseModel.restore({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      restoredata,
    });
  }
});

exports.SearchName = Trackerror(async (req, res, next) => {
  const { Query } = req.body;
  console.log(Query);
  const data1 = await HorseModel.findAll({
    limit: 20,
    where: {
      NameEn: {
        [Op.like]: `%${Query}%`,
      },
    },
    include: { all: true },
  });
  const data2 = await TrainerModel.findAll({
    limit: 20,
    where: {
      NameEn: {
        [Op.like]: `%${Query}%`,
      },
    },
    include: { all: true },
  });
  const data3 = await OwnerModel.findAll({
    limit: 20,
    where: {
      NameEn: {
        [Op.like]: `%${Query}%`,
      },
    },
    include: { all: true },
  });
  const data4 = await JockeyModel.findAll({
    limit: 20,
    where: {
      NameEn: {
        [Op.like]: `%${Query}%`,
      },
    },
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data1,
    data2,
    data3,
    data4,
  });
});
exports.HorseDropDown = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findAll({
    offset: Number(req.query.page) - 1 || 0,
    limit: Number(req.query.limit) || 10,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: db.NationalityModel,
        as: "NationalityData",
        attributes: ["NameEn", "NameAr", "_id"],
      },
    ],
    attributes: ["NameEn", "NameAr", "_id"],
    where: {
      NameEn: {
        [Op.like]: `%${req.query.NameEn || ""}%`,
      },
      NameAr: {
        [Op.like]: `%${req.query.NameAr || ""}%`,
      },
      shortCode: {
        [Op.like]: `${req.query.shortCode || "%%"}`,
      },
    },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
function exchangefunction(arraytobechecked, valuetobechecked, val) {
  let a = arraytobechecked.find((item) => item.BackupId == valuetobechecked);
  return a._id;
}
exports.HorseMassUpload = Trackerror(async (req, res, next) => {
  if (!req.files || !req.files.file) {
    res.status(404).json({ message: "File not found" });
  } else if (req.files.file.mimetype === "application/json") {
    let de = JSON.parse(req.files.file.data.toString("utf8"));
    let ShortCodeValidation = [];
    await de.map((data) => {
      ShortCodeValidation.push(data.shortCode);
    });
    const Duplicates = await HorseModel.findAll({
      where: {
        shortCode: ShortCodeValidation,
      },
    });
    if (Duplicates.length >= 1) {
      res.status(215).json({
        success: false,
        Notify: "Duplication Error",
        message: {
          ErrorName: "Duplication Error",
          list: Duplicates.map((singledup) => {
            return {
              id: singledup.BackupId,
              shortCode: singledup.shortCode,
              NameEn: singledup.NameEn,
              NameAr: singledup.NameAr,
            };
          }),
        },
      });
      res.end();
    } else {
      let tempnationality;
      let temphorsekind;
      let temptrainer;
      let tempsex;
      let tempowner;
      let tempbreeder;
      let tempcolor;
      let original = [];
      let data;

      let nationalforeignkeys = Array.from(
        new Set(de.map((item) => item.NationalityID))
      );

      let horsekindforeignkeys = Array.from(
        new Set(de.map((item) => item.KindHorse))
      );

      let trainerforeignkeys = Array.from(
        new Set(de.map((item) => item.ActiveTrainer))
      );
      let breederforeignkeys = Array.from(
        new Set(de.map((item) => item.Breeder))
      );
      let sexforeignkeys = Array.from(new Set(de.map((item) => item.Sex)));
      let ownerforeignkeys = Array.from(
        new Set(de.map((item) => item.ActiveOwner))
      );
      let colorforeignkeys = Array.from(
        new Set(de.map((item) => item.ColorID))
      );

      const index = nationalforeignkeys.indexOf(undefined);
      if (index > -1) {
        nationalforeignkeys.splice(index, 1);
      }

      tempnationality = await NationalityModel.findAll({
        where: { BackupId: nationalforeignkeys },
        attributes: ["_id", "BackupId"],
      });
      temphorsekind = await HorseKindModel.findAll({
        where: { BackupId: horsekindforeignkeys },
        attributes: ["_id", "BackupId"],
      });
      temptrainer = await TrainerModel.findAll({
        where: { BackupId: trainerforeignkeys },
        attributes: ["_id", "BackupId"],
      });
      tempowner = await OwnerModel.findAll({
        where: { BackupId: ownerforeignkeys },
        attributes: ["_id", "BackupId"],
      });
      tempsex = await SexModel.findAll({
        where: { BackupId: sexforeignkeys },
        attributes: ["_id", "BackupId"],
      });
      tempbreeder = await BreederModel.findAll({
        where: { BackupId: breederforeignkeys },
        attributes: ["_id", "BackupId"],
      });
      tempcolor = await ColorModel.findAll({
        where: { BackupId: colorforeignkeys },
        attributes: ["_id", "BackupId"],
      });
      // tempcreation = await NationalityModel.findAll({
      //   where: { BackupId: creationforeignkeys },
      //   attributes: ["_id", "BackupId"]
      // });

      nationalforeignkeys = [];
      // creationforeignkeys = [];
      horsekindforeignkeys = [];
      breederforeignkeys = [];
      sexforeignkeys = [];
      trainerforeignkeys = [];
      ownerforeignkeys = [];
      colorforeignkeys = [];

      tempnationality.map((newdata) => {
        console.log(newdata, "nationality");
        nationalforeignkeys.push({
          _id: newdata._id,
          BackupId: newdata.BackupId,
        });
      });

      // tempcreation.map((newdata) => {
      //   creationforeignkeys.push({
      //     _id: newdata._id,
      //     BackupId: newdata.BackupId
      //   });
      // });
      temphorsekind.map((newdata) => {
        console.log(newdata, "horsekind");
        horsekindforeignkeys.push({
          _id: newdata._id,
          BackupId: newdata.BackupId,
        });
      });

      tempbreeder.map((newdata) => {
        breederforeignkeys.push({
          _id: newdata._id,
          BackupId: newdata.BackupId,
        });
      });

      tempowner.map((newdata) => {
        ownerforeignkeys.push({
          _id: newdata._id,
          BackupId: newdata.BackupId,
        });
      });

      tempcolor.map((newdata) => {
        colorforeignkeys.push({
          _id: newdata._id,
          BackupId: newdata.BackupId,
        });
      });

      tempsex.map((newdata) => {
        sexforeignkeys.push({
          _id: newdata._id,
          BackupId: newdata.BackupId,
        });
      });

      temptrainer.map((newdata) => {
        trainerforeignkeys.push({
          _id: newdata._id,
          BackupId: newdata.BackupId,
        });
      });

      let nationtemp;
      let colortemp;
      let breedertemp;
      let horsekindtemp;
      let sextemp;
      let trainertemp;
      let ownertemp;
      // let creationtemp;
      for (let i = 0; i < de.length; i++) {
        nationtemp = exchangefunction(
          nationalforeignkeys,
          de[i].NationalityID || 232,
          "nat"
        );
        colortemp = exchangefunction(colorforeignkeys, de[i].ColorID, "col");
        breedertemp = exchangefunction(
          breederforeignkeys,
          de[i].Breeder,
          "bred"
        );
        horsekindtemp = exchangefunction(
          horsekindforeignkeys,
          de[i].KindHorse,
          "horsekind"
        );
        sextemp = exchangefunction(sexforeignkeys, de[i].Sex, "sex");
        trainertemp = exchangefunction(
          trainerforeignkeys,
          de[i].ActiveTrainer,
          "trainer"
        );
        ownertemp = exchangefunction(
          ownerforeignkeys,
          de[i].ActiveOwner,
          "owner"
        );
        // creationtemp = exchangefunction(creationforeignkeys, de[i].CreationId);
        // console.log(nationtemp);

        original.push({
          NameEn: de[i].NameEn,
          NameAr: de[i].NameAr,
          SireNameEn: de[i].SireNameEn || "N/A",
          SireNameAr: de[i].SireNameAr || "N/A",
          GSireNameEn: de[i].GSireNameEn || "N/A",
          GSireNameAr: de[i].GSireNameAr || "N/A",
          DamNameEn: de[i].DamNameEn || "N/A",
          DamNameAr: de[i].DamNameAr || "N/A",
          DOB: "2011-02-02",
          ActiveTrainer: trainertemp,
          Breeder: breedertemp,
          RemarksEn: de[i].RemarksEn || "N/A",
          Sex: sextemp,
          Color: colortemp,
          Earning: de[i].Earning || 0,
          STARS: de[i].STARS,
          ActiveOwner: ownertemp,
          NationalityID: nationtemp,
          Foal: de[i].Foal || 1,
          PurchasePrice: 1,
          Cap: de[i].Cap,
          Rds: de[i].Rds,
          ColorID: colortemp,
          CreationId: nationtemp,
          HorseStatus: de[i].HorseStatus,
          Dam: de[i].Dam || null,
          Sire: de[i].Sire || null,
          GSire: de[i].GSire || null,
          Height: de[i].Height || 0,
          KindHorse: horsekindtemp,
          shortCode: de[i].shortCode || null,
          RemarksAr: de[i].RemarksAr || "N/A",
          BackupId: de[i].id,
        });
      }
      console.log(original);
      // var sources = _.map(req.body.discoverySource, function (source) {
      //   return {
      //     discoverySource: source,
      //     organizationId: req.body.organizationId
      //   };
      // });
      try {
        const db = await HorseModel.bulkCreate(original);

        res.status(200).json({
          success: true,
          db,
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: err,
        });
      }
    }
  } else {
    res.status(409).json({ message: "file format is not valid" });
  }
});
exports.PedigreeHorse = Trackerror(async (req, res, next) => {
  let generation1 = await HorseModel.findOne({
    where: { _id: req.params.id },
    paranoid: false,
    attributes: ["Dam", "Sire", "shortCode", "_id", "DOB", "NameEn", "NameAr"],
    include: [
      {
        paranoid: false,
        model: db.HorseModel,
        as: "DamData",
        attributes: ["NameEn", "NameAr"],
      },
      {
        paranoid: false,
        model: db.HorseModel,
        as: "SireData",
        attributes: ["NameEn", "NameAr"],
      },
    ],
  });
  let generation2a = null;
  let generation2b = null;
  let generation3a = null;
  let generation3b = null;
  let generation3c = null;
  let generation3d = null;
  if (generation1) {
    generation2a = await HorseModel.findOne({
      where: { _id: generation1.Dam },
      paranoid: false,
      attributes: [
        "Dam",
        "Sire",
        "shortCode",
        "_id",
        "DOB",
        "NameEn",
        "NameAr",
      ],
      include: [
        {
          paranoid: false,
          model: db.HorseModel,
          as: "DamData",
          attributes: ["NameEn", "NameAr"],
        },
        {
          paranoid: false,
          model: db.HorseModel,
          as: "SireData",
          attributes: ["NameEn", "NameAr"],
        },
      ],
    });
  }
  if (generation1) {
    generation2b = await HorseModel.findOne({
      where: { _id: generation1.Sire },
      paranoid: false,
      attributes: [
        "Dam",
        "Sire",
        "shortCode",
        "_id",
        "DOB",
        "NameEn",
        "NameAr",
      ],
      include: [
        {
          paranoid: false,
          model: db.HorseModel,
          as: "DamData",
          attributes: ["NameEn", "NameAr"],
        },
        {
          paranoid: false,
          model: db.HorseModel,
          as: "SireData",
          attributes: ["NameEn", "NameAr"],
        },
      ],
    });
  }
  console.log(generation2a);

  if (generation2a) {
    generation3a = await HorseModel.findOne({
      where: { _id: generation2a.Dam },
      paranoid: false,
      attributes: [
        "Dam",
        "Sire",
        "shortCode",
        "_id",
        "DOB",
        "NameEn",
        "NameAr",
      ],
      include: [
        {
          paranoid: false,
          model: db.HorseModel,
          as: "DamData",
          attributes: ["NameEn", "NameAr"],
        },
        {
          paranoid: false,
          model: db.HorseModel,
          as: "SireData",
          attributes: ["NameEn", "NameAr"],
        },
      ],
    });
  }

  if (generation2a) {
    generation3b = await HorseModel.findOne({
      where: { _id: generation2a.Sire },
      paranoid: false,
      attributes: [
        "Dam",
        "Sire",
        "shortCode",
        "_id",
        "DOB",
        "NameEn",
        "NameAr",
      ],
      include: [
        {
          paranoid: false,
          model: db.HorseModel,
          as: "DamData",
          attributes: ["NameEn", "NameAr"],
        },
        {
          paranoid: false,
          model: db.HorseModel,
          as: "SireData",
          attributes: ["NameEn", "NameAr"],
        },
      ],
    });
  }
  if (generation2b) {
    generation3c = await HorseModel.findOne({
      where: { _id: generation2b.Dam },
      paranoid: false,
      attributes: [
        "Dam",
        "Sire",
        "shortCode",
        "_id",
        "DOB",
        "NameEn",
        "NameAr",
      ],
      include: [
        {
          paranoid: false,
          model: db.HorseModel,
          as: "DamData",
          attributes: ["NameEn", "NameAr"],
        },
        {
          paranoid: false,
          model: db.HorseModel,
          as: "SireData",
          attributes: ["NameEn", "NameAr"],
        },
      ],
    });
  }
  if (generation2b) {
    generation3d = await HorseModel.findOne({
      where: { _id: generation2b.Sire },
      paranoid: false,
      attributes: [
        "Dam",
        "Sire",
        "shortCode",
        "_id",
        "DOB",
        "NameEn",
        "NameAr",
      ],
      include: [
        {
          paranoid: false,
          model: db.HorseModel,
          as: "DamData",
          attributes: ["NameEn", "NameAr"],
        },
        {
          paranoid: false,
          model: db.HorseModel,
          as: "SireData",
          attributes: ["NameEn", "NameAr"],
        },
      ],
    });
  }

  res.status(200).json({
    success: true,
    generation1,
    generation2a,
    generation2b,
    generation3a,
    generation3b,
    generation3c,
    generation3d,
  });
});

exports.GetHorse = Trackerror(async (req, res, next) => {
  let data = await HorseModel.findAll({
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data,
  });
});

exports.SingleHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return new next("Horse is not available", 404);
  } else {
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.CreateHorse = Trackerror(async (req, res, next) => {
  const {
    STARS,
    CreationId,
    NameEn,
    DOB,
    NameAr,
    Owner,
    ActiveTrainer,
    Breeder,
    Trainer,
    Sex,
    Color,
    Earning,
    History,
    ActiveOwner,
    NationalityID,
    Foal,
    PurchasePrice,
    Cap,
    Rds,
    ColorID,
    HorseStatus,
    Dam,
    Sire,
    GSire,
    Height,
    KindHorse,
    shortCode,
    RemarksAr,
    RemarksEn,
  } = req.body;
  let data;
  if (req.files == null) {
    data = await HorseModel.create({
      NameEn: NameEn,
      DOB: DOB,
      NameAr: NameAr,
      ActiveTrainer: ActiveTrainer,
      Breeder: Breeder,
      RemarksEn: RemarksEn,
      Sex: Sex,
      Color: Color,
      Earning: Earning,
      History: History,
      STARS: STARS,
      ActiveOwner: ActiveOwner,
      NationalityID: NationalityID,
      Foal: Foal,
      PurchasePrice: PurchasePrice,
      Cap: Cap,
      Rds: Rds,
      ColorID: ColorID,
      CreationId: CreationId,
      HorseStatus: HorseStatus,
      Dam: Dam || null,
      Sire: Sire || null,
      GSire: GSire || null,
      Height: Height,
      KindHorse: KindHorse,
      shortCode: shortCode,
      RemarksAr: RemarksAr,
    });
  } else {
    const file = req.files.image;
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Horse}/${Image}`, file.mimetype);
    data = await HorseModel.create({
      HorseImage: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Horse}/${Image}`,
      NameEn: NameEn,
      DOB: DOB,
      NameAr: NameAr,
      ActiveTrainer: ActiveTrainer,
      Breeder: Breeder,
      RemarksEn: RemarksEn,
      Sex: Sex,
      Color: Color,
      Earning: Earning,
      History: History,
      STARS: STARS,
      ActiveOwner: ActiveOwner,
      NationalityID: NationalityID,
      Foal: Foal,
      PurchasePrice: PurchasePrice,
      Cap: Cap,
      Rds: Rds,
      ColorID: ColorID,
      CreationId: CreationId,
      HorseStatus: HorseStatus,
      Dam: Dam || null,
      Sire: Sire || null,
      GSire: GSire || null,
      Height: Height,
      KindHorse: KindHorse,
      shortCode: shortCode,
      RemarksAr: RemarksAr,
    });
  }

  if (data._id) {
    if (Owner) {
      let OwnerData = Conversion(Owner);
      // OwnerData.push(ActiveOwner);
      await OwnerData.map(async (singleOwner) => {
        await HorseOwnerComboModel.create({
          HorseModelId: data._id,
          OwnerModelId: singleOwner,
        });
      });
    }

    if (Trainer) {
      let TrainerData = Conversion(Trainer);
      // TrainerData.push(ActiveTrainer);
      await TrainerData.map(async (singleTrainer) => {
        await HorseTrainerComboModel.create({
          HorseModelId: data._id,
          TrainerModelId: singleTrainer,
        });
      });
    }

    // if (Jockey) {
    //   let JockeyData = Conversion(Jockey);
    //   console.log(JockeyData);
    //   await JockeyData.map(async (singleJockey) => {
    //     await HorseJockeyComboModel.create({
    //       HorseModelId: data._id,
    //       JockeyModelId: singleJockey,
    //     });
    //   });
    // }
    res.status(200).json({
      success: true,
      data,
    });
  } else {
    return next(new HandlerCallBack("Error Occured", 404));
  }
});
exports.UpdateHorse = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    DOB,
    NameAr,
    Breeder,
    RemarksEn,
    HorseRating,
    Sex,
    Color,
    RemarksAr,
    KindOfHorse,
    Dam,
    Sire,
    GSire,
    Earning,
    Foal,
    PurchasePrice,
    Cap,
    Rds,
    ColorID,
    NationalityID,
    CreationId,
    Height,
    KindHorse,
    ActiveTrainer,
    STARS,
    shortCode,
  } = req.body;
  let data = await HorseModel.findOne({
    where: { _id: req.params.id },
  });

  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    const updateddata = {
      HorseImage: data.HorseImage,
      NameEn: NameEn || data.NameEn,
      DOB: DOB || data.DOB,
      NameAr: NameAr || data.NameAr,
      Breeder: Breeder || data.Breeder,
      RemarksEn: RemarksEn || data.RemarksEn,
      RemarksAr: RemarksAr || data.RemarksAr,
      HorseRating: HorseRating || data.HorseRating,
      Sex: Sex || data.Sex,
      Color: Color || data.Color,
      KindOfHorse: KindOfHorse || data.KindOfHorse,
      Dam: Dam || data.Dam,
      Sire: Sire || data.Sire,
      GSire: GSire || data.GSire,
      Earning: Earning || data.Earning,
      Foal: Foal || data.Foal,
      PurchasePrice: PurchasePrice || data.PurchasePrice,
      Cap: Cap || data.Cap,
      Rds: Rds || data.Rds,
      ColorID: ColorID || data.ColorID,
      CreationId: CreationId || data.CreationId,
      Height: Height || data.Height,
      NationalityID: NationalityID || data.NationalityID,
      KindHorse: KindHorse || data.KindHorse,
      ActiveTrainer: ActiveTrainer || data.ActiveTrainer,
      STARS: STARS || data.STARS,
      shortCode: shortCode || data.shortCode,
    };
    data = await HorseModel.update(updateddata, {
      where: {
        _id: req.params.id,
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  } else {
    const file = req.files.Horseimage;
    await deleteFile(`${Horse}/${data.Horseimage}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(
      req.files.Horseimage.data,
      214,
      212
    );
    await uploadFile(fileBuffer, `${Horse}/${Image}`, file.mimetype);
    const updateddata = {
      HorseImage: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Horse}/${Image}`,
      NameEn: NameEn || data.NameEn,
      NameEn: NameEn || data.NameEn,
      NameEn: NameEn || data.NameEn,
      DOB: DOB || data.DOB,
      NameAr: NameAr || data.NameAr,
      Breeder: Breeder || data.Breeder,
      RemarksEn: RemarksEn || data.RemarksEn,
      HorseRating: HorseRating || data.HorseRating,
      Sex: Sex || data.Sex,
      Color: Color || data.Color,
      KindOfHorse: KindOfHorse || data.KindOfHorse,
      Dam: Dam || data.Dam,
      Sire: Sire || data.Sire,
      GSire: GSire || data.GSire,
      Earning: Earning || data.Earning,
      Foal: Foal || data.Foal,
      PurchasePrice: PurchasePrice || data.PurchasePrice,
      Cap: Cap || data.Cap,
      Rds: Rds || data.Rds,
      ColorID: ColorID || data.ColorID,
      NationalityID: NationalityID || data.NationalityID,
      CreationId: CreationId || data.CreationId,
      Height: Height || data.Height,
      KindHorse: KindHorse || data.KindHorse,
      ActiveTrainer: ActiveTrainer || data.ActiveTrainer,
      shortCode: shortCode || data.shortCode,
      RemarksAr: RemarksAr || data.RemarksAr,
    };
    data = await HorseModel.update(updateddata, {
      where: {
        _id: req.params.id,
      },
    });

    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.DeleteHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Horse}/${data.HorseImage.slice(-64)}`);
  await HorseModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  let checkcode = await HorseModel.findOne({
    paranoid: false,
    where: { shortCode: -data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    console.log("hello");
    let [result] = await HorseModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-result.dataValues.maxshortCode, "dsd");
    await HorseModel.update(
      { shortCode: -result.dataValues.maxshortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    await HorseModel.destroy({
      where: { _id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  } else {
    console.log(data.shortCode);
    await HorseModel.update(
      { shortCode: -data.shortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );

    await HorseModel.destroy({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  }
});
