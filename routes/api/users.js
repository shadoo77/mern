const express = require("express");
const cors = require("cors");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../../config/keys");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get("/test", cors(), (req, res) => {
  res.status(200).json({ msg: "User works!" });
});

// @route  GET api/users/register
// @desc   Register user
// @access Public
router.post("/register", cors(), (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { name, email, password } = req.body;
  User.findOne({ email: email }).then(user => {
    if (user)
      return res.status(400).json({ email: "Email is already existed!" });
    else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });

      const newUser = new User({
        name: name,
        email: email,
        avatar,
        password: password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.status(200).json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route  GET api/users/login
// @desc   Login user / return token
// @access Public
router.post("/login", cors(), (req, res) => {
  const { email, password } = req.body;
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // find user by email
  User.findOne({ email })
    .then(user => {
      if (!user) {
        errors.email = "User not found!";
        return res.status(404).json(errors);
      }
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            //return res.status(200).json({ msg: 'password successed!' });
            // create web token / sign token
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            };
            jwt.sign(
              payload,
              keys.secretKEY,
              { expiresIn: "1h" },
              (err, token) => {
                if (err) throw err;
                else {
                  return res.json({
                    msg: "token is successful registered!",
                    token: "Bearer " + token
                  });
                }
              }
            );
          } else {
            errors.password = "Password is incorrect!";
            return res.status(400).json(errors);
          }
        })
        .catch();
    })
    .catch();
});

// @route  GET api/users/current
// @desc   return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
  }
);

module.exports = router;
