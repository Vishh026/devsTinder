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
POST /request/:status/:userid

POST /request/intereted/:userid
POST /request/ignored/:userid



POST /request/review/accepted/:reqId
POST /request/review/rejected/:reqId

userRouter
GET /user/connections
GET /user/received
GET /user/feed => get uou the profiles



PATCH

DELETE
