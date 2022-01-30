const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const JWTD=require('')
// const secret = "jngioiuhjnklotr--tsvb";
const res = require("express/lib/response");

const hashing = async (value) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(value, salt);
    //res.send({ message: hash });
    console.log("Salt", salt, hash);
    return hash;
  } catch (error) {
    console.log(error);
  }
};

const hashCompare = async (password, hashValue) => {
  try {
    return bcrypt.compareSync(password, hashValue);
  } catch (error) {
    console.log(error);
  }
};

// const createJWT = async ({ userEmail }) => {
//   return await jwt.sign({ userEmail }, secret, { expiresIn: "2m" });
// };

// const role = async (req, res, next) => {
//   if (req.body.role == 1) {
//     next();
//   } else if (req.body.role == 2) res.json({ message: "Soory No access" });
// };

module.exports = { hashing, hashCompare };
