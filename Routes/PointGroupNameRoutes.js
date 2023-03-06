const express = require("express");
const router = express.Router();
const {
  PointGroupNameGet,
  CreatePointGroupName,
  EditPointGroupName,
  DeletePointGroupName,
  SoftDeletePointGroupName,
  SingleCompetitonCategoryGet,
  RestoreSoftDeletedPointGroupName,
  GetDeletedPointGroupName,
  SearchPointGroupName,
} = require("../Controller/PointGroupNameController");
router.route("/PointGroupNamegetdeleted").get(GetDeletedPointGroupName);
router.route("/searchPointGroupName").get(SearchPointGroupName);
router
  .route("/restoresoftdeletePointGroupName/:id")
  .post(RestoreSoftDeletedPointGroupName);
const { upload } = require("../Utils/ImageUpload");
router
  .route("/uploadPointGroupName", upload.single("image"))
  .post(CreatePointGroupName);
router.route("/PointGroupNameget").get(PointGroupNameGet);
router.route("/deletePointGroupName/:id").delete(DeletePointGroupName);
router
  .route("/updatePointGroupName/:id", upload.single("image"))
  .put(EditPointGroupName);
router.route("/softdeletePointGroupName/:id").delete(SoftDeletePointGroupName);
router.route("/getPointGroupName/:id").get(SingleCompetitonCategoryGet);
module.exports = router;
