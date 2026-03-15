const express         = require("express");
const router          = express.Router();
const adminController = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/protect");

router.get("/admin",          protect, adminOnly, adminController.dashboard);

router.get("/admin/guards",          protect, adminOnly, adminController.getGuards);
router.get("/admin/guards/:id",      protect, adminOnly, adminController.getGuardTimecard);
router.post("/admin/guards/:id/delete", protect, adminOnly, adminController.deleteGuard);

router.get("/admin/sites",           protect, adminOnly, adminController.getSites);
router.post("/admin/sites",          protect, adminOnly, adminController.createSite);
router.post("/admin/sites/:id/delete",      protect, adminOnly, adminController.deleteSite);
router.post("/admin/sites/remove-guard",    protect, adminOnly, adminController.removeGuardFromSite);

router.post("/admin/assign-guard",   protect, adminOnly, adminController.assignGuard);

router.get("/admin/requests",        protect, adminOnly, adminController.timeOffRequests);
router.post("/admin/request/update", protect, adminOnly, adminController.updateRequest);

module.exports = router;