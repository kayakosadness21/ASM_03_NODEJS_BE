const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("express-validator");
// Tiêu chí số 3: Chức năng xác thực tài khoản (client)
const handleUserLogin = (req, res, next) => {
  try {
    const { email, password } = req.body;
    const error = validator.validationResult(req);
    // Validate user input
    if (!(email || password)) {
      res.status(400).send("All input is required");
      return;
    }
    if (!error.isEmpty()) {
      res.status(422).json({ message: error.array()[0].msg });
      return;
    }
    // get user from DB
    User.findOne({ email: email })
      .then(async (user) => {
        // check user & pass
        if (!user) {
          res.status(420).json({
            message: "User is not existed",
          });
          return;
        }
        const isMatchPass = await bcrypt.compare(password, user.password);
        if (!isMatchPass) {
          res.status(421).json({
            message: "Wrong password",
          });
          return;
        }
        // Create token
        const token = jwt.sign(
          {
            userId: user._id,
            email: user.email,
          },
          process.env.TOKEN_KEY, // mysecret, it should be make by romdom function
          { expiresIn: process.env.EXPIRES_IN }
        );
        user.token = token;
        await user.save();
        res.status(200).json({
          message: "ok",
          user: {
            userId: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
            token: user.token,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log("CHECK Error: ", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
// Tạo chức năng Đăng Nhập/Đăng Ký và Đăng Xuất 
const handleUserSignUp = async (req, res, next) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;
    const error = validator.validationResult(req);
    // Validate user input
    if (!(fullName || email || password || phoneNumber)) {
      res.status(400).send("All input is required");
      return;
    }
    // check error
    if (!error.isEmpty()) {
      // check fullName
      if (
        error.array()[0].msg ===
        "Enter fullName atleast 5 characters and max 20 characters"
      ) {
        res.status(424).json({
          message: error.array()[0].msg,
        });
        return;
      }
      // check email
      if (error.array()[0].msg === "Enter email is invalid, try again") {
        res.status(420).json({
          message: error.array()[0].msg,
        });
        return;
      }
      if (error.array()[0].msg === "Email is existed, please try again") {
        res.status(421).json({
          message: error.array()[0].msg,
        });
        return;
      }
      // check password
      if (
        error.array()[0].msg === "Length of password from 6-9 character." ||
        error.array()[0].msg ===
          "Password have to contain upper case, lower case & number"
      ) {
        res.status(422).json({
          message: error.array()[0].msg,
        });
        return;
      }
      // check phoneNumber
      if (
        error.array()[0].msg ===
          "Length of phone number from 9 - 12. and is number" ||
        error.array()[0].msg === "Your input is not type of phone number"
      ) {
        res.status(423).json({
          message: error.array()[0].msg,
        });
        return;
      }
    }
    // Mã hóa mk bằng chuỗi: Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // create user
    const user = new User({
      email: email,
      password: encryptedPassword,
      fullName: fullName,
      phoneNumber: phoneNumber,
      address: null,
      isAdmin: false,
      isCounselor: false,
      token: null,
    });
    user.save();
    res.status(200).json({
      message: "ok",
      exist: false,
    });
  } catch (error) {
    console.log("check: ", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  handleUserLogin,
  handleUserSignUp,
};
