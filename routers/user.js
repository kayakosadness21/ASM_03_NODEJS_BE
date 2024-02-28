const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const validator = require("express-validator");
const User = require("../models/user");

// router.get("/:userId/get-trans", userController.handleUserGetTrans);

router.post(
  "/login",
  [
    validator
      .check("email")
      .isEmail()
      .withMessage("Enter email is invalid, try again"),
  ],
  userController.handleUserLogin
);

// router.post("/create-trans", userController.handleUserCreateTrans);

router.post(
  "/signup",
  [
    validator
      .check("fullName")
      .isLength({ min: 5, max: 20 })
      .withMessage("Enter fullName atleast 5 characters and max 20 characters"),
    validator
      .check("email")
      .isEmail()
      .withMessage("Enter email is invalid, try again")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error("Email is existed, please try again");
        }
        return true;
      }),
    validator
      .check("password")
      .isLength({ min: 6, max: 9 })
      .withMessage("Length of password from 6-9 character.")
      .custom((value) => {
        if (
          !value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
        ) {
          throw new Error(
            "Password have to contain upper case, lower case & number"
          );
        }
        return true;
      }),
    validator
      .check("phoneNumber")
      .isLength({ min: 9, max: 12 })
      .withMessage("Length of phone number from 9 - 12. and is number")
      .isMobilePhone()
      .withMessage("Your input is not type of phone number"),
  ],
  userController.handleUserSignUp
);

module.exports = router;
