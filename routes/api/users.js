const express = require("express");
const router = express.Router();
const User = require('../../models/User');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const jwt = require('jsonwebtoken');
const passport = require("passport");

router.get("/current", passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      handle: req.user.handle,
      email: req.user.email
    });
  }
);

module.exports = router;

// sign up
// handler function is essentially your controller
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //see if user already exists
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      // Use the validations to send the error
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        handle: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      // hash password before saving to MongoDB
      // number of rounds to generate salt
      // second arg, callback function that executes after salt generated
      bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err
              newUser.password = hash; // set users password to the hash
              newUser.save()
                .then((user) => res.json(user)) // get user from DB
                .catch(err => console.log(err))
          })
      })
    }
  });
});

//login
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // calling a method on the user model from mongoose
  User.findOne({ email })
    .then(user => {
        if (!user) {
        // Use the validations to send the error
        errors.email = "User not found";
        return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password)
        .then(isMatch => {
            if (isMatch) {
                const payload = {
                    id: user.id,
                    handle: user.handle,
                    email: user.email
                }
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    { expiresIn: 3600 },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    });
                } else {
                // And here:
                    errors.password = "Incorrect password";
                    return res.status(400).json(errors);
            }
        });
    });
});
