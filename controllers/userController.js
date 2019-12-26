import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
  } = req;
  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User({
        name,
        email
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
    }
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = passport.authenticate("local", {
  successRedirect: routes.home,
  failureRedirect: routes.login
});

export const logout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};

export const users = (req, res) => res.render("users", { pageTitle: "Users" });

export const userDetail = (req, res) =>
  res.render("userDetail", { pageTitle: "UserDetail" });

export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "EditProfile" });

export const postEditProfile = (req, res) => {
  const {
    body: { file, name, email }
  } = req;
  res.redirect(routes.userDetail(1));
};

export const changePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "ChangePassword" });

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    // eslint-disable-next-line camelcase
    _json: { id, name, avatar_url, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      avatarUrl: avatar_url,
      githubId: id
    });
    console.log(newUser);
    return cb(null, newUser);
  } catch (error) {
    console.log(error);
    return cb(error);
  }
};

export const postGithubLogIn = (req, res) => {
  res.redirect(routes.home);
};

export const googleLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { sub, name, picture }
  } = profile;
  try {
    const user = await User.findOne({ name });
    if (user) {
      user.googleId = sub;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      name,
      googleId: sub,
      avatarUrl: picture
    });
    console.log(newUser);
    return cb(null, newUser);
  } catch (error) {
    console.log(error);
    return cb(error);
  }
};

export const postGoogleLogIn = (req, res) => {
  res.redirect(routes.home);
};
