const jwt = require("jsonwebtoken");
const secret = "gaurav";

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("authtoken");

    if (!token) {
      res
        .status(401)
        .send({ error: "Please authenticate using a valid token" });
    }

    const data = await jwt.verify(token, secret);
    req.user = data.user;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = authenticate;
