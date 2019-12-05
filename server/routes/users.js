const router = require("express").Router();
const jwt = require("jsonwebtoken");
const securePin = require("secure-pin");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { authenticate, checkRole } = require("../utils/middlewares");

// @access  Public - for now
// @desc    Create user account
// @route   POST /create
router.post("/create", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });

    // if exists - return error
    if (user) {
      return res.status(409).json({
        error: "Email is already in use"
      });
    }

    // generate pin
    const pin = securePin.generatePinSync(4);

    // gen salt & hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // if false - create user
    const newUser = new User({
      email,
      password: hash,
      pin
    });

    // save user creation
    await newUser.save();

    // return data
    return res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    console.error(error);
  }
});

// @access  Public
// @desc    Log user account
// @route   POST /login
router.post("/login", async (req, res) => {
  try {
    const { pin, password } = req.body;
    // find user by pin
    const user = await User.findOne({ pin });
    // if no user - return error
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    } else {
      // else - compare passwords
      const isMatch = await bcrypt.compare(password, user.password);

      // if no match - return error
      if (!isMatch) {
        return res.status(403).json({
          error: "Incorrect password"
        });
      } else {
        // else - sign jwt & return user
        const payload = {
          _id: user._id,
          role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1d"
        });

        return res.status(200).json({
          success: true,
          data: {
            user,
            token
          }
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
});

// @access Public - will be private
// @desc   Fetch all users
// @route  GET /
router.get("/", authenticate, checkRole("staff"), async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).json({
        error: "Users not found"
      });
    } else {
      return res.status(200).json({
        success: true,
        data: users
      });
    }
  } catch (error) {
    console.error(error);
  }
});

// @access Public - will be private
// @desc   Fetch user by id
// @route  GET /:userId
router.get("/:userId", async (req, res) => {
  try {
    const _id = req.params.userId;
    const user = await User.findById({ _id });

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    } else {
      return res.status(200).json({
        success: true,
        data: user
      });
    }
  } catch (error) {
    console.error(error);
  }
});

// @access Public - will be private
// @desc   Delete user by id
// @route  DELETE /:userId
router.delete("/:userId", async (req, res) => {
  try {
    const _id = req.params.userId;
    const user = await User.findByIdAndDelete({ _id });
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    } else {
      return res.status(200).json({
        deleted: true,
        data: user
      });
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
