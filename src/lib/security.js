import AuthHeader from "./auth-header";

const checkUserToken = (req, res, next) => {
  try {
    const user = AuthHeader.decodeUserLoginAuth(req.headers["x-access-token"]);
    if (user.id !== undefined) {
      req.user = user;
      next();
    } else {
      return res.status(401).send({
        status: false,
        message: "token_error",
      });
    }
  } catch (err) {
    return res.status(401).send({
      status: false,
      message: "token_error",
    });
  }
};

export default {
  checkUserToken,
};
