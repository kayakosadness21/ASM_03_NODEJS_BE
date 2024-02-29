const express = require("express");
const router = express.Router();
const validator = require("express-validator");
const ServiceRole = require("../services/service.role");
const ControllerRole = require("../controllers/controller.role");

router.get("/", ControllerRole.getAllRole);

// Create role from Admin
router.post("/new",
  [
    validator
      .check("name")
      .isLength({ min: 2, max: 20 })
      .withMessage("Enter name role atleast 5 characters and max 20 characters")
      .custom(async (value, { req }) => {
        let { status } = await ServiceRole.getRoleByName(value)
        if (status) {
          throw new Error("Role is existed, please try again");
        }
        return true;
      }),
  ],
  ControllerRole.newRole);

module.exports = router;
