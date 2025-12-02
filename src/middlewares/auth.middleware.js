const userAuth = (req,res,next) => {
    console.log("Authentication middleware working fine");
    next()
}

const adminAuth = (req,res,next) => {
    console.log("Admin Authentication middleware working fine");
    next()
}

module.exports = {
    userAuth,
    adminAuth
}