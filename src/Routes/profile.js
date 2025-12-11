const express = require('express')
const profileRouter = express.Router()
const {userAuth} = require("../middlewares/auth.middleware");
const { validateProfileEditData } = require('../utilities/ValidatingData');

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw new Error("user not found");
    res.status(201).json({ user: user, message: "cookies etfch suucessfuly" });
  } catch (err) {
    return res.status(401).json("error: " + err.message);
  }
});

profileRouter.patch('/profile/edit',userAuth,async(req,res)=> {
  try {
      // get loggedinuser
      const loggedInUser = req.user;

      // loop through the updates
      Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key] )

      await loggedInUser.save()

      res.json({
        message: `${loggedInUser.firstName},Your Profile Updated successfully`,
        user:loggedInUser
      })

    
  } catch (error) {
    return res.status(401).send(error.message);
  }
})

module.exports = profileRouter