const User = require("../Model/User")
const crypto = require("crypto");
const { errorHandler } = require("../util/errorHandler");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const sengridTransport = require("nodemailer-sendgrid-transport");
// const Token = require("../model/token");
require("dotenv").config();

const { validationResult } = require("express-validator");
const passport = require("passport");
const facebookTokenStrategy = require("passport-facebook-token");
// const transporter = nodemailer.createTransport(
//   sengridTransport({
//     auth: {
//       api_key: process.env.api_key,
//     },
//   })
// );

const checkErrors = function (req, res, next, errorMessage, errorStatusCode) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array())
    errorHandler(errorMessage, errorStatusCode, errors.array());
    
  }
};
exports.signUp = async (req, res, next) => {
  try {
    checkErrors(req, res, next, "Validation failed", 422);

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
     const subscription =  req.body.subscription;
    // console.log("worked")
    const hashedpassword = await bcrypt.hash(password, 12);
    // console.log(hashedpassword);
    const user = new User({
      name: name,
      email: email,
      password: hashedpassword,
      subscription: Boolean(subscription)
    });
    const newUser = await user.save();
    // console.log(newUser);
    // const info = await transporter.sendMail({
    //   to: email,
    //   from: process.env.myemail,
    //   subject: "Verify your email",
    //   html: "<h1>Verify email</h1>",
    // });
    // res.status(200).json({
    //   message: "User created",
    //   user: newUser,
    // });
    res.redirect("/login")
  } catch (err) {
    // console.log(err);
    let error=err.data.map(data=>data.msg).join('\n')
    req.flash("error" ,error )
    // console.log(error);
    res.redirect("/signup")
  }
};

exports.login = async (req, res, next) => {
  try {
    checkErrors(req, res, next, "Validation failed", 422);
    const email = req.body.email;
    const password = req.body.password;

    // console.log(email , password)
    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash("error" ,"Incorrect password or email" )
   
   return res.redirect("/login");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      req.flash("error" ,"Incorrect password or email")
   
    return  res.redirect("/login");}
    // }}
    // console.log(req.useragent);
    // console.log(req.ip);
   
    // const logInInfo  = await transporter.sendMail({
    //     to:email,
    //     from:process.env.myemail,
    //     subject:"You just logged in",
    //     html:`<h1>You just logged in </h1><p>IpAddress:${req.ip}</p><p>Browser:${req.useragent.browser}</p>
    //     <a href="http://localhost:8080/page/page1?q=2">Link</a>`
    // })
    // const token = jwt.sign(
    //   { email: user.email, id: user._id.toString() , admin:user.admin },
    //   process.env.secret,
    //   { expiresIn: "1h" }
    // );
     
  
   
    // res.status(200).json({
    //   message: "Logged in",
    //   token: token,
    //   email: user.email,
    //   name: user.name,
    //   admin: user.admin,
    // });
    req.session.isLoggedIn = true;
    req.session.user = user;
 
    res.redirect("/");
  } catch (err) {
    // if (!err.statusCode) {
    //   err.statusCode = 500;
    // }
    // next(err);
    // console.log(err)
    let error=err.data.map(data=>data.msg).join('\n')
    req.flash("error" ,error )
    // console.log(error);
    res.redirect("/login");
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    // console.log(err);
    res.redirect('/');
  });
};

exports.requestPasswordReset = async (req, res, next) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email: email });

    if (!user) {
      errorHandler("No user with email found", 404);
    }

    let token = await Token.findOne({ user: user._id });
    if (token) {
      await token.deleteOne();
    }

    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 12);

    await new Token({
      user: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    await transporter.sendMail({
      to: email,
      from: process.env.myemail,
      subject: "Password reset",
      html: `<p>Password reset click     <a href="http://localhost:8080?resetToken=${resetToken}&id=${user._id}">Link</a></p>`,
    });

    res.status(200).json({
      message: "Email sent successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken, id } = req.body;
    const password = req.body.password;
    const passwordToken = await Token.findOne({ user: id });
    if (!passwordToken) {
      errorHandler("Invalid token or token has expired", 404);
    }
    // console.log(passwordToken);
    const isValid = await bcrypt.compare(resetToken, passwordToken.token);
    if (!isValid) {
      errorHandler("Invalid token or token has expired", 404);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.updateOne(
      { _id: id },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    const user = await User.findById(id);

    await transporter.sendMail({
      to: user.email,
      from: process.env.myemail,
      subject: "Password reset successfully",
      html: `<p>Password reset click successfully</p>`,
    });

    await passwordToken.deleteOne();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
// console.log(process.env.facebook_Client_ID);
exports.facebookPassport = passport.use(
  new facebookTokenStrategy(
    {
      clientID: 374249577636507,
      clientSecret: "81cbe1d3455d87430be79396d49e6773",
      fbGraphVersion: "v3.0",
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log(profile);
      User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

exports.fbauth = (req, res) => {
  if (req.user) {
    var token = jwt.sign(
      {
        _id: req.user._id,
      },
      process.env.secret,
      { expiresIn: "1hr" }
    );
    res.status(200).json({
      message: "Logged in",
      token: token,
    });
  }
};
