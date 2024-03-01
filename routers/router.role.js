const express = require("express");
const router = express.Router();
const validator = require("express-validator");
const ServiceRole = require("../services/service.role");
const ControllerRole = require("../controllers/controller.role");

router.get("/:id", ControllerRole.getRoleById);
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

  router.post("/update",
  [
    validator
      .check("id")
      .not()
      .isEmpty()
      .withMessage("ID role can't empty"),

    validator
      .check("name")
      .not()
      .isEmpty()
      .withMessage("Name role can't empty")
      .custom(async (value, { req }) => {
        let { status } = await ServiceRole.getRoleByName(value)
        if (status) {
          throw new Error("Role is existed, please try again");
        }
        return true;
      })
  ],
  ControllerRole.updateRole)

router.post("/destroy",
  [
    validator
      .check("id")
      .not()
      .isEmpty()
      .withMessage("ID role can't empty")
      .custom(async (value, { req }) => {
        let { status, role } = await ServiceRole.getRoleByName(value)
        if (status && role.users.length) {
          throw new Error("Role has associated can't destroy");
        }
        return true;
      }),
  ],
  ControllerRole.destroyRole)

module.exports = router;
