# devtinder api's

authRouter
POST /signup
POST /login
POST /logout =

profileRouter
GET /profile/view
PATCH/profile/edit
PATCH/profile/password =

STATUS: profile => ignore ,interested,accepted,rejected

connectionRequestsRouter
POST /request/send/:status/:userid
POST /request/review/:status/:reqId


userRouter
GET /user/request/pending
GET /user/connections
GET /user/feed => get uou the profiles


PATCH

DELETE
