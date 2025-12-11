const validator = require("validator");

const validatingSignUpData = (req, res) => {
  const { firstName, lastName, email, password, dateOfBirth } = req.body;
  const dob = new Date(dateOfBirth)
  const age = new Date().getFullYear() - dob.getFullYear()

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ error: "Password is weak" });
  }
  if (age < 16) {
    return res.status(400).json({ error: "Must be 16+" });
  }
};

const validateProfileEditData = (req,res) => {
  const allowedUpdates = ["gender","dateOfBirth","age", "bio", "skills","phone","githubUrl","profile", "experience","firstName","lastName"];

  const isUpdatesAllowed = Object.keys(req.body).every(field => allowedUpdates.includes[field])
  console.log(isUpdatesAllowed);
  
  return isUpdatesAllowed;
}

module.exports = { validatingSignUpData ,validateProfileEditData};
